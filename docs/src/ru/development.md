# Руководство по разработке

## Архитектура проекта

Media Downloader следует принципам чистой архитектуры с четким разделением между слоями.

## Архитектура Backend (Rust)

### Основные компоненты

**Слой экстракторов**

Система экстракторов - это сердце приложения. Каждая платформа имеет свой экстрактор, реализующий трейт `MediaExtractor`.

```rust
pub trait MediaExtractor: Send + Sync {
    fn detect(&self, url: &str) -> bool;
    async fn extract_info(&self, url: &str) -> Result<MediaInfo>;
    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String>;
}
```

Как это работает:

`detect()` проверяет, соответствует ли URL паттерну платформы. Например, для YouTube это может быть проверка на наличие "youtube.com" или "youtu.be" в URL.

`extract_info()` получает метаданные видео или аудио - название, длительность, превью, список доступных форматов. Это основной метод для получения информации о медиа.

`get_download_url()` генерирует прямую ссылку для скачивания в выбранном формате.

**Слой сервисов**

Бизнес-логика инкапсулирована в сервисах:

`YtDlpService` - обертка вокруг subprocess yt-dlp

Этот сервис запускает yt-dlp как отдельный процесс и парсит его вывод. yt-dlp - это мощный инструмент командной строки для скачивания видео с множества платформ. Мы используем его как fallback, когда нет специализированного экстрактора, или когда нужна надежная работа.

Выполняет команды yt-dlp через Tokio subprocess для асинхронной работы.

Парсит JSON вывод yt-dlp и преобразует его в наши структуры данных.

Обрабатывает ошибки и может делать повторные попытки при сетевых сбоях.

`Downloader` - сервис управления файлами

Создает временные файлы с уникальными именами (UUID) для каждого скачивания.

Управляет жизненным циклом скачивания от начала до конца.

Очищает устаревшие файлы (старше 1 часа) для экономии дискового пространства.

**Слой обработчиков**

HTTP обработчики запросов используют фреймворк Axum:

`extract` - анализирует URL и возвращает метаданные медиа

`download` - инициирует скачивание и возвращает путь к файлу

`formats` - возвращает список доступных форматов для URL

`health` - проверка здоровья сервиса

### Поток данных

```
Запрос пользователя → Обработчик → Экстрактор → yt-dlp → FFmpeg → Файл → Пользователь
```

Детальный поток:

**Поток извлечения информации:**

```
POST /api/extract
  ↓
extract_handler()
  ↓
detect_platform(url) - находит подходящий экстрактор
  ↓
extractor.extract_info(url)
  ↓
YtDlpService.extract_info()
  ↓
Выполнение: yt-dlp --dump-json URL
  ↓
Парсинг JSON ответа
  ↓
Возврат MediaInfo{title, duration, formats[]}
```

Функция `detect_platform()` проходит по списку всех экстракторов и вызывает их метод `detect()`. Первый экстрактор, который вернет `true`, будет использован для обработки URL. Это паттерн "цепочка ответственности" (Chain of Responsibility).

**Поток скачивания:**

```
POST /api/download
  ↓
download_handler()
  ↓
Downloader.download(url, format, audio_only)
  ↓
Генерация временного имени файла: UUID.ext
  ↓
YtDlpService.download() или download_audio()
  ↓
Выполнение: yt-dlp -f FORMAT -o PATH URL
  ↓
Файл сохранен в /tmp/media-downloader/
  ↓
Возврат URL для скачивания: /downloads/UUID.ext
  ↓
Пользователь скачивает через ServeDir
```

`ServeDir` - это middleware из tower-http, который обслуживает статические файлы из директории. Мы используем его для отдачи скачанных медиа-файлов пользователю.

### Реализация экстрактора

Каждый экстрактор следует этому паттерну:

```rust
pub struct YouTubeExtractor;

impl MediaExtractor for YouTubeExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("youtube.com") || url.contains("youtu.be")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        // Платформо-специфичная логика или fallback на yt-dlp
        let ytdlp = YtDlpService::new();
        ytdlp.extract_info(url).await
    }

    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String> {
        // Генерация прямой ссылки для скачивания
    }
}
```

