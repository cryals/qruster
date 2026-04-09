# Development Guide

## Project Architecture

Media Downloader follows a clean architecture pattern with clear separation between layers.

## Backend Architecture (Rust)

### Core Components

**Extractors Layer**
The extractor system is the heart of the application. Each platform has its own extractor implementing the `MediaExtractor` trait.

```rust
pub trait MediaExtractor: Send + Sync {
    fn detect(&self, url: &str) -> bool;
    async fn extract_info(&self, url: &str) -> Result<MediaInfo>;
    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String>;
}
```

How it works:
- `detect()` checks if URL matches the platform pattern
- `extract_info()` retrieves video/audio metadata
- `get_download_url()` generates direct download link

**Services Layer**
Business logic is encapsulated in services:

`YtDlpService` - Wrapper around yt-dlp subprocess
- Executes yt-dlp commands
- Parses JSON output
- Handles errors and retries

`Downloader` - File management service
- Creates temporary files
- Manages download lifecycle
- Cleans up expired files

**Handlers Layer**
HTTP request handlers using Axum framework:
- `extract` - Analyzes URL and returns metadata
- `download` - Initiates download and returns file path
- `formats` - Lists available formats
- `health` - Service health check

### Data Flow

```
User Request → Handler → Extractor → yt-dlp → FFmpeg → File → User
```

Detailed flow:

**Extract Flow:**
```
POST /api/extract
  ↓
extract_handler()
  ↓
detect_platform(url) - finds matching extractor
  ↓
extractor.extract_info(url)
  ↓
YtDlpService.extract_info()
  ↓
Execute: yt-dlp --dump-json URL
  ↓
Parse JSON response
  ↓
Return MediaInfo{title, duration, formats[]}
```

**Download Flow:**
```
POST /api/download
  ↓
download_handler()
  ↓
Downloader.download(url, format, audio_only)
  ↓
Generate temp filename: UUID.ext
  ↓
YtDlpService.download() or download_audio()
  ↓
Execute: yt-dlp -f FORMAT -o PATH URL
  ↓
File saved to /tmp/media-downloader/
  ↓
Return download URL: /downloads/UUID.ext
  ↓
User downloads via ServeDir
```

### Extractor Implementation

Each extractor follows this pattern:

```rust
pub struct YouTubeExtractor;

impl MediaExtractor for YouTubeExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("youtube.com") || url.contains("youtu.be")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        // Platform-specific logic or fallback to yt-dlp
        let ytdlp = YtDlpService::new();
        ytdlp.extract_info(url).await
    }

    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String> {
        // Generate direct download link
    }
}
```

### Error Handling

Errors are handled at multiple levels:

**Service Level:**
```rust
pub async fn extract_info(&self, url: &str) -> Result<YtDlpInfo> {
    let output = TokioCommand::new("yt-dlp")
        .args(["--dump-json", url])
        .output()
        .await
        .context("Failed to execute yt-dlp")?;

    if !output.status.success() {
        anyhow::bail!("yt-dlp failed: {}", error);
    }
    // ...
}
```

**Handler Level:**
```rust
match downloader.download(url, format).await {
    Ok(filepath) => Json(DownloadResponse { ... }),
    Err(e) => ErrorResponse {
        error: format!("Download failed: {}", e)
    }.into_response()
}
```

### Concurrency Model

The backend uses Tokio for async operations:

- Each request runs in its own task
- yt-dlp subprocess runs asynchronously
- File I/O is non-blocking
- Multiple downloads can run concurrently

## Frontend Architecture (React)

### Component Structure

```
App (main container)
├── URLInput (URL entry and validation)
├── MediaPreview (displays video/audio info)
├── FormatSelector (quality and format selection)
├── DownloadButton (initiates download)
└── PlatformBadges (shows supported platforms)
```

### State Management

Uses React hooks for local state:

```typescript
const [mediaInfo, setMediaInfo] = useState<ExtractResponse | null>(null);
const [selectedFormat, setSelectedFormat] = useState<string>('');
const [audioOnly, setAudioOnly] = useState(false);
```

### API Communication

`api.ts` service handles all backend communication:

