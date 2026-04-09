use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct VimeoExtractor;

#[async_trait]
impl MediaExtractor for VimeoExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("vimeo.com")
    }

    async fn extract_info(&self, _url: &str) -> Result<MediaInfo> {
        Ok(MediaInfo {
            platform: "vimeo".to_string(),
            title: "Vimeo Video".to_string(),
            duration: None,
            thumbnail: None,
            formats: vec![
                Format {
                    format_id: "720".to_string(),
                    quality: "720p".to_string(),
                    ext: "mp4".to_string(),
                    filesize: None,
                    url: None,
                },
                Format {
                    format_id: "1080".to_string(),
                    quality: "1080p".to_string(),
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
