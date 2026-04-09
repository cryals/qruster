# Архитектура

## Обзор системы

Media Downloader построен на микросервисной архитектуре с четким разделением ответственности между компонентами.

## Компоненты системы

### 1. Frontend (React + MUI)

**Технологии:**
- React 18 с TypeScript
- Material-UI v6 (Material Design 3)
- Vite для сборки
- Axios для HTTP запросов

**Структура:**
```
frontend/src/
├── components/       # React компоненты
│   ├── URLInput.tsx
│   ├── MediaPreview.tsx
│   ├── FormatSelector.tsx
│   └── DownloadButton.tsx
├── services/         # API клиенты
│   └── api.ts
├── theme/            # Material Design 3 тема
│   └── theme.ts
└── App.tsx           # Главный компонент
```

**Ответственность:**
- Пользовательский интерфейс
- Валидация URL на клиенте
- Отображение информации о медиа
- Управление состоянием приложения

### 2. Backend (Rust + Axum)

**Технологии:**
- Rust 1.77+
- Axum (веб-фреймворк)
- Tokio (асинхронный runtime)
- Serde (сериализация)
- Reqwest (HTTP клиент)

**Структура:**
```
backend/src/
├── handlers/         # HTTP обработчики
│   ├── extract.rs
│   ├── download.rs
│   ├── formats.rs
│   └── mod.rs
├── extractors/       # Экстракторы платформ
│   ├── youtube.rs
│   ├── tiktok.rs
│   ├── generic.rs
│   └── mod.rs
├── services/         # Бизнес-логика
│   ├── downloader.rs
│   └── mod.rs
└── main.rs           # Entry point
```

**Ответственность:**
- REST API endpoints
- Извлечение метаданных
- Скачивание медиа
- Конвертация форматов
- Rate limiting

### 3. Reverse Proxy (Caddy)

**Функции:**
- Автоматический SSL через Let's Encrypt
- Проксирование запросов к backend/frontend
- HTTP/2 и HTTP/3 поддержка
- Статическая конфигурация через Caddyfile

### 4. Экстракторы платформ

Каждая платформа имеет свой экстрактор, реализующий общий интерфейс:

```rust
pub trait MediaExtractor {
    fn detect(&self, url: &str) -> bool;
    async fn extract_info(&self, url: &str) -> Result<MediaInfo>;
    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String>;
}
```

**Список экстракторов:**
- YouTubeExtractor
- TikTokExtractor
- InstagramExtractor
- VKExtractor
- BilibiliExtractor
- GenericExtractor (fallback на yt-dlp)

## Поток данных

### Извлечение информации

```
1. Пользователь вводит URL
   ↓
2. Frontend валидирует URL
   ↓
3. POST /api/extract → Backend
   ↓
4. Backend определяет платформу (detect_platform)
   ↓
5. Вызов соответствующего экстрактора
   ↓
6. Экстрактор получает метаданные
   ↓
7. Возврат MediaInfo → Frontend
   ↓
8. Отображение превью и форматов
```

### Скачивание файла

```
1. Пользователь выбирает формат и качество
   ↓
2. POST /api/download → Backend
   ↓
3. Backend скачивает медиа во временную директорию
   ↓
4. FFmpeg конвертирует (если нужно)
   ↓
5. Генерация временной ссылки для скачивания
   ↓
6. Возврат download_url → Frontend
   ↓
7. Браузер скачивает файл
   ↓
8. Очистка временных файлов (через 1 час)
```

## Модель данных

### MediaInfo

```rust
pub struct MediaInfo {
    pub platform: String,      // "youtube", "tiktok", etc.
    pub title: String,         // Название медиа
    pub duration: Option<u64>, // Длительность в секундах
    pub thumbnail: Option<String>, // URL превью
    pub formats: Vec<Format>,  // Доступные форматы
}
```

### Format

