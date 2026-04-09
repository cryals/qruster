use anyhow::Result;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::fs;
use uuid::Uuid;

use crate::services::ytdlp::YtDlpService;

pub struct Downloader {
    temp_dir: PathBuf,
    ytdlp: YtDlpService,
}

impl Downloader {
    pub fn new() -> Result<Self> {
        let temp_dir = std::env::temp_dir().join("media-downloader");
        std::fs::create_dir_all(&temp_dir)?;
        Ok(Self {
            temp_dir,
            ytdlp: YtDlpService::new(),
        })
    }

    pub async fn download(
        &self,
        url: &str,
        format_id: Option<&str>,
        audio_only: bool,
        audio_format: Option<&str>,
    ) -> Result<PathBuf> {
        let file_id = Uuid::new_v4();
        let extension = if audio_only {
            audio_format.unwrap_or("mp3")
        } else {
            "mp4"
        };

        let filename = format!("{}.{}", file_id, extension);
        let filepath = self.temp_dir.join(&filename);
        let output_template = filepath.to_str().unwrap();

        if audio_only {
            self.ytdlp
                .download_audio(url, output_template, audio_format.unwrap_or("mp3"))
                .await?;
        } else {
            self.ytdlp.download(url, format_id, output_template).await?;
        }

        Ok(filepath)
    }

    pub async fn cleanup_old_files(&self) -> Result<()> {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let mut entries = fs::read_dir(&self.temp_dir).await?;

        while let Some(entry) = entries.next_entry().await? {
            let metadata = entry.metadata().await?;
            if let Ok(modified) = metadata.modified() {
                let modified_secs = modified.duration_since(UNIX_EPOCH).unwrap().as_secs();

                // Delete files older than 1 hour
                if now - modified_secs > 3600 {
                    let _ = fs::remove_file(entry.path()).await;
                }
            }
        }

        Ok(())
    }

    pub fn get_temp_dir(&self) -> &PathBuf {
        &self.temp_dir
    }
}
