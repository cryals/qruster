---
sidebar_position: 5
---

# Архитектура

Эта страница объясняет, как проект устроен в текущем коде, а не в абстрактной идеальной версии.

## Общая Картина

У репозитория три главных части:

1. `frontend/` для браузерного UI
2. `backend/` для API и пайплайна скачивания
3. `docs/` для сайта документации на Docusaurus

## Frontend

Frontend построен на Vite + React.

### Точка входа

- `frontend/src/main.tsx` монтирует приложение и применяет MUI theme
- `frontend/src/App.tsx` владеет основным экраном и верхнеуровневым state

### Текущее поведение UI

Текущий интерфейс представляет собой одну landing-page страницу:

- sticky header
- hero с полем для URL
- встроенные карточки результата
- footer

После отправки URL:

1. `App.tsx` вызывает `api.extract`
2. рендерится карточка медиа
3. пользователь выбирает режим и формат
4. пользователь нажимает `Подготовить файл`
5. backend возвращает временный `download_url`
6. frontend показывает явную ссылку `Скачать файл`

### Структура frontend

```text
frontend/src/
├── App.tsx
├── main.tsx
├── components/
│   ├── DownloadButton.tsx
│   ├── FormatSelector.tsx
│   ├── MediaPreview.tsx
│   ├── PlatformBadges.tsx
│   └── URLInput.tsx
├── services/
│   └── api.ts
└── theme/
    └── theme.ts
```

### Важные frontend-модули

#### `App.tsx`

Хранит:

- состояние темы
- состояние popover со списком сервисов
- текущий URL
- loading/error state
- извлечённые данные медиа
- выбранный формат
- режим аудио/видео

Также внутри него лежит основная CSS-верстка текущего лендинга.

#### `services/api.ts`

Оборачивает backend API:

- `extract(url)`
- `download(request)`
- `getFormats(url)`
- `health()`

#### `FormatSelector.tsx`

Реализует логику выбора формата:

- видео-режим использует реальные `format_id`
- аудио-режим использует заранее заданные выходные форматы вроде `mp3` и `wav`

Это важно, потому что backend интерпретирует поле `format` по-разному в зависимости от `audio_only`.

## Backend

Backend представляет собой Axum-приложение на порту `8080`.

### Router

Определён в `backend/src/main.rs`:

- `GET /`
- `GET /api/health`
- `POST /api/extract`
- `POST /api/download`
- `GET /api/formats`
- `/downloads/*` для отдачи временных файлов

### Структура backend

```text
backend/src/
├── main.rs
├── handlers/
│   ├── download.rs
│   ├── extract.rs
│   ├── formats.rs
│   └── mod.rs
├── extractors/
│   ├── bilibili.rs
│   ├── bluesky.rs
│   ├── dailymotion.rs
│   ├── facebook.rs
│   ├── generic.rs
│   ├── instagram.rs
│   ├── loom.rs
│   ├── newgrounds.rs
│   ├── odnoklassniki.rs
│   ├── pinterest.rs
│   ├── reddit.rs
│   ├── rutube.rs
│   ├── snapchat.rs
│   ├── soundcloud.rs
│   ├── streamable.rs
│   ├── tiktok.rs
│   ├── tumblr.rs
│   ├── twitch.rs
│   ├── twitter.rs
│   ├── vimeo.rs
│   ├── vk.rs
│   ├── youtube.rs
│   └── mod.rs
└── services/
    ├── downloader.rs
    ├── mod.rs
    └── ytdlp.rs
```

### Роли handler-ов

#### `extract.rs`

- валидирует URL
- выбирает extractor через `detect_platform`
- возвращает нормализованный ответ с метаданными и форматами

#### `download.rs`

- валидирует входной payload
- определяет, это видео-режим или аудио-режим
- передаёт либо видео `format_id`, либо аудиоформат в downloader
- возвращает временный `/downloads/...` URL

#### `formats.rs`

Сейчас возвращает статический placeholder и не связан с реальным списком форматов от extractor-ов.

## Слой Extractor-ов

Все extractor-ы реализуют `MediaExtractor` из `backend/src/extractors/mod.rs`.

Текущий trait:

```rust
pub trait MediaExtractor: Send + Sync {
    fn detect(&self, url: &str) -> bool;
    async fn extract_info(&self, url: &str) -> Result<MediaInfo>;
    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String>;
}
```

### Как выбирается extractor

`detect_platform(url)` проходит по зарегистрированным extractor-ам по порядку и возвращает первый, у которого `detect()` вернул `true`.

Важное следствие:

- `generic::GenericExtractor` является fallback
- он подходит для любого `http://` или `https://` URL
- значит, он должен оставаться в конце списка

## Пайплайн Скачивания

Основная логика распределена между двумя сервисами.

### `services/downloader.rs`

Отвечает за:

- создание временной директории
- генерацию UUID-имён файлов
- выбор расширения выходного файла
- вызов `YtDlpService`
- проверку, что файл реально создан

### `services/ytdlp.rs`

Отвечает за:

- запуск `yt-dlp --dump-json` для извлечения информации
- разбор `formats` из JSON
- скачивание конкретного видеоформата
- извлечение аудио через `-x --audio-format`

### Селектор видеоформатов

Сейчас backend использует такую идею:

- если выбран формат, используется селектор вида `fmt+bestaudio/fmt/best`
- если формат не задан, используется fallback `bv*+ba/b`

Это важно для платформ вроде Bilibili, где простой `best` может ломаться или выбирать не тот поток.

## Жизненный Цикл Файла

Подготовленные файлы записываются в:

```text
<system-temp>/media-downloader
```

В Docker-режиме compose монтирует:

```text
./downloads -> /tmp/media-downloader
```

Код очистки есть в `Downloader::cleanup_old_files()`, но автоматически из `main.rs` он сейчас не запускается.

## Текущие Ограничения

Это важные реальные ограничения:

- нет аутентификации
- нет настоящего rate limiting в текущем коде
- `GET /api/formats` пока заглушка
- `health.uptime` всегда `0`
- включён широкий `CORS` для всех origins
- очистка файлов написана, но не запланирована как фоновая задача

## Слои Развёртывания

### Development

- frontend на `localhost:3000`
- backend на `localhost:8080`

### Production

В репозитории есть:

- `docker-compose.yml`
- `Caddyfile`

Основные Docker-сервисы:

- `backend`
- `frontend`
- `caddy`

Caddy должен проксировать browser-трафик во frontend, а `/api/*` запросы в backend.