```rust
pub struct Format {
    pub format_id: String,     // Уникальный ID формата
    pub quality: String,       // "720p", "1080p", "best"
    pub ext: String,           // "mp4", "webm", "mp3"
    pub filesize: Option<u64>, // Размер в байтах
    pub url: Option<String>,   // Прямая ссылка (если доступна)
}
```

## Безопасность

### Rate Limiting

Реализовано на уровне backend с использованием tower-governor:

```rust
// Ограничения по IP
- 10 запросов /api/extract в минуту
- 5 запросов /api/download в минуту
- 100 запросов в час (общий лимит)
```

### Валидация

1. **URL валидация**: Проверка на валидность и безопасность URL
2. **Path sanitization**: Предотвращение path traversal атак
3. **Size limits**: Максимальный размер файла 2GB
4. **Duration limits**: Максимальная длительность видео 3 часа

### CORS

Настроен для разрешения запросов только с фронтенда:

```rust
let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);
```

## Масштабирование

### Горизонтальное масштабирование

```
                    ┌─────────────┐
                    │Load Balancer│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │Backend 1│       │Backend 2│       │Backend 3│
   └─────────┘       └─────────┘       └─────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │Shared Storage│
                    └─────────────┘
```

### Кэширование

Для высоких нагрузок можно добавить Redis:

```
Frontend → Backend → Redis Cache → Extractors
                         ↓
                    (cache miss)
                         ↓
                   External APIs
```

### Очередь задач

Для асинхронной обработки можно использовать RabbitMQ:

```
Backend → RabbitMQ → Workers → FFmpeg
```

## Мониторинг

### Метрики

Рекомендуется использовать Prometheus + Grafana:

- Количество запросов по endpoints
- Время ответа API
- Количество успешных/неудачных скачиваний
- Использование диска (временные файлы)
- Использование CPU/RAM

### Логирование

Структурированное логирование через tracing:

```rust
tracing::info!("Extracting info from URL: {}", url);
tracing::error!("Failed to download: {}", error);
```

## Развертывание

### Development

```
┌──────────┐     ┌──────────┐
│ Frontend │     │ Backend  │
│  :3000   │────▶│  :8080   │
└──────────┘     └──────────┘
```

### Production

```
        ┌──────────┐
        │  Caddy   │
        │ :80/:443 │
        └────┬─────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼────┐
│Frontend│      │ Backend │
│  :80   │      │  :8080  │
└────────┘      └─────────┘
```

## Обработка ошибок

### Типы ошибок

```rust
pub enum AppError {
    InvalidUrl,
    UnsupportedPlatform,
    ExtractionFailed,
    DownloadFailed,
    ConversionFailed,
    RateLimitExceeded,
}
```

### Стратегия обработки

1. **Graceful degradation**: Fallback на yt-dlp при ошибке экстрактора
2. **Retry logic**: Повторные попытки для сетевых ошибок
3. **User feedback**: Понятные сообщения об ошибках
4. **Logging**: Детальное логирование для отладки

## Производительность

### Оптимизации

1. **Async/await**: Неблокирующие операции ввода-вывода
2. **Connection pooling**: Переиспользование HTTP соединений
3. **Streaming**: Потоковая передача больших файлов
4. **Compression**: Gzip для API ответов
5. **CDN**: Статические файлы frontend через CDN

### Benchmarks

Целевые показатели:

- Время извлечения метаданных: < 2 секунды
- Время начала скачивания: < 5 секунд
- Пропускная способность: 100+ одновременных пользователей
- Использование памяти: < 512MB на инстанс

## Будущие улучшения

1. **WebSocket**: Real-time прогресс скачивания
2. **Database**: PostgreSQL для истории и пользователей
3. **Queue**: RabbitMQ для фоновых задач
4. **Cache**: Redis для метаданных
5. **CDN**: CloudFlare для статики
6. **Monitoring**: Prometheus + Grafana
7. **Tracing**: Jaeger для distributed tracing