```typescript
export const api = {
  async extract(url: string): Promise<ExtractResponse> {
    const response = await axios.post('/api/extract', { url });
    return response.data;
  },

  async download(request: DownloadRequest): Promise<DownloadResponse> {
    const response = await axios.post('/api/download', request);
    return response.data;
  }
};
```

### Material Design 3 Theme

Custom theme based on M3 specifications:

```typescript
export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#6750A4' },
        secondary: { main: '#625B71' },
      }
    },
    dark: {
      palette: {
        primary: { main: '#D0BCFF' },
        secondary: { main: '#CCC2DC' },
      }
    }
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Roboto' }
});
```

## Development Workflow

### Setting Up Development Environment

```bash
# Clone repository
git clone https://github.com/cryals/qruster.git
cd qruster

# Backend setup
cd backend
cargo build
cargo test

# Frontend setup
cd ../frontend
npm install
npm run dev

# Run both
cd ..
./scripts/run.sh  # Choose Development
```

### Code Style

**Rust:**
- Follow Rust standard style
- Run `cargo fmt` before committing
- Run `cargo clippy` to catch issues
- Add tests for new features

**TypeScript/React:**
- Use functional components with hooks
- Follow ESLint rules
- Use TypeScript types, avoid `any`
- Keep components small and focused

### Testing

**Backend:**
```bash
cd backend
cargo test
cargo clippy
```

**Frontend:**
```bash
cd frontend
npm run lint
npm run build
```

### Adding New Platform

To add support for a new platform:

**Step 1: Create extractor file**
```bash
touch backend/src/extractors/newplatform.rs
```

**Step 2: Implement MediaExtractor**
```rust
use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct NewPlatformExtractor;

#[async_trait]
impl MediaExtractor for NewPlatformExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("newplatform.com")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        // Implementation
    }

    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String> {
        // Implementation
    }
}
```

**Step 3: Register in mod.rs**
```rust
pub mod newplatform;

// In detect_platform():
Box::new(newplatform::NewPlatformExtractor),
```

**Step 4: Test**
```bash
cargo test
# Manual testing with real URLs
```

**Step 5: Update documentation**
- Add to `docs/src/en/platforms.md`
- Add to `docs/src/ru/platforms.md`

### Debugging

**Backend logs:**
```bash
RUST_LOG=debug cargo run
```

**Frontend dev tools:**
- Open browser DevTools
- Check Network tab for API calls
- Check Console for errors

### Performance Optimization

**Backend:**
- Use connection pooling for HTTP requests
- Cache metadata when possible
- Implement rate limiting per IP
- Use streaming for large files

**Frontend:**
- Lazy load components
- Optimize bundle size
- Use React.memo for expensive components
- Debounce URL input

## Deployment

### Development Deployment

```bash
./scripts/setup.sh  # Choose Development
./scripts/run.sh
```

### Production Deployment

```bash
./scripts/setup.sh  # Choose Production
# Enter domain when prompted
./scripts/run.sh
```

### Docker Deployment

```bash
docker compose up -d --build
docker compose logs -f
```

### Monitoring

Check service health:
```bash
curl http://localhost:8080/api/health
```

View logs:
```bash
# Development
tail -f backend.log

# Production
docker compose logs -f backend
docker compose logs -f frontend
```

## Contributing

### Pull Request Process

- Fork the repository
- Create feature branch
- Make changes
- Run tests
- Update documentation
- Submit PR

### Code Review Checklist

- Code follows style guidelines
- Tests pass
- Documentation updated
- No security vulnerabilities
- Performance considered
- Error handling implemented

## Troubleshooting

### Common Issues

**yt-dlp not found:**
```bash
pip install yt-dlp
# or
sudo apt install yt-dlp
```

**FFmpeg not found:**
```bash
sudo apt install ffmpeg
```

**Port already in use:**
```bash
lsof -i :8080
kill -9 <PID>
```

**Rust compilation errors:**
```bash
cargo clean
cargo build
```

## Resources

- [Rust Book](https://doc.rust-lang.org/book/)
- [Axum Documentation](https://docs.rs/axum/)
- [React Documentation](https://react.dev/)
- [Material-UI](https://mui.com/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
