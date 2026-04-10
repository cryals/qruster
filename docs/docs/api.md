---
sidebar_position: 4
---

# API Reference

This page documents the API that is actually implemented in the current backend code.

## Base URLs

- Development: `http://localhost:8080`
- Behind reverse proxy: your public domain, usually with `/api/*` proxied to the backend

## Endpoints Overview

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Plain text root message |
| `GET` | `/api/health` | Basic health response |
| `POST` | `/api/extract` | Extract title, thumbnail, duration, and available formats |
| `POST` | `/api/download` | Prepare a downloadable file |
| `GET` | `/api/formats` | Returns static placeholder format lists |
| `GET` | `/downloads/:filename` | Serves prepared files from the backend temp directory |

## `GET /api/health`

Returns a simple status payload.

### Example response

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptime": 0
}
```

Notes:

- `uptime` is currently hardcoded to `0`
- there is no deep dependency health check yet

## `POST /api/extract`

Extracts media metadata and platform formats from a URL.

### Request body

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### Validation

The backend currently requires:

- non-empty `url`
- `url` must start with `http://` or `https://`
- URL must match a supported extractor or fall back to the generic extractor

### Example response

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

### Response fields

| Field | Type | Meaning |
| --- | --- | --- |
| `platform` | `string` | Extractor name such as `youtube`, `bilibili`, `generic` |
| `title` | `string` | Media title |
| `duration` | `number?` | Duration in seconds if available |
| `thumbnail` | `string?` | Thumbnail URL if available |
| `formats` | `array` | Extracted formats from `yt-dlp` |

### Format object

| Field | Type | Meaning |
| --- | --- | --- |
| `format_id` | `string` | `yt-dlp` format identifier |
| `quality` | `string` | Human-facing label, often based on `format_note` |
| `ext` | `string` | Extension such as `mp4`, `webm`, `m4a` |
| `filesize` | `number?` | File size in bytes if upstream exposes it |

## `POST /api/download`

Prepares a downloadable file and returns a temporary backend-served URL.

### Request body for video mode

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "137",
  "audio_only": false
}
```

### Request body for audio mode

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp3",
  "audio_only": true
}
```

### Current behavior

- In video mode, `format` is treated as a `format_id`
- In audio mode, `format` is treated as the target audio format
- The backend writes the file into the temp directory and returns a UUID-based filename

### Example response

```json
{
  "download_url": "/downloads/2d4f50a7-93c6-4e31-a0d8-77c4d4a0c5e8.mp4",
  "expires_at": "2026-04-10T10:45:00Z"
}
```

### Notes

- `expires_at` is set to 30 minutes in the future
- the frontend currently shows a separate explicit download link instead of auto-opening the file
- backend cleanup code exists, but there is no background scheduler wired up yet

## `GET /api/formats`

This endpoint exists, but the current implementation is still a placeholder.

### Request

```text
GET /api/formats?url=https://example.com/video
```

### Example response

```json
{
  "video": ["144p", "360p", "720p", "1080p"],
  "audio": ["mp3", "ogg", "wav"],
  "video_formats": ["mp4", "mkv", "webm"]
}
```

Important:

- this response is not derived from the real extractor result
- the frontend main flow does not depend on this endpoint

## Error Format

Backend errors are returned as:

```json
{
  "error": "Human-readable error message"
}
```

### Status behavior

At the moment, most handler errors are returned as HTTP `400 Bad Request` through a shared `ErrorResponse`, even when the underlying failure is operational. This is a current limitation of the implementation.

## File Serving

Prepared files are exposed under:

```text
/downloads/<generated-filename>
```

The backend uses Axum `ServeDir` to expose the temp directory.

## CORS

The server currently allows any origin, method, and header:

- `allow_origin(Any)`
- `allow_methods(Any)`
- `allow_headers(Any)`

That is convenient for development, but it is intentionally broad and may need tightening for stricter deployments.
