---
sidebar_position: 2
---
# Architecture

## System Overview

Media Downloader is built on a microservices architecture with clear separation of responsibilities between components.

## System Components

### 1. Frontend (React + MUI)

**Technologies:**
- React 18 with TypeScript
- Material-UI v6 (Material Design 3)
- Vite for building
- Axios for HTTP requests

**Structure:**
```
frontend/src/
├── components/       # React components
│   ├── URLInput.tsx
│   ├── MediaPreview.tsx
│   ├── FormatSelector.tsx
│   └── DownloadButton.tsx
├── services/         # API clients
│   └── api.ts
├── theme/            # Material Design 3 theme
│   └── theme.ts
└── App.tsx           # Main component
```

**Responsibilities:**
- User interface
- Client-side URL validation
- Media information display
- Application state management

### 2. Backend (Rust + Axum)

**Technologies:**
- Rust 1.77+
- Axum (web framework)
- Tokio (async runtime)
- Serde (serialization)
- Reqwest (HTTP client)

**Structure:**
```
backend/src/
├── handlers/         # HTTP handlers
│   ├── extract.rs
│   ├── download.rs
│   ├── formats.rs
│   └── mod.rs
├── extractors/       # Platform extractors
│   ├── youtube.rs
│   ├── tiktok.rs
│   ├── generic.rs
│   └── mod.rs
├── services/         # Business logic
│   ├── downloader.rs
│   └── mod.rs
└── main.rs           # Entry point
```

**Responsibilities:**
- REST API endpoints
- Metadata extraction
- Media downloading
- Format conversion
- Rate limiting

### 3. Reverse Proxy (Caddy)

**Functions:**
- Automatic SSL via Let's Encrypt
- Request proxying to backend/frontend
- HTTP/2 and HTTP/3 support
- Static configuration via Caddyfile

### 4. Platform Extractors

Each platform has its own extractor implementing a common interface:

```rust
pub trait MediaExtractor {
    fn detect(&self, url: &str) -> bool;
    async fn extract_info(&self, url: &str) -> Result<MediaInfo>;
    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String>;
}
```

**Extractor List:**
- YouTubeExtractor
- TikTokExtractor
- InstagramExtractor
- VKExtractor
- BilibiliExtractor
- GenericExtractor (fallback to yt-dlp)

## Data Flow

### Information Extraction

```
1. User enters URL
   ↓
2. Frontend validates URL
   ↓
3. POST /api/extract → Backend
   ↓
4. Backend detects platform (detect_platform)
   ↓
5. Call corresponding extractor
   ↓
6. Extractor retrieves metadata
   ↓
7. Return MediaInfo → Frontend
   ↓
8. Display preview and formats
```

### File Download

```
1. User selects format and quality
   ↓
2. POST /api/download → Backend
   ↓
3. Backend downloads media to temp directory
   ↓
4. FFmpeg converts (if needed)
   ↓
5. Generate temporary download link
   ↓
6. Return download_url → Frontend
   ↓
7. Browser downloads file
   ↓
8. Cleanup temp files (after 1 hour)
```

## Data Models

### MediaInfo

```rust
pub struct MediaInfo {
    pub platform: String,      // "youtube", "tiktok", etc.
    pub title: String,         // Media title
    pub duration: Option<u64>, // Duration in seconds
    pub thumbnail: Option<String>, // Preview URL
    pub formats: Vec<Format>,  // Available formats
}
```

### Format

```rust
pub struct Format {
    pub format_id: String,     // Unique format ID
    pub quality: String,       // "720p", "1080p", "best"
    pub ext: String,           // "mp4", "webm", "mp3"
    pub filesize: Option<u64>, // Size in bytes
    pub url: Option<String>,   // Direct link (if available)
}
```

## Security

### Rate Limiting

Implemented at backend level using tower-governor:

```rust
// Limits per IP
- 10 /api/extract requests per minute
- 5 /api/download requests per minute
- 100 requests per hour (total limit)
```

### Validation

1. **URL validation**: Check URL validity and safety
2. **Path sanitization**: Prevent path traversal attacks
3. **Size limits**: Maximum file size 2GB
4. **Duration limits**: Maximum video duration 3 hours

### CORS

Configured to allow requests only from frontend:

```rust
let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);
```

## Scaling

### Horizontal Scaling

```
                    ┌─────────────┐
                    │Load Balancer│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │Backend 1│       │Backend 2│       │Backend 3│
   └─────────┘       └─────────┘       └─────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │Shared Storage│
                    └─────────────┘
```

### Caching

For high loads, Redis can be added:

```
Frontend → Backend → Redis Cache → Extractors
                         ↓
                    (cache miss)
                         ↓
                   External APIs
```

### Task Queue

For async processing, RabbitMQ can be used:

```
Backend → RabbitMQ → Workers → FFmpeg
```

## Monitoring

### Metrics

Recommended: Prometheus + Grafana:

- Request count by endpoints
- API response time
- Successful/failed download count
- Disk usage (temp files)
- CPU/RAM usage

### Logging

Structured logging via tracing:

```rust
tracing::info!("Extracting info from URL: {}", url);
tracing::error!("Failed to download: {}", error);
```

## Deployment

### Development

```
┌──────────┐     ┌──────────┐
│ Frontend │     │ Backend  │
│  :3000   │────▶│  :8080   │
└──────────┘     └──────────┘
```

### Production

```
        ┌──────────┐
        │  Caddy   │
        │ :80/:443 │
        └────┬─────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼────┐
│Frontend│      │ Backend │
│  :80   │      │  :8080  │
└────────┘      └─────────┘
```

## Error Handling

### Error Types

```rust
pub enum AppError {
    InvalidUrl,
    UnsupportedPlatform,
    ExtractionFailed,
    DownloadFailed,
    ConversionFailed,
    RateLimitExceeded,
}
```

### Handling Strategy

1. **Graceful degradation**: Fallback to yt-dlp on extractor error
2. **Retry logic**: Retry attempts for network errors
3. **User feedback**: Clear error messages
4. **Logging**: Detailed logging for debugging

## Performance

### Optimizations

1. **Async/await**: Non-blocking I/O operations
2. **Connection pooling**: HTTP connection reuse
3. **Streaming**: Stream large files
4. **Compression**: Gzip for API responses
5. **CDN**: Frontend static files via CDN

### Benchmarks

Target metrics:

- Metadata extraction time: < 2 seconds
- Download start time: < 5 seconds
- Throughput: 100+ concurrent users
- Memory usage: < 512MB per instance

## Future Improvements

1. **WebSocket**: Real-time download progress
2. **Database**: PostgreSQL for history and users
3. **Queue**: RabbitMQ for background tasks
4. **Cache**: Redis for metadata
5. **CDN**: CloudFlare for static files
6. **Monitoring**: Prometheus + Grafana
7. **Tracing**: Jaeger for distributed tracing
