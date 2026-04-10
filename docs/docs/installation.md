---
sidebar_position: 3
---

# Installation

## Requirements

### Development

- Rust stable
- Node.js 20+
- `ffmpeg`
- `yt-dlp`

### Production

- Docker 24+
- Docker Compose v2

## Repository Setup

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
```

## Guided Setup

Use the interactive setup script from the project root:

```bash
./scripts/setup.sh
```

Options:

- `1` Development: checks Rust and Node.js, builds the backend, installs frontend dependencies
- `2` Production: asks for a domain and prepares Caddy plus `.env`

## Run The Project

After setup:

```bash
./scripts/run.sh
```

Runtime options:

- `1` Development mode
- `2` Production mode with Docker Compose
- `3` Stop services

## Development Mode

When you choose development mode:

- backend runs on `http://localhost:8080`
- frontend runs on `http://localhost:3000`

You can also run the services manually.

### Backend

```bash
cd backend
cargo run
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

## Production Mode

The Docker stack is defined in [`docker-compose.yml`](../../docker-compose.yml).

Default services:

- `backend` on port `8080`
- `frontend` on port `3000`
- `caddy` on ports `80` and `443`

To build and start it manually:

```bash
docker compose up -d --build
```

To stop:

```bash
docker compose down
```

## Notes

- Downloads are written under `./downloads` in Docker mode
- Temporary prepared files are served by the backend and expire after a limited time
- Production setup expects a valid domain if you want HTTPS through Caddy
