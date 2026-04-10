---
sidebar_position: 3
---

# Установка

## Требования

### Для разработки

- Rust stable
- Node.js 20+
- `ffmpeg`
- `yt-dlp`

### Для production

- Docker 24+
- Docker Compose v2

## Клонирование Репозитория

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
```

## Интерактивная Настройка

Из корня проекта:

```bash
./scripts/setup.sh
```

Доступные варианты:

- `1` Development: проверка Rust и Node.js, сборка backend и установка frontend-зависимостей
- `2` Production: запрос домена и подготовка `Caddyfile` плюс `.env`

## Запуск

После настройки:

```bash
./scripts/run.sh
```

Варианты запуска:

- `1` Development mode
- `2` Production mode через Docker Compose
- `3` Остановить сервисы

## Development Mode

В development:

- backend доступен на `http://localhost:8080`
- frontend доступен на `http://localhost:3000`

Ручной запуск тоже возможен.

### Backend

```bash
cd backend
cargo run
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

## Production Mode

Docker-стек описан в [`docker-compose.yml`](../../../../../docker-compose.yml).

Сервисы по умолчанию:

- `backend` на порту `8080`
- `frontend` на порту `3000`
- `caddy` на портах `80` и `443`

Ручной запуск:

```bash
docker compose up -d --build
```

Остановка:

```bash
docker compose down
```

## Примечания

- В Docker-режиме загруженные файлы попадают в `./downloads`
- Backend временно хранит подготовленные файлы и выдаёт ограниченную по времени ссылку
- Для HTTPS через Caddy нужен рабочий домен
