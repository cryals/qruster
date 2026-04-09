use anyhow::Result;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};

pub mod bilibili;
pub mod bluesky;
pub mod dailymotion;
pub mod facebook;
pub mod generic;
pub mod instagram;
pub mod loom;
pub mod newgrounds;
pub mod odnoklassniki;
pub mod pinterest;
pub mod reddit;
pub mod rutube;
pub mod snapchat;
pub mod soundcloud;
pub mod streamable;
pub mod tiktok;
pub mod tumblr;
pub mod twitch;
pub mod twitter;
pub mod vimeo;
pub mod vk;
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
        Box::new(tiktok::TikTokExtractor),
        Box::new(instagram::InstagramExtractor),
        Box::new(facebook::FacebookExtractor),
        Box::new(twitter::TwitterExtractor),
        Box::new(vk::VKExtractor),
        Box::new(bilibili::BilibiliExtractor),
        Box::new(bluesky::BlueskyExtractor),
        Box::new(dailymotion::DailymotionExtractor),
        Box::new(vimeo::VimeoExtractor),
        Box::new(rutube::RutubeExtractor),
        Box::new(odnoklassniki::OdnoklassnikiExtractor),
        Box::new(pinterest::PinterestExtractor),
        Box::new(newgrounds::NewgroundsExtractor),
        Box::new(reddit::RedditExtractor),
        Box::new(soundcloud::SoundCloudExtractor),
        Box::new(streamable::StreamableExtractor),
        Box::new(tumblr::TumblrExtractor),
        Box::new(twitch::TwitchExtractor),
        Box::new(loom::LoomExtractor),
        Box::new(snapchat::SnapchatExtractor),
        Box::new(generic::GenericExtractor),
    ];

    for extractor in extractors {
        if extractor.detect(url) {
            return Some(extractor);
        }
    }

    None
}
