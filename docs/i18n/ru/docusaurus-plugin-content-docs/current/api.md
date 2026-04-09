---
sidebar_position: 5
---

# API справочник

Полная документация REST API для Media Downloader.

## Базовый URL

```
http://localhost:8080/api
```

## Endpoints

### Извлечение информации о медиа

Извлечь метаданные и доступные форматы из URL.

**Endpoint:** `POST /api/extract`

**Тело запроса:**
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```

**Ответ:**
```json
{
  "platform": "youtube",
  "title": "Название видео",
  "duration": 180,
  "thumbnail": "https://...",
  "formats": [
    {
      "format_id": "22",
      "quality": "720p",
      "ext": "mp4",
      "filesize": 52428800
    }
  ]
}
```

### Скачивание медиа

Инициировать скачивание и получить URL файла.

**Endpoint:** `POST /api/download`

**Тело запроса:**
```json
{
  "url": "https://youtube.com/watch?v=...",
  "format": "mp4",
  "quality": "720p",
  "audio_only": false
}
```

**Ответ:**
```json
{
  "download_url": "/downloads/abc123.mp4",
  "expires_at": "2026-04-09T17:00:00Z"
}
```

### Получение доступных форматов

Получить все доступные форматы для URL.

**Endpoint:** `GET /api/formats?url=https://...`

**Ответ:**
```json
{
  "video": ["144p", "360p", "720p", "1080p", "4K"],
  "audio": ["mp3", "ogg", "wav"],
  "video_formats": ["mp4", "mkv", "webm"]
}
```

### Проверка здоровья

Проверить здоровье сервиса и версию.

**Endpoint:** `GET /api/health`

**Ответ:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600
}
```

## Ответы с ошибками

Все endpoints возвращают ошибки в этом формате:

```json
{
  "error": "Описание сообщения об ошибке"
}
```

**HTTP коды статуса:**
- `200` - Успех
- `400` - Неверный запрос (невалидный URL, отсутствующие параметры)
- `404` - Не найдено (неподдерживаемая платформа)
- `429` - Слишком много запросов (превышен лимит)
- `500` - Внутренняя ошибка сервера

## Лимиты запросов

- Extract: 10 запросов в минуту на IP
- Download: 5 запросов в минуту на IP
- Всего: 100 запросов в час на IP

## Примеры

### cURL

```bash
# Извлечь информацию
curl -X POST http://localhost:8080/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ"}'

# Скачать
curl -X POST http://localhost:8080/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ","format":"mp4","audio_only":false}'
```

### JavaScript

```javascript
// Извлечь информацию
const response = await fetch('http://localhost:8080/api/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' })
});
const data = await response.json();

// Скачать
const downloadResponse = await fetch('http://localhost:8080/api/download', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    format: 'mp4',
    audio_only: false
  })
});
const downloadData = await downloadResponse.json();
```

### Python

```python
import requests

# Извлечь информацию
response = requests.post('http://localhost:8080/api/extract', 
    json={'url': 'https://youtube.com/watch?v=dQw4w9WgXcQ'})
data = response.json()

# Скачать
download_response = requests.post('http://localhost:8080/api/download',
    json={
        'url': 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'format': 'mp4',
        'audio_only': False
    })
download_data = download_response.json()
```
