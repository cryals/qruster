use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::process::Command;
use tokio::process::Command as TokioCommand;

#[derive(Debug, Serialize, Deserialize)]
pub struct YtDlpInfo {
    pub title: String,
    pub duration: Option<f64>,
    pub thumbnail: Option<String>,
    pub formats: Vec<YtDlpFormat>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct YtDlpFormat {
    pub format_id: String,
    pub ext: String,
    pub format_note: Option<String>,
    pub filesize: Option<u64>,
    pub vcodec: Option<String>,
    pub acodec: Option<String>,
}

pub struct YtDlpService;

impl YtDlpService {
    pub fn new() -> Self {
        Self
    }

    pub async fn extract_info(&self, url: &str) -> Result<YtDlpInfo> {
        if url.is_empty() {
            anyhow::bail!("URL cannot be empty");
        }

        let output = TokioCommand::new("yt-dlp")
            .args(["--dump-json", "--no-playlist", "--skip-download", url])
            .output()
            .await
            .context("Failed to execute yt-dlp. Make sure yt-dlp is installed.")?;

        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            anyhow::bail!("Failed to extract media info: {}", error.trim());
        }

        let json_str =
            String::from_utf8(output.stdout).context("yt-dlp output is not valid UTF-8")?;

        if json_str.trim().is_empty() {
            anyhow::bail!("yt-dlp returned empty output");
        }

        let info: serde_json::Value =
            serde_json::from_str(&json_str).context("Failed to parse yt-dlp JSON output")?;

        let formats = self.parse_formats(&info);
        if formats.is_empty() {
            anyhow::bail!("No formats available for this media");
        }

        Ok(YtDlpInfo {
            title: info["title"].as_str().unwrap_or("Unknown").to_string(),
            duration: info["duration"].as_f64(),
            thumbnail: info["thumbnail"].as_str().map(|s| s.to_string()),
            formats,
        })
    }

    fn parse_formats(&self, info: &serde_json::Value) -> Vec<YtDlpFormat> {
        let formats = info["formats"].as_array();
        if formats.is_none() {
            return vec![];
        }

        formats
            .unwrap()
            .iter()
            .filter_map(|f| {
                Some(YtDlpFormat {
                    format_id: f["format_id"].as_str()?.to_string(),
                    ext: f["ext"].as_str()?.to_string(),
                    format_note: f["format_note"].as_str().map(|s| s.to_string()),
                    filesize: f["filesize"].as_u64(),
                    vcodec: f["vcodec"].as_str().map(|s| s.to_string()),
                    acodec: f["acodec"].as_str().map(|s| s.to_string()),
                })
            })
            .collect()
    }

    pub async fn download(
        &self,
        url: &str,
        format_id: Option<&str>,
        output_path: &str,
    ) -> Result<String> {
        if url.is_empty() {
            anyhow::bail!("URL cannot be empty");
        }

        if output_path.is_empty() {
            anyhow::bail!("Output path cannot be empty");
        }

        let mut args = vec!["-o".to_string(), output_path.to_string()];

        if let Some(fmt) = format_id {
            if !fmt.is_empty() {
                args.push("-f".to_string());
                args.push(format!("{fmt}+bestaudio/{fmt}/best"));
            } else {
                args.push("-f".to_string());
                args.push("bv*+ba/b".to_string());
            }
        } else {
            args.push("-f".to_string());
            args.push("bv*+ba/b".to_string());
        }

        args.push(url.to_string());

        let output = TokioCommand::new("yt-dlp")
            .args(&args)
            .output()
            .await
            .context("Failed to execute yt-dlp download")?;

        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            anyhow::bail!("Download failed: {}", error.trim());
        }

        Ok(output_path.to_string())
    }

    pub async fn download_audio(
        &self,
        url: &str,
        output_path: &str,
        format: &str,
    ) -> Result<String> {
        if url.is_empty() {
            anyhow::bail!("URL cannot be empty");
        }

        if output_path.is_empty() {
            anyhow::bail!("Output path cannot be empty");
        }

        if format.is_empty() {
            anyhow::bail!("Audio format cannot be empty");
        }

        let valid_formats = ["mp3", "ogg", "wav", "m4a", "opus", "flac", "aac"];
        if !valid_formats.contains(&format) {
            anyhow::bail!(
                "Invalid audio format: {}. Supported formats: mp3, ogg, wav, m4a, opus, flac, aac",
                format
            );
        }

        let output = TokioCommand::new("yt-dlp")
            .args(["-x", "--audio-format", format, "-o", output_path, url])
            .output()
            .await
            .context("Failed to execute yt-dlp audio download")?;

        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            anyhow::bail!("Audio download failed: {}", error.trim());
        }

        Ok(output_path.to_string())
    }

    #[allow(dead_code)]
    pub fn check_available() -> bool {
        Command::new("yt-dlp")
            .arg("--version")
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
    }
}
