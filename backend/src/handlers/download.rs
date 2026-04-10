use super::ErrorResponse;
use crate::services::downloader::Downloader;
use axum::{response::IntoResponse, Json};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct DownloadRequest {
    url: String,
    format: String,
    audio_only: Option<bool>,
}

#[derive(Serialize)]
pub struct DownloadResponse {
    download_url: String,
    expires_at: String,
}

pub async fn download(Json(payload): Json<DownloadRequest>) -> impl IntoResponse {
    let url = payload.url.trim();

    if url.is_empty() {
        return ErrorResponse {
            error: "URL is required".to_string(),
        }
        .into_response();
    }

    if !url.starts_with("http://") && !url.starts_with("https://") {
        return ErrorResponse {
            error: "Invalid URL format".to_string(),
        }
        .into_response();
    }

    if payload.format.is_empty() {
        return ErrorResponse {
            error: "Format is required".to_string(),
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
    let format_id = if audio_only {
        None
    } else {
        Some(payload.format.as_str())
    };

    match downloader
        .download(url, format_id, audio_only, audio_format)
        .await
    {
        Ok(filepath) => {
            let filename = match filepath.file_name().and_then(|n| n.to_str()) {
                Some(name) => name,
                None => {
                    return ErrorResponse {
                        error: "Failed to get filename".to_string(),
                    }
                    .into_response()
                }
            };
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
