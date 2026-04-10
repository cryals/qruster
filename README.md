<p align="center">
  <img src="assets/logo.png" alt="Media Downloader logo" width="140">
</p>

<h1 align="center">Media Downloader</h1>

<p align="center">
  Self-hosted web service for downloading audio and video from 20+ supported platforms.
</p>

<p align="center">
  <a href="docs/">Documentation</a> •
  <a href="docs/docs/installation.md">Installation</a> •
  <a href="docs/docs/usage.md">Usage</a> •
  <a href="docs/docs/api.md">API</a>
</p>

## Features

- Paste a media URL, inspect available formats, and prepare a direct download link
- Audio export modes: `mp3`, `m4a`, `opus`, `wav`
- Video download from platform-provided streams and format IDs
- Dark adaptive web UI with desktop and mobile layouts
- Rust backend with `yt-dlp` and FFmpeg integration
- Docker deployment with optional Caddy reverse proxy

## Supported Platforms

YouTube, TikTok, Instagram, Facebook, Twitter/X, VK, Bilibili, Vimeo, Reddit, SoundCloud, Twitch, Dailymotion, Rutube, Bluesky, Pinterest, Tumblr, Loom, Streamable, Newgrounds, Snapchat, OK.ru

## Quick Start

### Development

```bash
./scripts/setup.sh
./scripts/run.sh
```

Choose `1` for development mode. The app will be available at:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

### Production

```bash
./scripts/setup.sh
./scripts/run.sh
```

Choose `2` for production mode to build and run the Docker stack.

## Requirements

### Development

- Rust stable
- Node.js 20+
- `ffmpeg`
- `yt-dlp`

### Production

- Docker 24+
- Docker Compose v2

## Project Structure

```text
yt-to-mp3/
├── backend/      # Rust API and download pipeline
├── frontend/     # Vite + React web UI
├── docs/         # Docusaurus documentation site
├── scripts/      # Setup and run scripts
├── .github/      # CI and Pages workflows
├── docker-compose.yml
└── Caddyfile
```

## Documentation

- Docs source: [`docs/`](docs/)
- Main intro: [`docs/docs/intro.md`](docs/docs/intro.md)
- Usage guide: [`docs/docs/usage.md`](docs/docs/usage.md)
- Installation: [`docs/docs/installation.md`](docs/docs/installation.md)
- API reference: [`docs/docs/api.md`](docs/docs/api.md)

The Docusaurus site is configured for GitHub Pages under the `cryals/yt-to-mp3` repository.

## License

MIT. See [`LICENSE`](LICENSE).
