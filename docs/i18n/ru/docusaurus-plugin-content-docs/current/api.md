---
sidebar_position: 4
---

# API Справочник

Media Downloader предоставляет RESTful API для извлечения информации о медиа и скачивания файлов с поддерживаемых платформ.

## Базовый URL

- **Разработка**: `http://localhost:8080`
- **Production**: `https://yourdomain.com`

## Аутентификация

В настоящее время API не требует аутентификации. Применяется ограничение скорости запросов по IP адресу.

## Endpoints

### Проверка здоровья

Проверить, работает ли API и получить информацию о сервисе.

**Endpoint**: `GET /api/health`

**Ответ**:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptime": 3600
}
```

**Коды состояния**:
- `200 OK` - Сервис работает нормально

---

### Извлечение информации о медиа

Извлечь метаданные и доступные форматы из URL медиа.

**Endpoint**: `POST /api/extract`

**Тело запроса**:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Ответ**:
```json
{
  "platform": "youtube",
  "title": "Rick Astley - Never Gonna Give You Up",
  "duration": 212,
  "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "formats": [
    {
      "format_id": "18",
      "quality": "360p",
      "ext": "mp4",
      "filesize": 8234567,
      "url": null
    },
    {
      "format_id": "22",
      "quality": "720p",
      "ext": "mp4",
      "filesize": 24567890,
      "url": null
    },
    {
      "format_id": "140",
      "quality": "audio",
      "ext": "m4a",
      "filesize": 3456789,
      "url": null
    }
  ]
}
```

**Параметры**:
- `url` (string, обязательный) - URL медиа для извлечения информации

**Коды состояния**:
- `200 OK` - Информация успешно извлечена
- `400 Bad Request` - Неверный URL или неподдерживаемая платформа
- `429 Too Many Requests` - Превышен лимит запросов
- `500 Internal Server Error` - Ошибка извлечения

**Лимит запросов**: 10 запросов в минуту на IP

---

### Скачивание медиа

Скачать медиа в указанном формате.

**Endpoint**: `POST /api/download`

**Тело запроса**:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format_id": "22",
  "audio_only": false
}
```

**Ответ**:
```json
{
  "download_url": "/downloads/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp4",
  "filename": "Rick Astley - Never Gonna Give You Up.mp4",
  "filesize": 24567890
}
```

**Параметры**:
- `url` (string, обязательный) - URL медиа для скачивания
- `format_id` (string, обязательный) - ID формата из ответа `/api/extract`
- `audio_only` (boolean, опциональный) - Извлечь только аудио (по умолчанию: false)

**Коды состояния**:
- `200 OK` - Скачивание успешно подготовлено
- `400 Bad Request` - Неверные параметры
- `429 Too Many Requests` - Превышен лимит запросов
- `500 Internal Server Error` - Ошибка скачивания

**Лимит запросов**: 5 запросов в минуту на IP

**Примечания**:
- `download_url` временный и истекает через 1 час
- Файлы автоматически удаляются после скачивания или истечения срока

---

### Получить доступные форматы

Получить список всех поддерживаемых аудио и видео форматов.

**Endpoint**: `GET /api/formats`

**Ответ**:
```json
{
  "audio": [
    {
      "ext": "mp3",
      "description": "MP3 аудио формат (lossy)",
      "mime_type": "audio/mpeg"
    },
    {
      "ext": "ogg",
      "description": "OGG Vorbis аудио формат (lossy)",
      "mime_type": "audio/ogg"
    },
    {
      "ext": "wav",
      "description": "WAV аудио формат (lossless)",
      "mime_type": "audio/wav"
    }
  ],
  "video": [
    {
      "ext": "mp4",
      "description": "MP4 видео формат (H.264)",
      "mime_type": "video/mp4"
    },
    {
      "ext": "mkv",
      "description": "Matroska видео формат",
      "mime_type": "video/x-matroska"
    },
    {
      "ext": "webm",
      "description": "WebM видео формат (VP9)",
      "mime_type": "video/webm"
    }
  ]
}
```

**Коды состояния**:
- `200 OK` - Форматы успешно получены

---

## Ответы с ошибками

Все ответы с ошибками следуют этому формату:

```json
{
  "error": "Сообщение об ошибке, описывающее что пошло не так"
}
```

### Распространенные ошибки

**Неверный URL**:
```json
{
  "error": "Invalid URL format"
}
```

**Неподдерживаемая платформа**:
```json
{
  "error": "Platform not supported"
}
```

**Превышен лимит запросов**:
```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

**Ошибка извлечения**:
```json
{
  "error": "Failed to extract media information"
}
```

**Ошибка скачивания**:
```json
{
  "error": "Failed to download media"
}
```

---

## Ограничение скорости запросов

Лимиты применяются по IP адресу:

| Endpoint | Лимит |
|----------|-------|
| `/api/extract` | 10 запросов/минуту |
| `/api/download` | 5 запросов/минуту |
| Все endpoints | 100 запросов/час |

При превышении лимита API возвращает:
- **Код состояния**: `429 Too Many Requests`
- **Заголовки**: `Retry-After: <секунды>`

---

## CORS

API поддерживает Cross-Origin Resource Sharing (CORS) со следующей конфигурацией:

- **Разрешенные Origins**: Все origins (`*`)
- **Разрешенные методы**: `GET`, `POST`
- **Разрешенные заголовки**: Все заголовки

Для production развертываний рекомендуется ограничить разрешенные origins вашим frontend доменом.

---

## Примеры

### JavaScript (Fetch API)

```javascript
// Извлечь информацию о медиа
async function extractMedia(url) {
  const response = await fetch('http://localhost:8080/api/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Extraction failed');
  }
  
  return await response.json();
}

// Скачать медиа
async function downloadMedia(url, formatId, audioOnly = false) {
  const response = await fetch('http://localhost:8080/api/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      format_id: formatId,
      audio_only: audioOnly,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Download failed');
  }
  
  const data = await response.json();
  window.location.href = `http://localhost:8080${data.download_url}`;
}
```

### Python (requests)

```python
import requests

# Извлечь информацию о медиа
def extract_media(url):
    response = requests.post(
        'http://localhost:8080/api/extract',
        json={'url': url}
    )
    response.raise_for_status()
    return response.json()

# Скачать медиа
def download_media(url, format_id, audio_only=False):
    response = requests.post(
        'http://localhost:8080/api/download',
        json={
            'url': url,
            'format_id': format_id,
            'audio_only': audio_only
        }
    )
    response.raise_for_status()
    data = response.json()
    
    # Скачать файл
    file_response = requests.get(
        f"http://localhost:8080{data['download_url']}"
    )
    with open(data['filename'], 'wb') as f:
        f.write(file_response.content)
```

### cURL

```bash
# Извлечь информацию о медиа
curl -X POST http://localhost:8080/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Скачать медиа
curl -X POST http://localhost:8080/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "format_id": "22",
    "audio_only": false
  }'
```

---

## Поддерживаемые платформы

См. [Платформы](./platforms.md) для полного списка поддерживаемых платформ и их возможностей.

---

## Ограничения

- **Максимальный размер файла**: 2GB
- **Максимальная длительность видео**: 3 часа
- **Одновременные скачивания**: 10 на инстанс
- **Хранение временных файлов**: 1 час

---

## История изменений

### v0.1.0 (Текущая)

- Первый релиз API
- Поддержка 20+ платформ
- Скачивание аудио и видео
- Конвертация форматов
- Ограничение скорости запросов
