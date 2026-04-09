# Media Downloader

<div style="text-align: center; margin: 40px 0;">
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white" alt="Material-UI">
</div>

Universal selfhosted web service for downloading audio and video content from 20+ popular platforms. Built with privacy, simplicity, and complete control in mind.

## ✨ Features

**Audio Downloads**
- MP3, OGG, WAV formats
- High-quality audio extraction
- Automatic format conversion

**Video Downloads**
- Multiple quality options (144p to 4K)
- MP4, MKV, WebM formats
- Download with or without audio

**Platform Support**
- YouTube, TikTok, Instagram, Facebook
- Twitter/X, VK, Bilibili, Bluesky
- Vimeo, Dailymotion, Rutube, Twitch
- SoundCloud, Reddit, Pinterest, and more
- 20+ platforms total

**Technology**
- Modern Material Design 3 interface
- Selfhosted - your data stays private
- Docker-ready deployment
- Automatic SSL with Caddy
- Production-ready CI/CD

## 🚀 Quick Start

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
./scripts/setup.sh
./scripts/run.sh
```

Visit `http://localhost:3000` and start downloading!

## 📚 Documentation

Choose your language to get started:

<div style="display: flex; gap: 20px; margin: 30px 0;">
  <div style="flex: 1; padding: 20px; border: 2px solid #6750A4; border-radius: 12px;">
    <h3>🇬🇧 English</h3>
    <p>Complete documentation in English</p>
    <a href="en/concept.md" style="color: #6750A4; font-weight: 600;">Get Started →</a>
  </div>
  <div style="flex: 1; padding: 20px; border: 2px solid #6750A4; border-radius: 12px;">
    <h3>🇷🇺 Русский</h3>
    <p>Полная документация на русском</p>
    <a href="ru/concept.md" style="color: #6750A4; font-weight: 600;">Начать →</a>
  </div>
</div>

## 🛠️ Technology Stack

**Frontend**
- React 18 with TypeScript
- Material-UI v6 (Material Design 3)
- Vite for fast builds
- Axios for API communication

**Backend**
- Rust with Axum framework
- Tokio async runtime
- yt-dlp integration
- FFmpeg for media processing

**Infrastructure**
- Docker multi-stage builds
- Docker Compose orchestration
- Caddy reverse proxy with auto SSL
- GitHub Actions CI/CD

## 📖 Documentation Sections

**Getting Started**
- [Concept & Ideas](en/concept.md) - Project philosophy and design
- [Installation](en/installation.md) - Setup instructions
- [Usage Guide](en/usage.md) - How to use the application

**Technical**
- [Architecture](en/architecture.md) - System design and components
- [API Reference](en/api.md) - REST API documentation
- [Development](en/development.md) - Contributing guide

**Reference**
- [Supported Platforms](en/platforms.md) - Complete platform list

## 🌟 Why Media Downloader?

**Privacy First**
- All processing happens on your server
- No data sent to third parties
- Complete control over your downloads

**Easy Deployment**
- One-command setup scripts
- Docker containers for isolation
- Automatic SSL certificates
- Production-ready out of the box

**Developer Friendly**
- Clean architecture
- Comprehensive documentation
- TypeScript and Rust type safety
- Easy to extend with new platforms

## 📄 License

This project is open source. Check the repository for license details.

## 🤝 Contributing

Contributions are welcome! See the [Development Guide](en/development.md) for details on how to get started.

---

<div style="text-align: center; margin-top: 40px; color: #666;">
  Made with ❤️ by <a href="https://github.com/cryals">cryals</a>
</div>

