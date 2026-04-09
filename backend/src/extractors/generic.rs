use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct GenericExtractor;

#[async_trait]
impl MediaExtractor for GenericExtractor {
    fn detect(&self, url: &str) -> bool {
        url.starts_with("http://") || url.starts_with("https://")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        // Generic fallback using yt-dlp
        // TODO: Implement actual yt-dlp integration
        Ok(MediaInfo {
            platform: "generic".to_string(),
            title: "Generic Media".to_string(),
            duration: None,
            thumbnail: None,
            formats: vec![Format {
                format_id: "best".to_string(),
                quality: "best".to_string(),
                ext: "mp4".to_string(),
                filesize: None,
                url: None,
            }],
        })
    }

    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("https://example.com/download".to_string())
    }
}
