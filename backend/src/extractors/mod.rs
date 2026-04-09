use anyhow::Result;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};

pub mod generic;
pub mod youtube;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaInfo {
    pub platform: String,
    pub title: String,
    pub duration: Option<u64>,
    pub thumbnail: Option<String>,
    pub formats: Vec<Format>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Format {
    pub format_id: String,
    pub quality: String,
    pub ext: String,
    pub filesize: Option<u64>,
    pub url: Option<String>,
}

#[async_trait]
pub trait MediaExtractor: Send + Sync {
    fn detect(&self, url: &str) -> bool;
    async fn extract_info(&self, url: &str) -> Result<MediaInfo>;
    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String>;
}

pub fn detect_platform(url: &str) -> Option<Box<dyn MediaExtractor>> {
    let extractors: Vec<Box<dyn MediaExtractor>> = vec![
        Box::new(youtube::YouTubeExtractor),
        Box::new(generic::GenericExtractor),
    ];

    for extractor in extractors {
        if extractor.detect(url) {
            return Some(extractor);
        }
    }

    None
}
