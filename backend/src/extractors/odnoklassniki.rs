use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct OdnoklassnikiExtractor;

#[async_trait]
impl MediaExtractor for OdnoklassnikiExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("ok.ru") || url.contains("odnoklassniki.ru")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        Ok(MediaInfo {
            platform: "odnoklassniki".to_string(),
            title: "OK Video".to_string(),
            duration: None,
            thumbnail: None,
            formats: vec![
                Format {
                    format_id: "360".to_string(),
                    quality: "360p".to_string(),
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
