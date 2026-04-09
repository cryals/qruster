---
sidebar_position: 2
---
# Concept & Ideas

## Introduction

Media Downloader is a universal selfhosted web service for downloading audio and video content from popular platforms. The project is built with a focus on simplicity, privacy, and complete control over your data.

## Why Do We Need This?

### Problems with Existing Solutions

1. **Dependency on Online Services**: Most media download services work online, which means:
   - Sending your URLs to third-party servers
   - Privacy and security risks
   - Dependency on service availability
   - Download limitations

2. **Complex Installation**: Existing selfhosted solutions often require:
   - Deep technical knowledge
   - Manual configuration of multiple components
   - Complex update processes

3. **Limited Functionality**: Many tools only support YouTube or a limited set of platforms.

### Our Solution

Media Downloader solves these problems through:

- **Complete Control**: Everything runs on your server, no data leaves your infrastructure
- **Simple Deployment**: Automated setup.sh/setup.bat scripts make installation trivial
- **Universal**: Support for 20+ platforms out of the box
- **Production-ready**: Docker, automatic SSL, service health monitoring

## How Does It Work?

### Architecture Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Browser   │ ──────> │    Caddy     │ ──────> │  React Frontend │
│   (User)    │ <────── │ (SSL/Proxy)  │ <────── │   (Port 3000)   │
└─────────────┘         └──────────────┘         └─────────────────┘
                               │                           │
                               │                           │ API Calls
                               v                           v
                        ┌──────────────┐         ┌─────────────────┐
                        │     Rust     │ <────── │   Extractors    │
                        │   Backend    │         │  (20+ platforms)│
                        │  (Port 8080) │         └─────────────────┘
                        └──────────────┘                   │
                               │                           │
                               v                           v
                        ┌──────────────┐         ┌─────────────────┐
                        │    FFmpeg    │         │     yt-dlp      │
                        │ (Conversion) │         │   (Fallback)    │
                        └──────────────┘         └─────────────────┘
```

### Download Process

1. **URL Input**: User pastes a link to media content
2. **Platform Detection**: System automatically detects platform from URL
3. **Metadata Extraction**: Retrieves video/audio information (title, duration, available formats)
4. **Format Selection**: User chooses desired format and quality
5. **Download**: Backend downloads content to temporary directory
6. **Conversion** (optional): FFmpeg converts to desired format
7. **File Delivery**: User receives the ready file
8. **Cleanup**: Temporary files are deleted

## Extractor Architecture

### Extractor Design

Each platform has its own extractor implementing a common trait:

```rust
pub trait MediaExtractor {
    // Determines if this extractor is suitable for the given URL
    fn detect(&self, url: &str) -> bool;
    
    // Extracts media information
    async fn extract_info(&self, url: &str) -> Result<MediaInfo>;
    
    // Gets direct download links
    async fn get_download_urls(&self, url: &str, quality: Quality) 
        -> Result<Vec<DownloadOption>>;
}
```

### Extraction Strategies

1. **Official APIs**: For platforms with public APIs (YouTube, SoundCloud)
2. **Web Scraping**: Extracting data from HTML/JavaScript
3. **Reverse Engineering**: Analyzing mobile APIs and internal endpoints
4. **Fallback to yt-dlp**: Universal tool as backup option

### Handling Different Scenarios

- **Video with Audio**: Direct download or stream merging
- **Video without Audio**: Download video stream only
- **Audio Only**: Extract audio track or download audio format
- **Playlists**: Batch downloading (future feature)
- **Private Content**: Authentication support (future feature)

## API Design

### RESTful Endpoints

```
POST /api/extract
Body: { "url": "https://youtube.com/watch?v=..." }
Response: {
  "platform": "youtube",
  "title": "Video Title",
  "duration": 180,
  "thumbnail": "https://...",
  "formats": [...]
}

POST /api/download
Body: { 
  "url": "https://...",
  "format": "mp4",
  "quality": "1080p",
  "audio_only": false
}
Response: {
  "download_url": "/downloads/abc123.mp4",
  "expires_at": "2026-04-09T15:00:00Z"
}

GET /api/formats
Query: ?url=https://...
Response: {
  "video": ["144p", "360p", "720p", "1080p", "4K"],
  "audio": ["mp3", "ogg", "wav"],
  "video_formats": ["mp4", "mkv", "webm"]
}

