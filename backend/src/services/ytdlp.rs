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
        let output = TokioCommand::new("yt-dlp")
            .args(["--dump-json", "--no-playlist", "--skip-download", url])
            .output()
            .await
            .context("Failed to execute yt-dlp")?;

        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            anyhow::bail!("yt-dlp failed: {}", error);
        }

        let json_str = String::from_utf8_lossy(&output.stdout);
        let info: serde_json::Value =
            serde_json::from_str(&json_str).context("Failed to parse yt-dlp output")?;

        Ok(YtDlpInfo {
            title: info["title"].as_str().unwrap_or("Unknown").to_string(),
            duration: info["duration"].as_f64(),
            thumbnail: info["thumbnail"].as_str().map(|s| s.to_string()),
            formats: self.parse_formats(&info),
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
        let mut args = vec!["-o", output_path];

        if let Some(fmt) = format_id {
            args.push("-f");
            args.push(fmt);
        } else {
            args.push("-f");
            args.push("best");
        }

        args.push(url);

        let output = TokioCommand::new("yt-dlp")
            .args(&args)
            .output()
            .await
            .context("Failed to execute yt-dlp download")?;

        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            anyhow::bail!("yt-dlp download failed: {}", error);
        }

        Ok(output_path.to_string())
    }

    pub async fn download_audio(
        &self,
        url: &str,
        output_path: &str,
        format: &str,
    ) -> Result<String> {
        let output = TokioCommand::new("yt-dlp")
            .args(["-x", "--audio-format", format, "-o", output_path, url])
            .output()
            .await
            .context("Failed to execute yt-dlp audio download")?;

        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            anyhow::bail!("yt-dlp audio download failed: {}", error);
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
