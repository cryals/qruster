use crate::extractors::{Format, MediaExtractor, MediaInfo};
use anyhow::Result;
use async_trait::async_trait;

pub struct TwitchExtractor;

#[async_trait]
impl MediaExtractor for TwitchExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("twitch.tv") || url.contains("clips.twitch.tv")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        Ok(MediaInfo {
            platform: "twitch".to_string(),
            title: "Twitch Clip".to_string(),
            duration: None,
            thumbnail: None,
            formats: vec![Format {
                format_id: "source".to_string(),
                quality: "Source".to_string(),
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
