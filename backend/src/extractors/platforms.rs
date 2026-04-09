use crate::extractors::{Format, MediaExtractor, MediaInfo};
use crate::services::ytdlp::YtDlpService;
use anyhow::Result;
use async_trait::async_trait;

/// Generic extractor template that uses yt-dlp for any platform
/// This can be used as a base for all platform-specific extractors
pub async fn extract_with_ytdlp(url: &str, platform_name: &str) -> Result<MediaInfo> {
    let ytdlp = YtDlpService::new();
    let info = ytdlp.extract_info(url).await?;

    let formats = info
        .formats
        .into_iter()
        .map(|f| {
            let quality = f.format_note.unwrap_or_else(|| {
                if f.vcodec.as_deref() == Some("none") {
                    "audio".to_string()
                } else if let Some(note) = &f.format_note {
                    note.clone()
                } else {
                    f.format_id.clone()
                }
            });
            Format {
                format_id: f.format_id,
                quality,
                ext: f.ext,
                filesize: f.filesize,
                url: None,
            }
        })
        .collect();

    Ok(MediaInfo {
        platform: platform_name.to_string(),
        title: info.title,
        duration: info.duration.map(|d| d as u64),
        thumbnail: info.thumbnail,
        formats,
    })
}

// TikTok
pub struct TikTokExtractor;
#[async_trait]
impl MediaExtractor for TikTokExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("tiktok.com") || url.contains("vm.tiktok.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "tiktok").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Instagram
pub struct InstagramExtractor;
#[async_trait]
impl MediaExtractor for InstagramExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("instagram.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "instagram").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Facebook
pub struct FacebookExtractor;
#[async_trait]
impl MediaExtractor for FacebookExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("facebook.com") || url.contains("fb.watch")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "facebook").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Twitter/X
pub struct TwitterExtractor;
#[async_trait]
impl MediaExtractor for TwitterExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("twitter.com") || url.contains("x.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "twitter").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// VK
pub struct VKExtractor;
#[async_trait]
impl MediaExtractor for VKExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("vk.com") || url.contains("vk.ru")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "vk").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Bilibili
pub struct BilibiliExtractor;
#[async_trait]
impl MediaExtractor for BilibiliExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("bilibili.com") || url.contains("b23.tv")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "bilibili").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Bluesky
pub struct BlueskyExtractor;
#[async_trait]
impl MediaExtractor for BlueskyExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("bsky.app") || url.contains("bsky.social")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "bluesky").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Dailymotion
pub struct DailymotionExtractor;
#[async_trait]
impl MediaExtractor for DailymotionExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("dailymotion.com") || url.contains("dai.ly")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "dailymotion").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Vimeo
pub struct VimeoExtractor;
#[async_trait]
impl MediaExtractor for VimeoExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("vimeo.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "vimeo").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Rutube
pub struct RutubeExtractor;
#[async_trait]
impl MediaExtractor for RutubeExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("rutube.ru")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "rutube").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Odnoklassniki
pub struct OdnoklassnikiExtractor;
#[async_trait]
impl MediaExtractor for OdnoklassnikiExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("ok.ru")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "odnoklassniki").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Pinterest
pub struct PinterestExtractor;
#[async_trait]
impl MediaExtractor for PinterestExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("pinterest.com") || url.contains("pin.it")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "pinterest").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Newgrounds
pub struct NewgroundsExtractor;
#[async_trait]
impl MediaExtractor for NewgroundsExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("newgrounds.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "newgrounds").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Reddit
pub struct RedditExtractor;
#[async_trait]
impl MediaExtractor for RedditExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("reddit.com") || url.contains("redd.it")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "reddit").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// SoundCloud
pub struct SoundCloudExtractor;
#[async_trait]
impl MediaExtractor for SoundCloudExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("soundcloud.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "soundcloud").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Streamable
pub struct StreamableExtractor;
#[async_trait]
impl MediaExtractor for StreamableExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("streamable.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "streamable").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Tumblr
pub struct TumblrExtractor;
#[async_trait]
impl MediaExtractor for TumblrExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("tumblr.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "tumblr").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Twitch
pub struct TwitchExtractor;
#[async_trait]
impl MediaExtractor for TwitchExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("twitch.tv") || url.contains("clips.twitch.tv")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "twitch").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Loom
pub struct LoomExtractor;
#[async_trait]
impl MediaExtractor for LoomExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("loom.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "loom").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}

// Snapchat
pub struct SnapchatExtractor;
#[async_trait]
impl MediaExtractor for SnapchatExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("snapchat.com")
    }
    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        extract_with_ytdlp(url, "snapchat").await
    }
    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}
