use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct SnapchatExtractor;

#[async_trait]
impl MediaExtractor for SnapchatExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("snapchat.com")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        Ok(MediaInfo {
            platform: "snapchat".to_string(),
            title: "Snapchat Story".to_string(),
            duration: None,
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
