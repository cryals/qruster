---
sidebar_position: 3
---

# Установка

## Требования

Перед установкой Media Downloader убедитесь, что у вас установлено:

- **Docker** 20.10+ и **Docker Compose** 2.0+
- **Git** для клонирования репозитория
- **Доменное имя** (опционально, для SSL в production)

### Системные требования

- **ОС**: Linux, macOS или Windows с WSL2
- **RAM**: Минимум 2GB, рекомендуется 4GB+
- **Диск**: Минимум 10GB свободного места
- **CPU**: Рекомендуется 2+ ядра

## Быстрый старт (Docker)

Самый простой способ запустить Media Downloader - использовать Docker Compose.

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
```

### 2. Запустите скрипт установки

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

Скрипт установки:
- Проверит наличие Docker и Docker Compose
- Создаст необходимые директории
- Настроит переменные окружения
- Соберет Docker образы

### 3. Запустите сервисы

**Режим разработки:**
```bash
./run.sh dev
```

**Production режим:**
```bash
./run.sh prod
```

### 4. Откройте приложение

- **Разработка**: http://localhost:3000
- **Production**: https://yourdomain.com (после настройки SSL)

## Ручная установка

Если вы предпочитаете запускать сервисы вручную без Docker:

### Backend (Rust)

**1. Установите Rust:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**2. Установите зависимости:**
```bash
# Ubuntu/Debian
sudo apt install -y build-essential pkg-config libssl-dev ffmpeg yt-dlp

# macOS
brew install ffmpeg yt-dlp
```

**3. Соберите и запустите:**
```bash
cd backend
cargo build --release
cargo run --release
```

Backend запустится на `http://localhost:8080`

### Frontend (React)

**1. Установите Node.js:**
```bash
# Используя nvm (рекомендуется)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

**2. Установите зависимости:**
```bash
cd frontend
npm install
```

**3. Запустите dev сервер:**
```bash
npm run dev
```

Frontend запустится на `http://localhost:3000`

**4. Сборка для production:**
```bash
npm run build
npm run preview
```

## Конфигурация Docker Compose

### Режим разработки

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    volumes:
      - ./backend:/app
      - downloads:/tmp/downloads
    environment:
      - RUST_LOG=debug

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
```

### Production режим

```yaml
services:
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - RUST_LOG=info

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
```

## Настройка SSL (Production)

### Используя Caddy (Автоматически)

Отредактируйте `Caddyfile`:

```
yourdomain.com {
    reverse_proxy /api/* backend:8080
    reverse_proxy /* frontend:80
    
    tls your-email@example.com
}
```

Caddy автоматически получит SSL сертификаты от Let's Encrypt.

### Используя Let's Encrypt (Вручную)

```bash
# Установите certbot
sudo apt install certbot

# Получите сертификат
sudo certbot certonly --standalone -d yourdomain.com

# Сертификаты будут в:
# /etc/letsencrypt/live/yourdomain.com/
```

## Переменные окружения

Создайте файл `.env` в корневой директории:

```bash
# Backend
RUST_LOG=info
MAX_FILE_SIZE=2147483648  # 2GB в байтах
DOWNLOAD_TIMEOUT=300      # 5 минут
TEMP_DIR=/tmp/downloads

# Frontend
VITE_API_URL=http://localhost:8080

# Caddy
DOMAIN=yourdomain.com
EMAIL=your-email@example.com
```

## Конфигурация портов

Порты по умолчанию:

- **Frontend**: 3000 (dev), 80 (prod)
- **Backend**: 8080
- **Caddy**: 80 (HTTP), 443 (HTTPS)

Чтобы изменить порты, отредактируйте `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8081:8080"  # Измените 8081 на нужный порт
```

## Решение проблем

### Проблемы с Docker

**Проблема**: "Cannot connect to Docker daemon"
```bash
# Запустите Docker сервис
sudo systemctl start docker

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker
```

**Проблема**: "Port already in use"
```bash
# Найдите процесс использующий порт
sudo lsof -i :8080

# Завершите процесс
sudo kill -9 <PID>
```

### Проблемы со сборкой

**Проблема**: "Rust compilation failed"
```bash
# Обновите Rust
rustup update

# Очистите сборку
cd backend
cargo clean
cargo build --release
```

**Проблема**: "npm install failed"
```bash
# Очистите npm кэш
npm cache clean --force

# Удалите node_modules
rm -rf node_modules package-lock.json
npm install
```

### Проблемы во время работы

**Проблема**: "yt-dlp not found"
```bash
# Установите yt-dlp
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

**Проблема**: "FFmpeg not found"
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg
```

## Обновление

### Docker установка

```bash
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Ручная установка

```bash
git pull origin main

# Обновите backend
cd backend
cargo build --release

# Обновите frontend
cd ../frontend
npm install
npm run build
```

## Удаление

### Docker

```bash
# Остановите и удалите контейнеры
docker-compose down

# Удалите volumes
docker-compose down -v

# Удалите образы
docker rmi qruster-backend qruster-frontend
```

### Ручная установка

```bash
# Остановите сервисы
pkill -f "cargo run"
pkill -f "npm run"

# Удалите файлы
cd ..
rm -rf qruster
```

## Следующие шаги

- [Настройте платформы](./platforms.md)
- [Прочитайте API документацию](./api.md)
- [Руководство по разработке](./development.md)
