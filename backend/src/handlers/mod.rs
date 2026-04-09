use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};

mod extract;
mod download;
mod formats;

pub use extract::extract;
pub use download::download;
pub use formats::formats;

#[derive(Serialize)]
pub struct HealthResponse {
    status: String,
    version: String,
    uptime: u64,
}

pub async fn health() -> impl IntoResponse {
    Json(HealthResponse {
        status: "healthy".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        uptime: 0,
    })
}

#[derive(Serialize)]
pub struct ErrorResponse {
    error: String,
}

impl IntoResponse for ErrorResponse {
    fn into_response(self) -> axum::response::Response {
        (StatusCode::BAD_REQUEST, Json(self)).into_response()
    }
}
