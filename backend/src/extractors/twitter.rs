use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct TwitterExtractor;

#[async_trait]
impl MediaExtractor for TwitterExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("twitter.com") || url.contains("x.com") || url.contains("t.co")
    }

    async fn extract_info(&self, _url: &str) -> Result<MediaInfo> {
        Ok(MediaInfo {
            platform: "twitter".to_string(),
            title: "Twitter Video".to_string(),
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