Структура экстрактора обычно пустая (unit struct), так как вся логика в методах трейта. Это делает экстракторы легковесными и позволяет легко создавать их экземпляры.

### Обработка ошибок

Ошибки обрабатываются на нескольких уровнях:

**Уровень сервиса:**

```rust
pub async fn extract_info(&self, url: &str) -> Result<YtDlpInfo> {
    let output = TokioCommand::new("yt-dlp")
        .args(["--dump-json", url])
        .output()
        .await
        .context("Failed to execute yt-dlp")?;

    if !output.status.success() {
        anyhow::bail!("yt-dlp failed: {}", error);
    }
    // ...
}
```

Мы используем библиотеку `anyhow` для удобной обработки ошибок. Метод `.context()` добавляет контекст к ошибке, что помогает при отладке. Макрос `bail!` создает и возвращает ошибку.

**Уровень обработчика:**

```rust
match downloader.download(url, format).await {
    Ok(filepath) => Json(DownloadResponse { ... }),
    Err(e) => ErrorResponse {
        error: format!("Download failed: {}", e)
    }.into_response()
}
```

Обработчики преобразуют внутренние ошибки в HTTP ответы с понятными сообщениями для пользователя.

### Модель конкурентности

Backend использует Tokio для асинхронных операций:

Каждый запрос выполняется в своей задаче (task). Tokio автоматически распределяет задачи по потокам.

Subprocess yt-dlp запускается асинхронно, не блокируя другие запросы.

Файловый ввод-вывод неблокирующий благодаря `tokio::fs`.

Множество скачиваний могут выполняться одновременно без блокировки друг друга.

Это позволяет обрабатывать сотни одновременных запросов на одном сервере.

## Архитектура Frontend (React)

### Структура компонентов

```
App (главный контейнер)
├── URLInput (ввод и валидация URL)
├── MediaPreview (отображение информации о видео/аудио)
├── FormatSelector (выбор качества и формата)
├── DownloadButton (инициация скачивания)
└── PlatformBadges (показывает поддерживаемые платформы)
```

### Управление состоянием

Используются React хуки для локального состояния:

```typescript
const [mediaInfo, setMediaInfo] = useState<ExtractResponse | null>(null);
const [selectedFormat, setSelectedFormat] = useState<string>('');
const [audioOnly, setAudioOnly] = useState(false);
```

Состояние хранится в главном компоненте `App` и передается вниз через props. Это простой паттерн для небольших приложений. Для более сложных приложений можно использовать Context API или Redux.

### Коммуникация с API

Сервис `api.ts` обрабатывает всю коммуникацию с backend:

```typescript
export const api = {
  async extract(url: string): Promise<ExtractResponse> {
    const response = await axios.post('/api/extract', { url });
    return response.data;
  },

  async download(request: DownloadRequest): Promise<DownloadResponse> {
    const response = await axios.post('/api/download', request);
    return response.data;
  }
};
```

Axios автоматически обрабатывает JSON сериализацию/десериализацию и добавляет правильные заголовки.

### Тема Material Design 3

Кастомная тема на основе спецификаций M3:

```typescript
export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#6750A4' },
        secondary: { main: '#625B71' },
      }
    },
    dark: {
      palette: {
        primary: { main: '#D0BCFF' },
        secondary: { main: '#CCC2DC' },
      }
    }
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Roboto' }
});
```

Material Design 3 использует систему динамических цветов, где все цвета интерфейса генерируются из одного базового цвета. Это обеспечивает гармоничный внешний вид.

## Рабочий процесс разработки

### Настройка окружения разработки

```bash
# Клонирование репозитория
git clone https://github.com/cryals/qruster.git
cd qruster

# Настройка backend
cd backend
cargo build
cargo test

# Настройка frontend
cd ../frontend
npm install
npm run dev

# Запуск обоих
cd ..
./scripts/run.sh  # Выбрать Development
```

