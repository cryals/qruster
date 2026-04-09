---
sidebar_position: 1
slug: /
---

# Welcome to Media Downloader

<div style={{textAlign: 'center', margin: '40px 0'}}>
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white" alt="Material-UI" />
</div>

**Universal selfhosted web service** for downloading audio and video content from **20+ popular platforms**. Built with privacy, simplicity, and complete control in mind.

## ✨ Key Features

### 🎵 Audio Downloads
- **Multiple formats**: MP3, OGG, WAV
- **High-quality extraction**: Best available audio quality
- **Automatic conversion**: FFmpeg-powered processing

### 🎬 Video Downloads
- **Quality options**: 144p to 4K
- **Format support**: MP4, MKV, WebM
- **Flexible options**: With or without audio

### 🌐 Platform Support
YouTube • TikTok • Instagram • Facebook • Twitter/X • VK • Bilibili • Bluesky • Vimeo • Dailymotion • Rutube • Twitch • SoundCloud • Reddit • Pinterest • and more...

**20+ platforms** supported out of the box!

### 🛡️ Privacy & Control
- **Selfhosted**: Your data stays on your server
- **No tracking**: No analytics, no third-party services
- **Open source**: Full transparency

### 🚀 Modern Stack
- **Material Design 3**: Beautiful, modern UI
- **Docker-ready**: One-command deployment
- **Automatic SSL**: Caddy with Let's Encrypt
- **Production-ready**: CI/CD included

## 🎯 Quick Start

Get up and running in minutes:

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
./scripts/setup.sh
./scripts/run.sh
```

Visit `http://localhost:3000` and start downloading!

## 📚 Documentation Structure

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '30px 0'}}>
  <div style={{padding: '20px', border: '2px solid var(--ifm-color-primary)', borderRadius: '12px'}}>
    <h3>🚀 Getting Started</h3>
    <p>Learn the basics and get your instance running</p>
    <a href="/concept">Concept & Ideas →</a>
  </div>
  <div style={{padding: '20px', border: '2px solid var(--ifm-color-primary)', borderRadius: '12px'}}>
    <h3>🏗️ Architecture</h3>
    <p>Understand how everything works under the hood</p>
    <a href="/architecture">System Design →</a>
  </div>
  <div style={{padding: '20px', border: '2px solid var(--ifm-color-primary)', borderRadius: '12px'}}>
    <h3>💻 Development</h3>
    <p>Contribute and extend the platform</p>
    <a href="/development">Dev Guide →</a>
  </div>
</div>

## 🌟 Why Media Downloader?

### Privacy First
All processing happens on your server. No data sent to third parties. Complete control over your downloads.

### Easy Deployment
One-command setup scripts. Docker containers for isolation. Automatic SSL certificates. Production-ready out of the box.

### Developer Friendly
Clean architecture. Comprehensive documentation. TypeScript and Rust type safety. Easy to extend with new platforms.

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

## 🤝 Contributing

Contributions are welcome! Check out our [Development Guide](/development) to get started.

## 📄 License

This project is open source. See the repository for license details.

---

<div style={{textAlign: 'center', marginTop: '40px', color: '#666'}}>
  Made with ❤️ by <a href="https://github.com/cryals">cryals</a>
</div>
