use super::ErrorResponse;
use axum::{extract::Query, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct FormatsQuery {
    url: String,
}

#[derive(Serialize)]
pub struct FormatsResponse {
    video: Vec<String>,
    audio: Vec<String>,
    video_formats: Vec<String>,
}

pub async fn formats(Query(params): Query<FormatsQuery>) -> impl IntoResponse {
    if params.url.is_empty() {
        return ErrorResponse {
            error: "URL is required".to_string(),
        }
        .into_response();
    }

    // TODO: Get actual formats from extractor
    Json(FormatsResponse {
        video: vec![
            "144p".to_string(),
            "360p".to_string(),
            "720p".to_string(),
            "1080p".to_string(),
        ],
        audio: vec!["mp3".to_string(), "ogg".to_string(), "wav".to_string()],
        video_formats: vec!["mp4".to_string(), "mkv".to_string(), "webm".to_string()],
    })
    .into_response()
}
