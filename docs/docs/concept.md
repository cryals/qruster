---
sidebar_position: 2
---

# Concept

## Purpose

This project exists to keep media downloading simple and self-hosted:

- paste a URL
- inspect what is available
- prepare a file
- download it from your own server

That is the core idea. The project does not try to be a huge media management suite.

## What Problem It Solves

Many public downloader sites are convenient, but they also mean:

- your URLs go through someone else’s infrastructure
- service availability is outside your control
- UI behavior changes without warning
- privacy and reliability are inconsistent

Media Downloader moves this flow into your own deployment.

## Current Product Shape

Right now the product is best understood as:

- a single-page web interface
- a Rust API that validates URLs and prepares media files
- a `yt-dlp`-backed extraction and download layer
- optional Docker + Caddy deployment

## Design Principles

### 1. Simple main flow

The current frontend is deliberately focused on one path:

1. paste URL
2. extract info
3. pick format
4. prepare file
5. download explicitly

### 2. Explicit download action

The UI no longer auto-opens prepared files. The project now prefers a clear dedicated download button because it is easier for users and avoids awkward browser behavior.

### 3. Thin backend, practical extractor model

The backend is intentionally straightforward:

- Axum routes
- extractor selection
- `yt-dlp` process execution
- temporary file exposure through `/downloads`

The goal is not theoretical purity. The goal is a service that works and can be maintained.

## Reality Check

Some things often assumed in downloader projects are not true here yet:

- no authentication system
- no real rate limiter in code today
- no background cleanup scheduler wired into startup
- no live progress websocket
- no playlist workflow in the current UI

Those can be future improvements, but they are not the current product contract.

## Where The Project Can Grow

Reasonable next steps from the current architecture:

- better backend error typing and HTTP status codes
- automatic cleanup scheduling
- direct preview support for downloadable media
- stronger extractor test coverage
- richer docs and operational guidance
