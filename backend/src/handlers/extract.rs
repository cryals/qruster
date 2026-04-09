use super::ErrorResponse;
use crate::extractors::{detect_platform, MediaInfo};
use axum::{response::IntoResponse, Json};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct ExtractRequest {
    url: String,
}

#[derive(Serialize)]
pub struct ExtractResponse {
    platform: String,
    title: String,
    duration: Option<u64>,
    thumbnail: Option<String>,
    formats: Vec<FormatInfo>,
}

#[derive(Serialize)]
pub struct FormatInfo {
    format_id: String,
    quality: String,
    ext: String,
    filesize: Option<u64>,
}

pub async fn extract(Json(payload): Json<ExtractRequest>) -> impl IntoResponse {
    let url = &payload.url;

    if url.is_empty() {
        return ErrorResponse {
            error: "URL is required".to_string(),
        }
        .into_response();
    }

    match detect_platform(url) {
        Some(platform) => match platform.extract_info(url).await {
            Ok(info) => {
                let response = ExtractResponse {
                    platform: info.platform,
                    title: info.title,
                    duration: info.duration,
                    thumbnail: info.thumbnail,
                    formats: info
                        .formats
                        .into_iter()
                        .map(|f| FormatInfo {
                            format_id: f.format_id,
                            quality: f.quality,
                            ext: f.ext,
                            filesize: f.filesize,
                        })
                        .collect(),
                };
                Json(response).into_response()
            }
            Err(e) => ErrorResponse {
                error: format!("Failed to extract info: {}", e),
            }
            .into_response(),
        },
        None => ErrorResponse {
            error: "Unsupported platform".to_string(),
        }
        .into_response(),
    }
}