### Стиль кода

**Rust:**

Следуйте стандартному стилю Rust.

Запускайте `cargo fmt` перед коммитом для автоформатирования.

Запускайте `cargo clippy` для обнаружения проблем и улучшений.

Добавляйте тесты для новых функций.

**TypeScript/React:**

Используйте функциональные компоненты с хуками.

Следуйте правилам ESLint.

Используйте типы TypeScript, избегайте `any`.

Держите компоненты маленькими и сфокусированными.

### Тестирование

**Backend:**

```bash
cd backend
cargo test
cargo clippy
```

**Frontend:**

```bash
cd frontend
npm run lint
npm run build
```

### Добавление новой платформы

Чтобы добавить поддержку новой платформы:

**Шаг 1: Создать файл экстрактора**

```bash
touch backend/src/extractors/newplatform.rs
```

**Шаг 2: Реализовать MediaExtractor**

```rust
use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct NewPlatformExtractor;

#[async_trait]
impl MediaExtractor for NewPlatformExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("newplatform.com")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        // Реализация
    }

    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String> {
        // Реализация
    }
}
```

**Шаг 3: Зарегистрировать в mod.rs**

```rust
pub mod newplatform;

// В функции detect_platform():
Box::new(newplatform::NewPlatformExtractor),
```

**Шаг 4: Тестирование**

```bash
cargo test
# Ручное тестирование с реальными URL
```

**Шаг 5: Обновить документацию**

Добавить в `docs/src/en/platforms.md` и `docs/src/ru/platforms.md`

### Отладка

**Логи backend:**

```bash
RUST_LOG=debug cargo run
```

**Инструменты разработчика frontend:**

Откройте DevTools браузера.

Проверьте вкладку Network для API вызовов.

Проверьте Console на ошибки.

### Оптимизация производительности

**Backend:**

Используйте connection pooling для HTTP запросов.

Кэшируйте метаданные когда возможно.

Реализуйте rate limiting по IP.

Используйте streaming для больших файлов.

**Frontend:**

Ленивая загрузка компонентов.

Оптимизация размера bundle.

Используйте React.memo для дорогих компонентов.

Debounce для ввода URL.

## Развертывание

### Development развертывание

```bash
./scripts/setup.sh  # Выбрать Development
./scripts/run.sh
```

### Production развертывание

```bash
./scripts/setup.sh  # Выбрать Production
# Ввести домен при запросе
./scripts/run.sh
```

### Docker развертывание

```bash
docker compose up -d --build
docker compose logs -f
```

### Мониторинг

Проверка здоровья сервиса:

```bash
curl http://localhost:8080/api/health
```

Просмотр логов:

```bash
# Development
tail -f backend.log

# Production
docker compose logs -f backend
docker compose logs -f frontend
```

## Участие в разработке

### Процесс Pull Request

Форкните репозиторий.

Создайте feature ветку.

Внесите изменения.

Запустите тесты.

Обновите документацию.

Отправьте PR.

### Чеклист code review

Код следует гайдлайнам стиля.

Тесты проходят.

Документация обновлена.

Нет уязвимостей безопасности.

Производительность учтена.

Обработка ошибок реализована.

## Решение проблем

### Частые проблемы

**yt-dlp не найден:**

```bash
pip install yt-dlp
# или
sudo apt install yt-dlp
```

**FFmpeg не найден:**

```bash
sudo apt install ffmpeg
```

**Порт уже используется:**

```bash
lsof -i :8080
kill -9 <PID>
```

**Ошибки компиляции Rust:**

```bash
cargo clean
cargo build
```

## Ресурсы

[Rust Book](https://doc.rust-lang.org/book/)

[Axum Documentation](https://docs.rs/axum/)

[React Documentation](https://react.dev/)

[Material-UI](https://mui.com/)

[yt-dlp](https://github.com/yt-dlp/yt-dlp)
