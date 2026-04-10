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
        if url.is_empty() {
            anyhow::bail!("URL cannot be empty");
        }

        let file_id = Uuid::new_v4();
        let extension = if audio_only {
            let fmt = audio_format.unwrap_or("mp3");
            let valid_formats = ["mp3", "ogg", "wav", "m4a", "opus", "flac", "aac"];
            if !valid_formats.contains(&fmt) {
                anyhow::bail!("Invalid audio format: {}", fmt);
            }
            fmt
        } else {
            "mp4"
        };

        let filename = format!("{}.{}", file_id, extension);
        let filepath = self.temp_dir.join(&filename);
        let output_template = filepath.to_str()
            .ok_or_else(|| anyhow::anyhow!("Invalid output path"))?;

        if audio_only {
            self.ytdlp
                .download_audio(url, output_template, audio_format.unwrap_or("mp3"))
                .await?;
        } else {
            self.ytdlp.download(url, format_id, output_template).await?;
        }

        // Verify file was created
        if !filepath.exists() {
            anyhow::bail!("Download completed but file was not created");
        }

        Ok(filepath)
    }

    #[allow(dead_code)]
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

    #[allow(dead_code)]
    pub fn get_temp_dir(&self) -> &PathBuf {
        &self.temp_dir
    }
}
