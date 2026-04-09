---
sidebar_position: 4
---

# API Reference

Media Downloader provides a RESTful API for extracting media information and downloading files from supported platforms.

## Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://yourdomain.com`

## Authentication

Currently, the API does not require authentication. Rate limiting is applied per IP address.

## Endpoints

### Health Check

Check if the API is running and get service information.

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptime": 3600
}
```

**Status Codes**:
- `200 OK` - Service is healthy

---

### Extract Media Info

Extract metadata and available formats from a media URL.

**Endpoint**: `POST /api/extract`

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response**:
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

**Parameters**:
- `url` (string, required) - The media URL to extract information from

**Status Codes**:
- `200 OK` - Successfully extracted information
- `400 Bad Request` - Invalid URL or unsupported platform
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Extraction failed

**Rate Limit**: 10 requests per minute per IP

---

### Download Media

Download media in the specified format.

**Endpoint**: `POST /api/download`

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format_id": "22",
  "audio_only": false
}
```

**Response**:
```json
{
  "download_url": "/downloads/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp4",
  "filename": "Rick Astley - Never Gonna Give You Up.mp4",
  "filesize": 24567890
}
```

**Parameters**:
- `url` (string, required) - The media URL to download
- `format_id` (string, required) - Format ID from `/api/extract` response
- `audio_only` (boolean, optional) - Extract audio only (default: false)

**Status Codes**:
- `200 OK` - Download prepared successfully
- `400 Bad Request` - Invalid parameters
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Download failed

**Rate Limit**: 5 requests per minute per IP

**Notes**:
- The `download_url` is temporary and expires after 1 hour
- Files are automatically cleaned up after download or expiration

---

### Get Available Formats

Get a list of all supported audio and video formats.

**Endpoint**: `GET /api/formats`

**Response**:
```json
{
  "audio": [
    {
      "ext": "mp3",
      "description": "MP3 audio format (lossy)",
      "mime_type": "audio/mpeg"
    },
    {
      "ext": "ogg",
      "description": "OGG Vorbis audio format (lossy)",
      "mime_type": "audio/ogg"
    },
    {
      "ext": "wav",
      "description": "WAV audio format (lossless)",
      "mime_type": "audio/wav"
    }
  ],
  "video": [
    {
      "ext": "mp4",
      "description": "MP4 video format (H.264)",
      "mime_type": "video/mp4"
    },
    {
      "ext": "mkv",
      "description": "Matroska video format",
      "mime_type": "video/x-matroska"
    },
    {
      "ext": "webm",
      "description": "WebM video format (VP9)",
      "mime_type": "video/webm"
    }
  ]
}
```

**Status Codes**:
- `200 OK` - Successfully retrieved formats

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Errors

**Invalid URL**:
```json
{
  "error": "Invalid URL format"
}
```

**Unsupported Platform**:
```json
{
  "error": "Platform not supported"
}
```

**Rate Limit Exceeded**:
```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

**Extraction Failed**:
```json
{
  "error": "Failed to extract media information"
}
```

**Download Failed**:
```json
{
  "error": "Failed to download media"
}
```

---

## Rate Limiting

Rate limits are applied per IP address:

| Endpoint | Limit |
|----------|-------|
| `/api/extract` | 10 requests/minute |
| `/api/download` | 5 requests/minute |
| All endpoints | 100 requests/hour |

When rate limit is exceeded, the API returns:
- **Status Code**: `429 Too Many Requests`
- **Headers**: `Retry-After: <seconds>`

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

- **Allowed Origins**: All origins (`*`)
- **Allowed Methods**: `GET`, `POST`
- **Allowed Headers**: All headers

For production deployments, it's recommended to restrict allowed origins to your frontend domain.

---

## Examples

### JavaScript (Fetch API)

```javascript
// Extract media info
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

// Download media
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

# Extract media info
def extract_media(url):
    response = requests.post(
        'http://localhost:8080/api/extract',
        json={'url': url}
    )
    response.raise_for_status()
    return response.json()

# Download media
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
    
    # Download the file
    file_response = requests.get(
        f"http://localhost:8080{data['download_url']}"
    )
    with open(data['filename'], 'wb') as f:
        f.write(file_response.content)
```

### cURL

```bash
# Extract media info
curl -X POST http://localhost:8080/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Download media
curl -X POST http://localhost:8080/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "format_id": "22",
    "audio_only": false
  }'
```

---

## Supported Platforms

See [Platforms](./platforms.md) for a complete list of supported platforms and their capabilities.

---

## Limitations

- **Maximum file size**: 2GB
- **Maximum video duration**: 3 hours
- **Concurrent downloads**: 10 per instance
- **Temporary file retention**: 1 hour

---

## Changelog

### v0.1.0 (Current)

- Initial API release
- Support for 20+ platforms
- Audio and video download
- Format conversion
- Rate limiting
