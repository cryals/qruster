use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct TikTokExtractor;

#[async_trait]
impl MediaExtractor for TikTokExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("tiktok.com")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        // TODO: Implement TikTok API integration
        Ok(MediaInfo {
            platform: "tiktok".to_string(),
            title: "TikTok Video".to_string(),
            duration: Some(30),
            thumbnail: None,
            formats: vec![Format {
                format_id: "default".to_string(),
                quality: "720p".to_string(),
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
