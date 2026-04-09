# Установка

## Требования

### Для разработки

- **Rust** 1.75 или выше
  - Установка: [rustup.rs](https://rustup.rs/)
  - Проверка: `rustc --version`

- **Node.js** 20 или выше
  - Установка: [nodejs.org](https://nodejs.org/)
  - Проверка: `node --version`

- **FFmpeg**
  - Linux: `sudo apt install ffmpeg` или `sudo yum install ffmpeg`
  - macOS: `brew install ffmpeg`
  - Windows: Скачать с [ffmpeg.org](https://ffmpeg.org/)
  - Проверка: `ffmpeg -version`

- **yt-dlp**
  - Установка: `pip install yt-dlp` или скачать бинарник
  - Проверка: `yt-dlp --version`

### Для продакшена

- **Docker** 24 или выше
  - Установка: [docker.com](https://www.docker.com/)
  - Проверка: `docker --version`

- **Docker Compose** v2
  - Обычно включен в Docker Desktop
  - Проверка: `docker compose version`

## Методы установки

### Метод 1: Автоматическая установка (Рекомендуется)

Самый простой способ начать - использовать автоматический скрипт установки.

#### Linux / macOS

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
chmod +x scripts/setup.sh scripts/run.sh
./scripts/setup.sh
```

Скрипт выполнит:
1. Определение операционной системы
2. Проверку необходимых зависимостей
3. Предложение установить недостающие зависимости
4. Выбор между режимом разработки или продакшена
5. Настройку окружения

#### Windows

```cmd
git clone https://github.com/cryals/qruster.git
cd qruster
scripts\setup.bat
```

### Метод 2: Ручная установка для разработки

Если предпочитаете ручную установку:

```bash
# Клонирование репозитория
git clone https://github.com/cryals/qruster.git
cd qruster

# Установка зависимостей backend
cd backend
cargo build
cd ..

# Установка зависимостей frontend
cd frontend
npm install
cd ..
```

### Метод 3: Docker для продакшена

Для продакшен развертывания с Docker:

```bash
# Клонирование репозитория
git clone https://github.com/cryals/qruster.git
cd qruster

# Настройка домена (редактирование Caddyfile)
nano Caddyfile
# Замените localhost на ваш домен

# Создание .env файла
echo "DOMAIN=ваш-домен.com" > .env
echo "RUST_LOG=info" >> .env

# Запуск сервисов
docker compose up -d
```

## Конфигурация

### Режим разработки

Режим разработки запускает сервисы напрямую на вашей машине:

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- Hot reload включен для обоих сервисов
- Детальное логирование

### Режим продакшена

Режим продакшена использует Docker контейнеры:

- Все сервисы за Caddy reverse proxy
- Автоматический SSL сертификат через Let's Encrypt
- Оптимизированные сборки
- Минимальное логирование

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Домен для продакшена (опционально для dev)
DOMAIN=media.example.com

# Уровень логирования
RUST_LOG=info

# Директория для скачиваний (опционально)
DOWNLOAD_DIR=/tmp/media-downloader

# Максимальный размер файла в байтах (опционально, по умолчанию 2GB)
MAX_FILE_SIZE=2147483648
```

## Проверка

После установки проверьте, что все работает:

### Режим разработки

```bash
./scripts/run.sh
# Выберите опцию 1 (Development)
```

Затем откройте:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/health

### Режим продакшена

```bash
./scripts/run.sh
# Выберите опцию 2 (Production)
```

Затем откройте ваш настроенный домен в браузере.

## Решение проблем

### Порт уже используется

Если порты 3000 или 8080 уже заняты:

```bash
# Найти процесс использующий порт
lsof -i :3000
lsof -i :8080

# Завершить процесс
kill -9 <PID>
```

### FFmpeg не найден

Убедитесь, что FFmpeg в вашем PATH:

```bash
which ffmpeg
# Должно вывести: /usr/bin/ffmpeg или похожее
```

### yt-dlp не найден

Установите yt-dlp:

```bash
# Используя pip
pip install yt-dlp

# Или скачайте бинарник
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### Отказано в доступе к Docker

Добавьте пользователя в группу docker:

```bash
sudo usermod -aG docker $USER
# Выйдите и войдите обратно
```

### Проблемы с SSL сертификатом

Если Caddy не может получить SSL сертификат:

1. Убедитесь, что порты 80 и 443 открыты
2. Проверьте, что DNS указывает на ваш сервер
3. Проверьте логи Caddy: `docker compose logs caddy`

## Обновление

### Разработка

```bash
git pull
cd backend && cargo build
cd ../frontend && npm install
```

### Продакшен

```bash
git pull
docker compose down
docker compose up -d --build
```

## Удаление

### Удаление приложения

```bash
# Остановка сервисов
./scripts/run.sh
# Выберите опцию 3 (Stop services)

# Удаление файлов
cd ..
rm -rf qruster
```

### Удаление Docker volumes

```bash
docker compose down -v
docker volume prune
```

## Следующие шаги

- Прочитайте [Руководство пользователя](usage.md) чтобы узнать как использовать приложение
- Проверьте [API справочник](api.md) для документации API
- Смотрите [Руководство разработчика](development.md) для участия в разработке
