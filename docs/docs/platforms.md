---
sidebar_position: 6
---

# Supported Platforms

This list matches the extractors that are currently registered in `backend/src/extractors/mod.rs`.

## Extractor-Based Platforms

The backend currently has dedicated extractor modules for:

- YouTube
- TikTok
- Instagram
- Facebook
- Twitter/X
- VK
- Bilibili
- Bluesky
- Dailymotion
- Vimeo
- Rutube
- Odnoklassniki
- Pinterest
- Newgrounds
- Reddit
- SoundCloud
- Streamable
- Tumblr
- Twitch
- Loom
- Snapchat

There is also a generic fallback extractor for any HTTP or HTTPS URL that `yt-dlp` can handle.

## Important Clarification

“Supported” in this project means:

- there is a registered extractor for the platform, or
- the generic extractor can pass the URL to `yt-dlp`

It does **not** guarantee that every content type, privacy mode, region, or media variant works.

## Platform Notes

### YouTube

- dedicated extractor module
- multiple formats usually available
- audio extraction supported through audio mode

### Bilibili

- dedicated extractor module
- video downloads rely on selected `format_id`
- backend now passes the chosen format through the `yt-dlp` selector instead of ignoring it

### SoundCloud

- dedicated extractor module
- especially useful in audio mode

### Twitch

- dedicated extractor exists
- actual supported URL shapes depend on what the extractor accepts today

### Rutube and Streamable

- both have dedicated extractor modules
- both are listed in the frontend services popover
- custom inline icons are used in the current UI for better rendering

## Generic Fallback

If a URL does not match a specific extractor but still starts with `http://` or `https://`, the generic extractor may still try to process it through `yt-dlp`.

That means practical support can sometimes extend beyond the explicitly listed platforms, but this depends entirely on the current `yt-dlp` capabilities for that source.

## How To Add A New Platform

At code level, the steps are:

1. create a new extractor module in `backend/src/extractors/`
2. implement the `MediaExtractor` trait
3. register it in `backend/src/extractors/mod.rs`
4. add it to the frontend platform list if you want it visible in the UI popover
5. update the docs pages and issue templates if needed
