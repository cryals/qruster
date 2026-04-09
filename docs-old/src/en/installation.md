# Installation

## Prerequisites

### For Development

- **Rust** 1.75 or higher
  - Install from [rustup.rs](https://rustup.rs/)
  - Verify: `rustc --version`

- **Node.js** 20 or higher
  - Install from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **FFmpeg**
  - Linux: `sudo apt install ffmpeg` or `sudo yum install ffmpeg`
  - macOS: `brew install ffmpeg`
  - Windows: Download from [ffmpeg.org](https://ffmpeg.org/)
  - Verify: `ffmpeg -version`

- **yt-dlp**
  - Install: `pip install yt-dlp` or download binary
  - Verify: `yt-dlp --version`

### For Production

- **Docker** 24 or higher
  - Install from [docker.com](https://www.docker.com/)
  - Verify: `docker --version`

- **Docker Compose** v2
  - Usually included with Docker Desktop
  - Verify: `docker compose version`

## Installation Methods

### Method 1: Automated Setup (Recommended)

The easiest way to get started is using the automated setup script.

#### Linux / macOS

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
chmod +x scripts/setup.sh scripts/run.sh
./scripts/setup.sh
```

The script will:
1. Detect your operating system
2. Check for required dependencies
3. Offer to install missing dependencies
4. Ask you to choose between Development or Production mode
5. Configure the environment accordingly

#### Windows

```cmd
git clone https://github.com/cryals/qruster.git
cd qruster
scripts\setup.bat
```

### Method 2: Manual Development Setup

If you prefer manual installation:

```bash
# Clone repository
git clone https://github.com/cryals/qruster.git
cd qruster

# Install backend dependencies
cd backend
cargo build
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Method 3: Docker Production Setup

For production deployment with Docker:

```bash
# Clone repository
git clone https://github.com/cryals/qruster.git
cd qruster

# Configure domain (edit Caddyfile)
nano Caddyfile
# Replace localhost with your domain

# Create .env file
echo "DOMAIN=your-domain.com" > .env
echo "RUST_LOG=info" >> .env

# Start services
docker compose up -d
```

## Configuration

### Development Mode

Development mode runs services directly on your machine:

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- Hot reload enabled for both services
- Detailed logging

### Production Mode

Production mode uses Docker containers:

- All services behind Caddy reverse proxy
- Automatic SSL certificate via Let's Encrypt
- Optimized builds
- Minimal logging

### Environment Variables

Create a `.env` file in the project root:

```env
# Domain for production (optional for dev)
DOMAIN=media.example.com

# Logging level
RUST_LOG=info

# Download directory (optional)
DOWNLOAD_DIR=/tmp/media-downloader

# Maximum file size in bytes (optional, default 2GB)
MAX_FILE_SIZE=2147483648
```

## Verification

After installation, verify everything works:

### Development Mode

```bash
./scripts/run.sh
# Choose option 1 (Development)
```

Then open:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/health

### Production Mode

```bash
./scripts/run.sh
# Choose option 2 (Production)
```

Then open your configured domain in a browser.

## Troubleshooting

### Port Already in Use

If ports 3000 or 8080 are already in use:

```bash
# Find process using port
lsof -i :3000
lsof -i :8080

# Kill process
kill -9 <PID>
```

### FFmpeg Not Found

Make sure FFmpeg is in your PATH:

```bash
which ffmpeg
# Should output: /usr/bin/ffmpeg or similar
```

### yt-dlp Not Found

Install yt-dlp:

```bash
# Using pip
pip install yt-dlp

# Or download binary
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### Docker Permission Denied

Add your user to docker group:

```bash
sudo usermod -aG docker $USER
# Log out and log back in
```

### SSL Certificate Issues

If Caddy fails to obtain SSL certificate:

1. Ensure port 80 and 443 are open
2. Verify DNS points to your server
3. Check Caddy logs: `docker compose logs caddy`

## Updating

### Development

```bash
git pull
cd backend && cargo build
cd ../frontend && npm install
```

### Production

```bash
git pull
docker compose down
docker compose up -d --build
```

## Uninstallation

### Remove Application

```bash
# Stop services
./scripts/run.sh
# Choose option 3 (Stop services)

# Remove files
cd ..
rm -rf qruster
```

### Remove Docker Volumes

```bash
docker compose down -v
docker volume prune
```

## Next Steps

- Read [Usage Guide](usage.md) to learn how to use the application
- Check [API Reference](api.md) for API documentation
- See [Development Guide](development.md) for contributing