GET /api/health
Response: {
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600
}
```

### WebSocket for Progress (Future Feature)

```
WS /api/progress/:download_id
Messages: {
  "type": "progress",
  "percent": 45,
  "speed": "2.5 MB/s",
  "eta": 30
}
```

## Security and Rate Limiting

### Security Measures

1. **URL Validation**: Checking URL validity and safety
2. **Size Limits**: Maximum downloadable file size
3. **Path Sanitization**: Preventing path traversal attacks
4. **CORS Settings**: Restricting API access
5. **Rate Limiting**: Limiting number of requests

### Rate Limiting Strategy

```rust
// Limits per IP address
- 10 info extraction requests per minute
- 5 downloads per minute
- 100 requests per hour

// Size limits
- Maximum file size: 2GB
- Maximum video duration: 3 hours
```

### Abuse Protection

- Temporary files automatically deleted after 1 hour
- Download links expire after 30 minutes
- Logging all requests for audit
- Optional authentication (future feature)

## Deployment Strategy

### Development Mode

```bash
./scripts/setup.sh
# Choose: Development
# Result:
# - Backend on localhost:8080
# - Frontend on localhost:3000
# - Hot reload for both
# - Detailed logging
```

### Production Mode

```bash
./scripts/setup.sh
# Choose: Production
# Enter domain: media.example.com
# Result:
# - Docker containers
# - Caddy with automatic SSL
# - Optimized builds
# - Minimal logging
```

### Scaling

For high loads:

1. **Horizontal Scaling**: Multiple backend instances behind load balancer
2. **Caching**: Redis for metadata caching
3. **Task Queue**: RabbitMQ for async processing
4. **CDN**: For frontend static files
5. **Monitoring**: Prometheus + Grafana

## Supported Platforms

### Current Support (20+ platforms)

1. **Video Platforms**:
   - YouTube
   - Vimeo
   - Dailymotion
   - Rutube
   - Newgrounds

2. **Social Networks**:
   - TikTok
   - Instagram
   - Facebook
   - Twitter (X)
   - VK
   - Odnoklassniki
   - Reddit
   - Tumblr

3. **Streaming**:
   - Twitch (clips)
   - Streamable
   - Loom

4. **Audio**:
   - SoundCloud

5. **International**:
   - Bilibili (China)
   - Bluesky

6. **Other**:
   - Pinterest
   - Snapchat

### Future Platforms

- Spotify (audio)
- Apple Music (audio)
- Telegram (video/audio from channels)
- Discord (attachments)
- LinkedIn (video)

## Technology Choices

### Why Rust for Backend?

1. **Performance**: Close to C/C++, critical for media processing
2. **Memory Safety**: No segfaults or data races
3. **Concurrency**: Tokio for efficient async processing
4. **Ecosystem**: Great libraries (Axum, reqwest, serde)
5. **Binary Size**: Small Docker images

### Why React + MUI?

1. **Material Design 3**: Official implementation from Google
2. **Component Approach**: Reusable UI elements
3. **TypeScript**: Type safety on frontend
4. **Ecosystem**: Huge number of libraries
5. **Performance**: Virtual DOM and optimizations

### Why Docker?

1. **Isolation**: All dependencies in container
2. **Reproducibility**: Same environment everywhere
3. **Simple Deployment**: docker-compose up
4. **Scalability**: Easy to add more instances
5. **Updates**: Simple rollback on issues

### Why Caddy?

1. **Automatic SSL**: Let's Encrypt out of the box
2. **Simple Configuration**: Clear Caddyfile
3. **HTTP/2 and HTTP/3**: Modern protocols
4. **Reverse Proxy**: Proxying to backend/frontend
5. **Security**: Secure defaults

## Roadmap

### Version 1.0 (Current)

- Basic download functionality
- 20+ supported platforms
- Material Design 3 interface
- Docker deployment
- Documentation

### Version 1.1

- Download history
- Favorites
- Dark theme
- Interface multilanguage

### Version 1.2

- Playlists and batch downloading
- WebSocket for progress
- User authentication
- Quotas and limits

### Version 2.0

- Download scheduler
- Cloud storage integration
- Mobile application
- API for third-party apps
- Browser plugins

## Conclusion

Media Downloader is a modern, secure, and easy-to-use solution for downloading media content. The project combines best development practices with a focus on privacy and user control over their data.

The following documentation sections describe the architecture, installation, and system usage in detail.
