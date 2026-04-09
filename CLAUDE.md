# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Media Downloader is a universal selfhosted service for downloading audio and video from 20+ platforms (YouTube, TikTok, Instagram, Facebook, Twitter/X, VK, Bilibili, Bluesky, Dailymotion, Vimeo, Rutube, and more). The project uses a Rust backend with Axum framework and a React + TypeScript frontend with Material-UI v6.

## Development Commands

### Backend (Rust)
```bash
cd backend
cargo build              # Build the backend
cargo run               # Run backend server (http://localhost:8080)
cargo test              # Run tests
```

### Frontend (React + TypeScript)
```bash
cd frontend
npm install             # Install dependencies
npm run dev            # Start dev server (http://localhost:3000)
npm run build          # Build for production
npm run lint           # Run ESLint
```

### Documentation (Docusaurus)
```bash
cd docs
npm install            # Install dependencies
npm start              # Start docs dev server
npm run build          # Build docs for production
```

### Full Stack Development
```bash
./scripts/setup.sh     # Initial setup (choose Development mode)
./scripts/run.sh       # Start dev servers (option 1)
```

### Production Deployment
```bash
./scripts/setup.sh     # Initial setup (choose Production mode)
./scripts/run.sh       # Start Docker containers (option 2)
docker compose up -d --build    # Manual Docker start
docker compose down             # Stop containers
docker compose logs -f          # View logs
```

## Architecture

### Backend Structure (`backend/src/`)

The Rust backend follows a modular architecture:

- **`main.rs`**: Entry point, sets up Axum router with CORS, serves API endpoints and static downloads
- **`handlers/`**: HTTP request handlers for API endpoints
  - `extract.rs`: Extracts media metadata from URLs
  - `download.rs`: Handles media download requests
  - `formats.rs`: Returns available format options
- **`services/`**: Business logic layer
  - `ytdlp.rs`: Wrapper around yt-dlp for media extraction
  - `downloader.rs`: Handles actual media downloading and processing
- **`extractors/`**: Platform-specific URL pattern matching (20+ platforms)
  - Each platform has its own module (e.g., `youtube.rs`, `tiktok.rs`, `instagram.rs`)
  - `generic.rs`: Fallback for unrecognized platforms
  - `mod.rs`: Coordinates platform detection and routing

### API Endpoints

- `GET /`: API version info
- `GET /api/health`: Health check endpoint
- `POST /api/extract`: Extract media info from URL (returns title, thumbnail, formats)
- `POST /api/download`: Download media with specified format
- `GET /api/formats`: Get available format options
- `GET /downloads/*`: Serve downloaded files

### Frontend Structure (`frontend/src/`)

React application with Material-UI components:

- **`App.tsx`**: Main application component, manages state for URL input, media info, format selection
- **`components/`**: Reusable UI components
  - `URLInput.tsx`: URL input field
  - `MediaPreview.tsx`: Display media thumbnail and metadata
  - `FormatSelector.tsx`: Format/quality selection dropdown
  - `DownloadButton.tsx`: Trigger download action
  - `PlatformBadges.tsx`: Display supported platforms
- **`services/api.ts`**: Axios-based API client for backend communication
- **`theme/theme.ts`**: Material-UI theme configuration

### State Flow

1. User enters URL → `URLInput` component
2. Frontend calls `/api/extract` → Backend uses yt-dlp to extract metadata
3. Backend detects platform via `extractors/` → Routes to appropriate handler
4. Media info displayed → `MediaPreview` and `FormatSelector` components
5. User selects format and clicks download → `/api/download` endpoint
6. Backend downloads media → Stores in temp directory → Returns download URL

## Key Dependencies

### Backend
- `axum`: Web framework
- `tokio`: Async runtime
- `tower-http`: CORS and static file serving
- `serde`/`serde_json`: JSON serialization
- `reqwest`: HTTP client
- External: `yt-dlp` and `ffmpeg` (must be installed on system)

### Frontend
- `react` + `react-dom`: UI framework
- `@mui/material` v6: Material Design components
- `axios`: HTTP client
- `vite`: Build tool and dev server

### Documentation
- `@docusaurus/core` v3.5.2: Documentation site generator
- Bilingual support (English/Russian)
- Custom webpack plugin to disable progress bar (see `docs/plugins/disable-webpackbar.js`)

## Important Notes

- **Node Version**: Docs require Node.js 20+ (specified in `docs/package.json` engines)
- **Docusaurus Stability**: Currently pinned to v3.5.2 due to webpack issues with newer versions
- **Temp Directory**: Downloads are stored in `/tmp/media-downloader` (configurable via Docker volume)
- **CORS**: Backend allows all origins in development (configured in `main.rs`)
- **Deployment**: Production uses Caddy for reverse proxy with automatic SSL

## Docker Architecture

Three services in `docker-compose.yml`:
1. **backend**: Rust server on port 8080
2. **frontend**: Nginx serving built React app on port 80
3. **caddy**: Reverse proxy with automatic SSL (ports 80/443)

Caddy routes `/api/*` to backend and everything else to frontend.
