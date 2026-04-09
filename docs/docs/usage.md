---
sidebar_position: 2
---
# Usage Guide

## Getting Started

After installation, you can start using Media Downloader to download audio and video from supported platforms.

## Basic Usage

### 1. Start the Application

**Development Mode:**
```bash
./scripts/run.sh
# Select option 1
```

**Production Mode:**
```bash
./scripts/run.sh
# Select option 2
```

### 2. Access the Web Interface

Open your browser and navigate to:
- Development: http://localhost:3000
- Production: https://your-domain.com

### 3. Download Media

1. **Paste URL**: Copy a video or audio URL from any supported platform
2. **Wait for Analysis**: The system will automatically detect the platform and extract available formats
3. **Choose Format**: Select your preferred quality and format
4. **Toggle Audio Only**: Enable if you only want audio
5. **Click Download**: Your file will be prepared and downloaded

## Supported Platforms

### Video Platforms

- **YouTube** - All video qualities, playlists support
- **Vimeo** - HD and 4K videos
- **Dailymotion** - Multiple quality options
- **Rutube** - Russian video platform
- **Newgrounds** - Animation and video content

### Social Media

- **TikTok** - Videos with or without watermark
- **Instagram** - Posts, Reels, Stories
- **Facebook** - Public videos
- **Twitter/X** - Video tweets
- **VK** - Videos from VKontakte
- **Odnoklassniki** - OK.ru videos
- **Reddit** - Video posts
- **Tumblr** - Video posts
- **Snapchat** - Public stories

### Streaming

- **Twitch** - Clips only (not live streams)
- **Streamable** - Short video clips
- **Loom** - Screen recordings

### Audio

- **SoundCloud** - Tracks and playlists

### International

- **Bilibili** - Chinese video platform
- **Bluesky** - Decentralized social media

### Other

- **Pinterest** - Video pins
- **Loom** - Video messages

## Download Options

### Video Quality

Available qualities depend on the source:
- **4K** (2160p) - Ultra HD
- **1080p** - Full HD
- **720p** - HD
- **480p** - SD
- **360p** - Low quality
- **144p** - Mobile quality

### Audio Formats

- **MP3** - Universal compatibility (128-320 kbps)
- **OGG** - Open format, good quality
- **WAV** - Lossless, large file size

### Video Formats

- **MP4** - Most compatible
- **MKV** - High quality container
- **WEBM** - Web optimized

### Special Options

- **Audio Only**: Extract only audio track
- **No Audio**: Download video without sound
- **Best Quality**: Automatically select highest available quality

## Advanced Features

### URL Formats

The system accepts various URL formats:

**YouTube:**
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://m.youtube.com/watch?v=VIDEO_ID
```

**TikTok:**
```
https://www.tiktok.com/@user/video/123456789
https://vm.tiktok.com/SHORT_CODE
```

**Instagram:**
```
https://www.instagram.com/p/POST_ID/
https://www.instagram.com/reel/REEL_ID/
```

### Batch Downloads

Currently, batch downloads are not supported. Download one file at a time.

### Download History

Your download history is stored locally in your browser (localStorage). Clear browser data to reset history.

## Tips and Best Practices

### For Best Results

1. **Use Direct Links**: Avoid shortened URLs when possible
2. **Check Quality**: Preview available formats before downloading
3. **Audio Extraction**: Use audio-only mode for music to save bandwidth
4. **Stable Connection**: Ensure stable internet for large files

### Performance

- **Large Files**: Downloads over 500MB may take several minutes
- **Peak Hours**: Some platforms may be slower during peak usage
- **Retry**: If download fails, wait a moment and try again

### Privacy

- **No Tracking**: We don't track your downloads
- **No Storage**: Files are temporarily stored and deleted after 1 hour
- **Local Processing**: All processing happens on your server

## Troubleshooting

### "Failed to extract media information"

**Possible causes:**
- Invalid URL
- Private or restricted content
- Platform temporarily unavailable
- Network issues

**Solutions:**
1. Verify the URL is correct and accessible
2. Check if the content is public
3. Try again in a few minutes
4. Check your internet connection

### "Download failed"

**Possible causes:**
- File too large (>2GB limit)
- Insufficient disk space
- Network timeout
- Platform blocking

**Solutions:**
1. Try a lower quality
2. Check available disk space
3. Retry the download
4. Contact administrator if persistent

### "Unsupported platform"

The URL is from a platform not yet supported. Check the [supported platforms list](#supported-platforms).

### Slow Downloads

**Possible causes:**
- Large file size
- Slow internet connection
- Server load
- Platform rate limiting

**Solutions:**
1. Choose lower quality
2. Wait for better network conditions
3. Try during off-peak hours

## API Usage

For programmatic access, see [API Reference](api.md).

### Example: Extract Info

```bash
curl -X POST http://localhost:8080/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=..."}'
```

### Example: Download

```bash
curl -X POST http://localhost:8080/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://youtube.com/watch?v=...",
    "format": "mp4",
    "quality": "720p",
    "audio_only": false
  }'
```

## Keyboard Shortcuts

- **Ctrl/Cmd + V**: Paste URL (when input is focused)
- **Enter**: Submit URL
- **Escape**: Clear input

## Mobile Usage

The interface is fully responsive and works on mobile devices:
- Touch-friendly buttons
- Optimized layout
- Same features as desktop

## Limitations

### Current Limitations

- Maximum file size: 2GB
- Maximum video duration: 3 hours
- No playlist support (coming soon)
- No live stream downloads
- Rate limiting: 5 downloads per minute per IP

### Platform-Specific Limitations

- **Instagram**: Public posts only
- **Facebook**: Public videos only
- **TikTok**: May not work with all regions
- **Twitter**: Video tweets only, no GIFs
- **Twitch**: Clips only, not live streams

## Getting Help

If you encounter issues:

1. Check this documentation
2. Review [Troubleshooting](#troubleshooting) section
3. Check [GitHub Issues](https://github.com/cryals/qruster/issues)
4. Open a new issue with details

## Next Steps

- Learn about [API Reference](api.md)
- Contribute to [Development](development.md)
- Read [Architecture](architecture.md) documentation
