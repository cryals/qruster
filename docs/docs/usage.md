---
sidebar_position: 2
---

# Usage Guide

## Web Flow

The current UI is a single landing page with header, main input area, inline result cards, and footer.

### Basic Steps

1. Open the web UI.
2. Paste a supported media URL.
3. Click `Скачать` to extract metadata.
4. Review the media preview card.
5. Choose `Видео` or `Аудио`.
6. Pick one of the listed formats.
7. Click `Подготовить файл`.
8. Click `Скачать файл` after the backend returns the prepared download URL.

## Audio vs Video

### Video Mode

- Uses the extracted platform formats and `format_id`
- Best for keeping the original stream quality
- Suitable for sites like YouTube, Bilibili, Vimeo, and similar

### Audio Mode

Available output formats in the UI:

- `mp3`
- `m4a`
- `opus`
- `wav`

The backend prepares an extracted audio file using `yt-dlp` and FFmpeg.

## Format Selection

The UI no longer uses a large select dropdown for the main flow. Instead it shows:

- a mode switcher
- a compact expandable section with available formats
- a dedicated action card for preparing and downloading the file

This is intentional and matches the current landing-page style.

## Download Behavior

Prepared files are not auto-opened anymore.

The backend returns a direct `download_url`, and the frontend shows an explicit `Скачать файл` button. This avoids the old behavior where browsers could open media in a new tab instead of downloading it.

## Common Problems

### Media Info Extraction Failed

Possible reasons:

- invalid URL
- unsupported or private content
- upstream platform issue
- `yt-dlp` extraction problem

### Requested Format Is Not Available

This usually means the source platform no longer exposes the chosen `format_id`, or the media is available only in a different stream combination.

Try:

- re-extracting formats
- selecting another stream
- switching to audio mode if only audio is needed

### Download Starts But Browser Opens The File

The current UI is designed to expose a direct download link after preparation. Browser behavior can still depend on server headers and the file type, but the frontend now avoids automatic navigation.

## API Examples

### Extract

```bash
curl -X POST http://localhost:8080/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=..."}'
```

### Download Video

```bash
curl -X POST http://localhost:8080/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url":"https://www.youtube.com/watch?v=...",
    "format":"137",
    "audio_only":false
  }'
```

### Download Audio

```bash
curl -X POST http://localhost:8080/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url":"https://www.youtube.com/watch?v=...",
    "format":"mp3",
    "audio_only":true
  }'
```
