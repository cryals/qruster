use super::ErrorResponse;
use crate::services::downloader::Downloader;
use axum::{response::IntoResponse, Json};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct DownloadRequest {
    url: String,
    format: String,
    quality: Option<String>,
    audio_only: Option<bool>,
}

#[derive(Serialize)]
pub struct DownloadResponse {
    download_url: String,
    expires_at: String,
}

pub async fn download(Json(payload): Json<DownloadRequest>) -> impl IntoResponse {
    if payload.url.is_empty() {
        return ErrorResponse {
            error: "URL is required".to_string(),
        }
        .into_response();
    }

    let downloader = match Downloader::new() {
        Ok(d) => d,
        Err(e) => {
            return ErrorResponse {
                error: format!("Failed to initialize downloader: {}", e),
            }
            .into_response()
        }
    };

    let audio_only = payload.audio_only.unwrap_or(false);
    let audio_format = if audio_only {
        Some(payload.format.as_str())
    } else {
        None
    };

    match downloader
        .download(
            &payload.url,
            payload.quality.as_deref(),
            audio_only,
            audio_format,
        )
        .await
    {
        Ok(filepath) => {
            let filename = filepath.file_name().unwrap().to_str().unwrap();
            let download_url = format!("/downloads/{}", filename);

            Json(DownloadResponse {
                download_url,
                expires_at: chrono::Utc::now()
                    .checked_add_signed(chrono::Duration::minutes(30))
                    .unwrap()
                    .to_rfc3339(),
            })
            .into_response()
        }
        Err(e) => ErrorResponse {
            error: format!("Download failed: {}", e),
        }
        .into_response(),
    }
}
