use axum::{response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use super::ErrorResponse;

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
        }.into_response();
    }

    // TODO: Implement actual download logic
    Json(DownloadResponse {
        download_url: "/downloads/placeholder.mp4".to_string(),
        expires_at: chrono::Utc::now().to_rfc3339(),
    }).into_response()
}
