---
sidebar_position: 4
---

# API

Эта страница описывает API таким, каким он реализован в текущем backend-коде.

## Базовые URL

- Development: `http://localhost:8080`
- За reverse proxy: ваш домен, где `/api/*` проксируется в backend

## Обзор endpoints

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/` | Текстовый корневой ответ |
| `GET` | `/api/health` | Базовый health check |
| `POST` | `/api/extract` | Извлекает заголовок, thumbnail, длительность и форматы |
| `POST` | `/api/download` | Подготавливает скачиваемый файл |
| `GET` | `/api/formats` | Возвращает статический placeholder |
| `GET` | `/downloads/:filename` | Отдаёт подготовленные файлы из временной директории |

## `GET /api/health`

Возвращает простой статус.

### Пример ответа

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptime": 0
}
```

Замечания:

- `uptime` сейчас жёстко равен `0`
- глубокой проверки зависимостей пока нет

## `POST /api/extract`

Извлекает метаданные медиа и список форматов по URL.

### Тело запроса

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### Валидация

Backend требует:

- непустой `url`
- `url` должен начинаться с `http://` или `https://`
- URL должен совпасть с поддерживаемым extractor-ом или упасть в generic extractor

### Пример ответа

```json
{
  "platform": "youtube",
  "title": "Example title",
  "duration": 212,
  "thumbnail": "https://example.com/thumb.jpg",
  "formats": [
    {
      "format_id": "18",
      "quality": "360p",
      "ext": "mp4",
      "filesize": 8234567
    },
    {
      "format_id": "140",
      "quality": "audio only",
      "ext": "m4a",
      "filesize": 3456789
    }
  ]
}
```

### Поля ответа

| Поле | Тип | Значение |
| --- | --- | --- |
| `platform` | `string` | Имя extractor-а, например `youtube`, `bilibili`, `generic` |
| `title` | `string` | Заголовок медиа |
| `duration` | `number?` | Длительность в секундах, если доступна |
| `thumbnail` | `string?` | URL превью, если доступен |
| `formats` | `array` | Список форматов из `yt-dlp` |

## `POST /api/download`

Подготавливает файл и возвращает временную ссылку на скачивание через backend.

### Видео-режим

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "137",
  "audio_only": false
}
```

### Аудио-режим

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp3",
  "audio_only": true
}
```

### Текущее поведение

- в видео-режиме `format` трактуется как `format_id`
- в аудио-режиме `format` трактуется как целевой аудиоформат
- backend пишет файл во временную директорию и возвращает UUID-имя файла

### Пример ответа

```json
{
  "download_url": "/downloads/2d4f50a7-93c6-4e31-a0d8-77c4d4a0c5e8.mp4",
  "expires_at": "2026-04-10T10:45:00Z"
}
```

### Важно

- `expires_at` выставляется на 30 минут вперёд
- frontend теперь показывает отдельную кнопку `Скачать файл`, а не открывает медиа автоматически
- код очистки временных файлов есть, но планировщик очистки в `main.rs` пока не подключён

## `GET /api/formats`

Этот endpoint существует, но сейчас ещё является заглушкой.

### Пример ответа

```json
{
  "video": ["144p", "360p", "720p", "1080p"],
  "audio": ["mp3", "ogg", "wav"],
  "video_formats": ["mp4", "mkv", "webm"]
}
```

Важно:

- ответ не связан с реальными extractor-ами
- основной frontend-flow этим endpoint сейчас не пользуется

## Формат ошибок

Ошибки backend возвращает так:

```json
{
  "error": "Понятное человеку сообщение"
}
```

### Поведение по status code

Сейчас большинство ошибок отдаются как HTTP `400 Bad Request` через общий `ErrorResponse`, даже если первопричина операционная. Это текущее ограничение реализации.

## CORS

Сервер сейчас разрешает любые origins, methods и headers:

- `allow_origin(Any)`
- `allow_methods(Any)`
- `allow_headers(Any)`

Для разработки это удобно, но конфигурация намеренно широкая.
