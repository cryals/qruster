use crate::extractors::{Format, MediaExtractor, MediaInfo};
use crate::services::ytdlp::YtDlpService;
use anyhow::Result;
use async_trait::async_trait;

pub struct StreamableExtractor;

#[async_trait]
impl MediaExtractor for StreamableExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("streamable.com")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        let ytdlp = YtDlpService::new();
        let info = ytdlp.extract_info(url).await?;

        let formats = info
            .formats
            .into_iter()
            .map(|f| {
                let quality = f.format_note.unwrap_or_else(|| f.format_id.clone());
                Format {
                    format_id: f.format_id,
                    quality,
                    ext: f.ext,
                    filesize: f.filesize,
                    url: None,
                }
            })
            .collect();

        Ok(MediaInfo {
            platform: "streamable".to_string(),
            title: info.title,
            duration: info.duration.map(|d| d as u64),
            thumbnail: info.thumbnail,
            formats,
        })
    }

    async fn get_download_url(&self, _url: &str, _format_id: &str) -> Result<String> {
        Ok("".to_string())
    }
}
