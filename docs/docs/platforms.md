---
sidebar_position: 2
---
# Supported Platforms

Media Downloader supports 20+ platforms for downloading audio and video content.

## Video Platforms

### YouTube
- **URL formats**: `youtube.com/watch?v=*`, `youtu.be/*`
- **Features**: All qualities (144p-4K), audio extraction
- **Limitations**: Age-restricted content may require authentication

### Vimeo
- **URL formats**: `vimeo.com/*`
- **Features**: HD and 4K support
- **Limitations**: Private videos not supported

### Dailymotion
- **URL formats**: `dailymotion.com/video/*`, `dai.ly/*`
- **Features**: Multiple quality options
- **Limitations**: None

### Rutube
- **URL formats**: `rutube.ru/video/*`
- **Features**: Russian video platform support
- **Limitations**: None

### Newgrounds
- **URL formats**: `newgrounds.com/*`
- **Features**: Animation and video content
- **Limitations**: None

## Social Media

### TikTok
- **URL formats**: `tiktok.com/@*/video/*`, `vm.tiktok.com/*`
- **Features**: Video with or without watermark
- **Limitations**: Regional restrictions may apply

### Instagram
- **URL formats**: `instagram.com/p/*`, `instagram.com/reel/*`
- **Features**: Posts, Reels, Stories
- **Limitations**: Public content only

### Facebook
- **URL formats**: `facebook.com/*/videos/*`, `fb.watch/*`
- **Features**: Public videos
- **Limitations**: Private videos not supported

### Twitter / X
- **URL formats**: `twitter.com/*/status/*`, `x.com/*/status/*`
- **Features**: Video tweets
- **Limitations**: GIFs not supported

### VK (ВКонтакте)
- **URL formats**: `vk.com/video*`, `vk.ru/video*`
- **Features**: Multiple quality options
- **Limitations**: None

### Odnoklassniki
- **URL formats**: `ok.ru/video/*`
- **Features**: Russian social network support
- **Limitations**: None

### Reddit
- **URL formats**: `reddit.com/r/*/comments/*`, `redd.it/*`
- **Features**: Video posts
- **Limitations**: None

### Tumblr
- **URL formats**: `tumblr.com/*`
- **Features**: Video posts
- **Limitations**: None

### Snapchat
- **URL formats**: `snapchat.com/*`
- **Features**: Public stories
- **Limitations**: Private content not supported

## Streaming Platforms

### Twitch
- **URL formats**: `twitch.tv/*/clip/*`, `clips.twitch.tv/*`
- **Features**: Clips only
- **Limitations**: Live streams not supported

### Streamable
- **URL formats**: `streamable.com/*`
- **Features**: Short video clips
- **Limitations**: None

### Loom
- **URL formats**: `loom.com/share/*`
- **Features**: Screen recordings
- **Limitations**: None

## Audio Platforms

### SoundCloud
- **URL formats**: `soundcloud.com/*`
- **Features**: Tracks and playlists
- **Limitations**: None

## International Platforms

### Bilibili
- **URL formats**: `bilibili.com/video/*`, `b23.tv/*`
- **Features**: Chinese video platform
- **Limitations**: Regional content restrictions

### Bluesky
- **URL formats**: `bsky.app/*`, `bsky.social/*`
- **Features**: Decentralized social media
- **Limitations**: New platform, limited content

## Other Platforms

### Pinterest
- **URL formats**: `pinterest.com/pin/*`, `pin.it/*`
- **Features**: Video pins
- **Limitations**: None

## Platform Status

| Platform | Status | Video | Audio | Quality Options |
|----------|--------|-------|-------|-----------------|
| YouTube | ✅ Active | ✅ | ✅ | 144p-4K |
| TikTok | ✅ Active | ✅ | ✅ | 720p |
| Instagram | ✅ Active | ✅ | ✅ | Best |
| Facebook | ✅ Active | ✅ | ✅ | SD-HD |
| Twitter/X | ✅ Active | ✅ | ✅ | 720p |
| VK | ✅ Active | ✅ | ✅ | 360p-720p |
| Bilibili | ✅ Active | ✅ | ✅ | 360p-1080p |
| Vimeo | ✅ Active | ✅ | ✅ | 720p-4K |
| Reddit | ✅ Active | ✅ | ✅ | 720p |
| SoundCloud | ✅ Active | ❌ | ✅ | 128kbps |
| Twitch | ✅ Active | ✅ | ✅ | Source |
| Dailymotion | ✅ Active | ✅ | ✅ | 480p-720p |
| Rutube | ✅ Active | ✅ | ✅ | 360p-720p |
| Odnoklassniki | ✅ Active | ✅ | ✅ | 360p-720p |
| Streamable | ✅ Active | ✅ | ✅ | 720p |
| Tumblr | ✅ Active | ✅ | ✅ | 480p |
| Bluesky | ✅ Active | ✅ | ✅ | Best |
| Pinterest | ✅ Active | ✅ | ✅ | Best |
| Newgrounds | ✅ Active | ✅ | ✅ | 720p |
| Loom | ✅ Active | ✅ | ✅ | 720p |
| Snapchat | ✅ Active | ✅ | ✅ | 720p |

## Requesting New Platforms

To request support for a new platform:

1. Open an issue on [GitHub](https://github.com/cryals/qruster/issues)
2. Provide example URLs
3. Describe the platform
4. Explain why it should be added

## Platform-Specific Notes

### YouTube
- Supports age-restricted content with authentication
- Playlist support coming soon
- Live streams not supported

### TikTok
- Watermark removal depends on availability
- Some regions may have restrictions

### Instagram
- Stories expire after 24 hours
- Private accounts not supported

### Facebook
- Only public videos
- Live videos not supported

### Twitch
- Clips only, not VODs or live streams
- VOD support planned

### SoundCloud
- Free tracks only
- Premium content not supported

## Technical Implementation

All platforms use one of these methods:

1. **Official API**: Direct API integration (YouTube, SoundCloud)
2. **Web Scraping**: HTML/JavaScript parsing
3. **Reverse Engineering**: Mobile API analysis
4. **yt-dlp Fallback**: Universal extractor as backup

## Future Platforms

Planned support for:
- Spotify (audio)
- Apple Music (audio)
- Telegram (channels)
- Discord (attachments)
- LinkedIn (videos)
