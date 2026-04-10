---
sidebar_position: 1
slug: /
---

# Media Downloader

Self-hosted downloader for video and audio links with a web UI, Rust backend, and `yt-dlp` pipeline.

## What It Does

Media Downloader accepts a supported media URL, extracts available formats, and prepares a downloadable file.

Current web flow:

1. Paste a URL into the landing page.
2. Click `Скачать` to extract metadata and formats.
3. Review the media card and choose video or audio mode.
4. Click `Подготовить файл`.
5. Use the generated `Скачать файл` button.

The frontend no longer auto-opens the prepared file in a new tab. Download is now an explicit user action.

## Main Components

- `frontend/`: Vite + React UI
- `backend/`: Axum API server
- `docs/`: Docusaurus documentation
- `scripts/`: interactive setup and run scripts

## Supported Platforms

YouTube, TikTok, Instagram, Facebook, Twitter/X, VK, Bilibili, Vimeo, Reddit, SoundCloud, Twitch, Dailymotion, Rutube, Bluesky, Pinterest, Tumblr, Loom, Streamable, Newgrounds, Snapchat, OK.ru

## Stack

- Frontend: React 18, TypeScript, Vite, MUI
- Backend: Rust, Axum, Tokio
- Media tools: `yt-dlp`, FFmpeg
- Infrastructure: Docker, Docker Compose, Caddy, GitHub Actions

## Next Pages

- [Installation](installation.md)
- [Usage Guide](usage.md)
- [API Reference](api.md)
- [Development Guide](development.md)
