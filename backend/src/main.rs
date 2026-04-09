use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::ServeDir;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod extractors;
mod handlers;
mod services;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "media_downloader=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Setup temp directory for downloads
    let temp_dir = std::env::temp_dir().join("media-downloader");
    std::fs::create_dir_all(&temp_dir).expect("Failed to create temp directory");

    let app = Router::new()
        .route("/", get(root))
        .route("/api/health", get(handlers::health))
        .route("/api/extract", post(handlers::extract))
        .route("/api/download", post(handlers::download))
        .route("/api/formats", get(handlers::formats))
        .nest_service("/downloads", ServeDir::new(temp_dir))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("Starting server on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Media Downloader API v0.1.0"
}
