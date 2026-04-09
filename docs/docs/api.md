---
sidebar_position: 5
---

# API Reference

Complete REST API documentation for Media Downloader.

## Base URL

```
http://localhost:8080/api
```

## Endpoints

### Extract Media Information

Extract metadata and available formats from a URL.

**Endpoint:** `POST /api/extract`

**Request Body:**
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "platform": "youtube",
  "title": "Video Title",
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

### Download Media

Initiate a download and get the file URL.

**Endpoint:** `POST /api/download`

**Request Body:**
```json
{
  "url": "https://youtube.com/watch?v=...",
  "format": "mp4",
  "quality": "720p",
  "audio_only": false
}
```

**Response:**
```json
{
  "download_url": "/downloads/abc123.mp4",
  "expires_at": "2026-04-09T17:00:00Z"
}
```

### Get Available Formats

Get all available formats for a URL.

**Endpoint:** `GET /api/formats?url=https://...`

**Response:**
```json
{
  "video": ["144p", "360p", "720p", "1080p", "4K"],
  "audio": ["mp3", "ogg", "wav"],
  "video_formats": ["mp4", "mkv", "webm"]
}
```

### Health Check

Check service health and version.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid URL, missing parameters)
- `404` - Not Found (unsupported platform)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limits

- Extract: 10 requests per minute per IP
- Download: 5 requests per minute per IP
- Total: 100 requests per hour per IP

## Examples

### cURL

```bash
# Extract info
curl -X POST http://localhost:8080/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ"}'

# Download
curl -X POST http://localhost:8080/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ","format":"mp4","audio_only":false}'
```

### JavaScript

```javascript
// Extract info
const response = await fetch('http://localhost:8080/api/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' })
});
const data = await response.json();

// Download
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

# Extract info
response = requests.post('http://localhost:8080/api/extract', 
    json={'url': 'https://youtube.com/watch?v=dQw4w9WgXcQ'})
data = response.json()

# Download
download_response = requests.post('http://localhost:8080/api/download',
    json={
        'url': 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'format': 'mp4',
        'audio_only': False
    })
download_data = download_response.json()
```
