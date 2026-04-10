---
sidebar_position: 7
---

# Development Guide

This guide is intentionally practical. It describes the repository as it exists now.

## Prerequisites

- Rust stable
- Node.js 20+
- npm
- `ffmpeg`
- `yt-dlp`
- Git

## Start The Project

### Interactive scripts

From the repository root:

```bash
./scripts/setup.sh
./scripts/run.sh
```

### Manual backend start

```bash
cd backend
cargo run
```

### Manual frontend start

```bash
cd frontend
npm ci
npm run dev
```

## Repository Layout

```text
qruster/
├── .github/
│   └── workflows/
├── backend/
│   ├── src/
│   │   ├── extractors/
│   │   ├── handlers/
│   │   ├── services/
│   │   └── main.rs
│   └── Cargo.toml
├── docs/
│   ├── docs/
│   ├── i18n/ru/
│   ├── docusaurus.config.ts
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── theme/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── scripts/
├── docker-compose.yml
├── Caddyfile
└── README.md
```

## Frontend Development

### Main responsibility split

- `App.tsx`: page shell, theme toggle, top-level state, URL submit flow
- `components/MediaPreview.tsx`: media summary card
- `components/FormatSelector.tsx`: video/audio mode and format selection UI
- `components/DownloadButton.tsx`: prepare-download flow and explicit final download link
- `services/api.ts`: all HTTP calls to backend

### Frontend commands

```bash
cd frontend
npm ci
npm run dev
npm run build
npm run lint
```

### Frontend notes

- the current UI is custom styled inside `App.tsx`
- MUI is still used for layout primitives, typography, collapse, alerts, and some icons
- the landing page and result cards are intentionally kept in one visual style

## Backend Development

### Main responsibility split

- `main.rs`: router, CORS, temp dir, static `/downloads` serving
- `handlers/extract.rs`: extract request validation and response shaping
- `handlers/download.rs`: download request validation and mode selection
- `handlers/formats.rs`: placeholder formats endpoint
- `services/ytdlp.rs`: shell execution of `yt-dlp`
- `services/downloader.rs`: temp file and output path handling
- `extractors/*.rs`: platform-specific detection and extraction

### Backend commands

```bash
cd backend
cargo fmt -- --check
cargo clippy -- -D warnings
cargo test
cargo check
```

### Extractor model

To add a new extractor:

1. create `backend/src/extractors/<platform>.rs`
2. implement `MediaExtractor`
3. register the module and add it to `detect_platform()`
4. keep `generic::GenericExtractor` last, because it matches any HTTP/HTTPS URL

## Docs Development

### Commands

```bash
cd docs
npm ci
npm run start
npm run build
```

### Important note

The docs site now builds correctly after removing the incorrect `type: commonjs` setting from `docs/package.json`. Docusaurus generates ESM client modules, and that package setting was breaking the build pipeline.

## CI and GitHub Actions

### Current workflows

- `.github/workflows/ci.yml`
- `.github/workflows/docs.yml`

### CI behavior

`ci.yml` currently checks:

- backend formatting
- backend clippy
- backend tests
- frontend install, lint, and build
- Docker image build for backend and frontend

`docs.yml` currently:

- installs docs dependencies
- builds the Docusaurus site
- uploads the Pages artifact
- deploys to GitHub Pages

## What Is Still Rough

These are real development caveats, not theory:

- there are no backend unit tests for most extractors yet
- `GET /api/formats` is still not wired to real extracted formats
- file cleanup exists in code but is not automatically scheduled
- error status codes are simplified and mostly return `400`
- several docs pages used to describe future ideas as current behavior; this has been corrected
