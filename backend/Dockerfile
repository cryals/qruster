# Multi-stage build for Rust backend
FROM rust:1.77-alpine AS builder

RUN apk add --no-cache musl-dev

WORKDIR /app

COPY Cargo.toml ./
COPY src ./src

RUN cargo build --release

# Final stage
FROM alpine:latest

RUN apk add --no-cache \
    ffmpeg \
    python3 \
    py3-pip \
    && pip3 install --no-cache-dir yt-dlp

WORKDIR /app

COPY --from=builder /app/target/release/media-downloader /app/media-downloader

RUN mkdir -p /tmp/media-downloader

EXPOSE 8080

CMD ["/app/media-downloader"]
