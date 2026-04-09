use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct DailymotionExtractor;

#[async_trait]
impl MediaExtractor for DailymotionExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("dailymotion.com") || url.contains("dai.ly")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        Ok(MediaInfo {
            platform: "dailymotion".to_string(),
            title: "Dailymotion Video".to_string(),
            duration: None,
            thumbnail: None,
            formats: vec![
                Format {
                    format_id: "480".to_string(),
                    quality: "480p".to_string(),
                    ext: "mp4".to_string(),
                    filesize: None,
                    url: None,
                },
                Format {
                    format_id: "720".to_string(),
                    quality: "720p".to_string(),
                    ext: "mp4".to_string(),
                    filesize: None,
                    url: None,
                },
            ],
        })
    }

    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("https://example.com/download".to_string())
    }
}
