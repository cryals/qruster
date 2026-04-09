use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct FacebookExtractor;

#[async_trait]
impl MediaExtractor for FacebookExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("facebook.com") || url.contains("fb.watch")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        Ok(MediaInfo {
            platform: "facebook".to_string(),
            title: "Facebook Video".to_string(),
            duration: None,
            thumbnail: None,
            formats: vec![Format {
                format_id: "sd".to_string(),
                quality: "SD".to_string(),
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
