---
sidebar_position: 5
---

# Architecture

This page explains how the current project is organized in code, not an idealized future version.

## High-Level Shape

The repository has three main runtime areas:

1. `frontend/` for the browser UI
2. `backend/` for the API and download pipeline
3. `docs/` for the Docusaurus documentation site

## Frontend

The frontend is a Vite + React application.

### Entry flow

- [`frontend/src/main.tsx`](../../frontend/src/main.tsx) mounts the app and applies the MUI theme
- [`frontend/src/App.tsx`](../../frontend/src/App.tsx) owns the main page flow and top-level state

### Current UI behavior

The current UI is a single landing-page style screen:

- sticky header
- main hero with URL input
- inline media result cards
- footer

After a URL is submitted:

1. `App.tsx` calls `api.extract`
2. the media card is rendered
3. the user picks mode and format
4. the user clicks `Подготовить файл`
5. the backend returns a temporary `download_url`
6. the frontend shows an explicit `Скачать файл` link

### Frontend structure

```text
frontend/src/
├── App.tsx
├── main.tsx
├── components/
│   ├── DownloadButton.tsx
│   ├── FormatSelector.tsx
│   ├── MediaPreview.tsx
│   ├── PlatformBadges.tsx
│   └── URLInput.tsx
├── services/
│   └── api.ts
└── theme/
    └── theme.ts
```

### Important frontend modules

#### `App.tsx`

Owns:

- theme toggle state
- services popover state
- current URL
- loading/error state
- extracted media data
- selected format
- audio/video mode

It also contains the main landing-page CSS used by the current UI.

#### `services/api.ts`

Wraps the backend API:

- `extract(url)`
- `download(request)`
- `getFormats(url)`
- `health()`

#### `FormatSelector.tsx`

Implements the actual selection logic used by the UI:

- video mode uses extracted `format_id`s
- audio mode uses predefined output formats like `mp3` and `wav`

This distinction matters because the backend interprets `format` differently depending on `audio_only`.

## Backend

The backend is an Axum application running on port `8080`.

### Router

Defined in [`backend/src/main.rs`](../../backend/src/main.rs):

- `GET /`
- `GET /api/health`
- `POST /api/extract`
- `POST /api/download`
- `GET /api/formats`
- `/downloads/*` static file serving from the temp directory

### Backend structure

```text
backend/src/
├── main.rs
├── handlers/
│   ├── download.rs
│   ├── extract.rs
│   ├── formats.rs
│   └── mod.rs
├── extractors/
│   ├── bilibili.rs
│   ├── bluesky.rs
│   ├── dailymotion.rs
│   ├── facebook.rs
│   ├── generic.rs
│   ├── instagram.rs
│   ├── loom.rs
│   ├── newgrounds.rs
│   ├── odnoklassniki.rs
│   ├── pinterest.rs
│   ├── reddit.rs
│   ├── rutube.rs
│   ├── snapchat.rs
│   ├── soundcloud.rs
│   ├── streamable.rs
│   ├── tiktok.rs
│   ├── tumblr.rs
│   ├── twitch.rs
│   ├── twitter.rs
│   ├── vimeo.rs
│   ├── vk.rs
│   ├── youtube.rs
│   └── mod.rs
└── services/
    ├── downloader.rs
    ├── mod.rs
    └── ytdlp.rs
```

### Handler responsibilities

#### `extract.rs`

- validates incoming URL shape
- chooses an extractor via `detect_platform`
- returns normalized media info and format list

#### `download.rs`

- validates request payload
- decides whether request is in video or audio mode
- passes either a video `format_id` or an audio format to the downloader
- returns a temporary `/downloads/...` URL

#### `formats.rs`

Currently returns static placeholder lists. It is not yet connected to actual extractor output.

## Extractor Layer

All extractors implement the `MediaExtractor` trait in [`backend/src/extractors/mod.rs`](../../backend/src/extractors/mod.rs).

Current trait:

```rust
pub trait MediaExtractor: Send + Sync {
    fn detect(&self, url: &str) -> bool;
    async fn extract_info(&self, url: &str) -> Result<MediaInfo>;
    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String>;
}
```

### How extractor selection works

`detect_platform(url)` iterates through registered extractors in a fixed order and returns the first one whose `detect()` returns `true`.

Important consequence:

- `generic::GenericExtractor` is the fallback and matches any `http://` or `https://` URL
- specific extractors must stay before `generic`

## Download Pipeline

The real download logic is split across two services.

### `services/downloader.rs`

Responsibilities:

- creates the temp directory
- generates UUID filenames
- chooses output extension
- delegates actual work to `YtDlpService`
- verifies the output file was created

### `services/ytdlp.rs`

Responsibilities:

- run `yt-dlp --dump-json` for metadata extraction
- parse `formats` from the `yt-dlp` JSON output
- download a selected video format
- extract audio via `-x --audio-format`

### Video download selector

Current logic for video mode:

- if a specific format is selected, backend uses a selector like `fmt+bestaudio/fmt/best`
- otherwise it falls back to `bv*+ba/b`

That is important for platforms such as Bilibili where a plain `best` request can fail or choose the wrong stream.

## File Lifecycle

Prepared files are written into:

```text
<system-temp>/media-downloader
```

In Docker mode, the compose file mounts:

```text
./downloads -> /tmp/media-downloader
```

There is cleanup code in `Downloader::cleanup_old_files()`, but it is not currently scheduled automatically in `main.rs`.

## Current Limitations

These are important because the docs should reflect reality:

- no authentication layer
- no rate limiter in the current code
- `GET /api/formats` is still a placeholder endpoint
- `health.uptime` is hardcoded to `0`
- broad `CORS` is enabled for all origins
- cleanup exists in code but is not automatically triggered

## Deployment Layers

### Development

- frontend on `localhost:3000`
- backend on `localhost:8080`

### Production

The repository includes:

- [`docker-compose.yml`](../../docker-compose.yml)
- `Caddyfile.example`

Default Docker services:

- `backend`
- `frontend`
- `caddy`

Caddy is intended to reverse proxy browser traffic to the frontend and `/api/*` traffic to the backend.
