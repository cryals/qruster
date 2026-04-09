use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct BilibiliExtractor;

#[async_trait]
impl MediaExtractor for BilibiliExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("bilibili.com") || url.contains("b23.tv")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        Ok(MediaInfo {
            platform: "bilibili".to_string(),
            title: "Bilibili Video".to_string(),
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
