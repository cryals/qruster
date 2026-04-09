# Media Downloader

Universal selfhosted service for downloading audio and video from 20+ platforms.

## Features

- Download audio (MP3, OGG, WAV) and video (MP4, MKV, WebM) from 20+ platforms
- Material Design 3 interface
- Selfhosted and privacy-focused
- Docker-ready deployment with automatic SSL
- Support for multiple qualities (144p to 4K)
- Audio-only and video-only download options

## Supported Platforms

YouTube, TikTok, Instagram, Facebook, Twitter/X, VK, Bilibili, Bluesky, Dailymotion, Vimeo, Rutube, Odnoklassniki, Pinterest, Newgrounds, Reddit, SoundCloud, Streamable, Twitch (clips), Tumblr, Snapchat, Loom

## Quick Start

### Development Mode

```bash
./scripts/setup.sh
# Select: Development
# Backend: http://localhost:8080
# Frontend: http://localhost:3000
```

### Production Mode

```bash
./scripts/setup.sh
# Select: Production
# Enter your domain
# Automatic SSL via Caddy
```

## Technology Stack

- **Frontend**: React + TypeScript + Material-UI v6
- **Backend**: Rust (Axum framework)
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Caddy (automatic SSL)
- **Media Processing**: FFmpeg + yt-dlp

## Documentation

Full documentation is available at [GitHub Pages](https://yourusername.github.io/yt-to-mp3/)

- [Concept & Ideas](docs/src/en/concept.md)
- [Architecture](docs/src/en/architecture.md)
- [Installation Guide](docs/src/en/installation.md)
- [API Reference](docs/src/en/api.md)

## Requirements

### Development
- Rust 1.75+
- Node.js 20+
- FFmpeg
- yt-dlp

### Production
- Docker 24+
- Docker Compose v2

## Project Structure

```
yt-to-mp3/
├── frontend/          # React application
├── backend/           # Rust server
├── docs/              # mdBook documentation
├── scripts/           # Deployment scripts
├── docker-compose.yml
└── Caddyfile
```

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting PRs.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
