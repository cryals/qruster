use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct SoundCloudExtractor;

#[async_trait]
impl MediaExtractor for SoundCloudExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("soundcloud.com")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        Ok(MediaInfo {
            platform: "soundcloud".to_string(),
            title: "SoundCloud Track".to_string(),
            duration: None,
            thumbnail: None,
            formats: vec![Format {
                format_id: "audio".to_string(),
                quality: "128kbps".to_string(),
                ext: "mp3".to_string(),
                filesize: None,
                url: None,
            }],
        })
    }

    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("https://example.com/download".to_string())
    }
}
