---
sidebar_position: 3
---

# Installation

## Prerequisites

Before installing Media Downloader, ensure you have the following installed:

- **Docker** 20.10+ and **Docker Compose** 2.0+
- **Git** for cloning the repository
- **Domain name** (optional, for SSL in production)

### System Requirements

- **OS**: Linux, macOS, or Windows with WSL2
- **RAM**: Minimum 2GB, recommended 4GB+
- **Disk**: Minimum 10GB free space
- **CPU**: 2+ cores recommended

## Quick Start (Docker)

The easiest way to run Media Downloader is using Docker Compose.

### 1. Clone the Repository

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
```

### 2. Run Setup Script

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

The setup script will:
- Check for Docker and Docker Compose
- Create necessary directories
- Set up environment variables
- Build Docker images

### 3. Start Services

**Development mode:**
```bash
./run.sh dev
```

**Production mode:**
```bash
./run.sh prod
```

### 4. Access the Application

- **Development**: http://localhost:3000
- **Production**: https://yourdomain.com (after SSL setup)

## Manual Installation

If you prefer to run services manually without Docker:

### Backend (Rust)

**1. Install Rust:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**2. Install Dependencies:**
```bash
# Ubuntu/Debian
sudo apt install -y build-essential pkg-config libssl-dev ffmpeg yt-dlp

# macOS
brew install ffmpeg yt-dlp
```

**3. Build and Run:**
```bash
cd backend
cargo build --release
cargo run --release
```

Backend will start on `http://localhost:8080`

### Frontend (React)

**1. Install Node.js:**
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

**2. Install Dependencies:**
```bash
cd frontend
npm install
```

**3. Run Development Server:**
```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

**4. Build for Production:**
```bash
npm run build
npm run preview
```

## Docker Compose Configuration

### Development Mode

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    volumes:
      - ./backend:/app
      - downloads:/tmp/downloads
    environment:
      - RUST_LOG=debug

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
```

### Production Mode

```yaml
services:
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - RUST_LOG=info

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
```

## SSL Configuration (Production)

### Using Caddy (Automatic)

Edit `Caddyfile`:

```
yourdomain.com {
    reverse_proxy /api/* backend:8080
    reverse_proxy /* frontend:80
    
    tls your-email@example.com
}
```

Caddy will automatically obtain SSL certificates from Let's Encrypt.

### Using Let's Encrypt (Manual)

```bash
# Install certbot
sudo apt install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificates will be in:
# /etc/letsencrypt/live/yourdomain.com/
```

## Environment Variables

Create `.env` file in the root directory:

```bash
# Backend
RUST_LOG=info
MAX_FILE_SIZE=2147483648  # 2GB in bytes
DOWNLOAD_TIMEOUT=300      # 5 minutes
TEMP_DIR=/tmp/downloads

# Frontend
VITE_API_URL=http://localhost:8080

# Caddy
DOMAIN=yourdomain.com
EMAIL=your-email@example.com
```

## Port Configuration

Default ports:

- **Frontend**: 3000 (dev), 80 (prod)
- **Backend**: 8080
- **Caddy**: 80 (HTTP), 443 (HTTPS)

To change ports, edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8081:8080"  # Change 8081 to your desired port
```

## Troubleshooting

### Docker Issues

**Problem**: "Cannot connect to Docker daemon"
```bash
# Start Docker service
sudo systemctl start docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

**Problem**: "Port already in use"
```bash
# Find process using port
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>
```

### Build Issues

**Problem**: "Rust compilation failed"
```bash
# Update Rust
rustup update

# Clean build
cd backend
cargo clean
cargo build --release
```

**Problem**: "npm install failed"
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json
npm install
```

### Runtime Issues

**Problem**: "yt-dlp not found"
```bash
# Install yt-dlp
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

**Problem**: "FFmpeg not found"
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg
```

## Updating

### Docker Installation

```bash
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Manual Installation

```bash
git pull origin main

# Update backend
cd backend
cargo build --release

# Update frontend
cd ../frontend
npm install
npm run build
```

## Uninstallation

### Docker

```bash
# Stop and remove containers
docker-compose down

# Remove volumes
docker-compose down -v

# Remove images
docker rmi qruster-backend qruster-frontend
```

### Manual

```bash
# Stop services
pkill -f "cargo run"
pkill -f "npm run"

# Remove files
cd ..
rm -rf qruster
```

## Next Steps

- [Configure platforms](./platforms.md)
- [Read API documentation](./api.md)
- [Development guide](./development.md)
