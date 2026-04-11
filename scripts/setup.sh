#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

check_command() {
    if command -v "$1" &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_warning "$1 is not installed"
        return 1
    fi
}

install_docker_linux() {
    print_info "Installing Docker on Linux..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_success "Docker installed. Please log out and log back in for group changes to take effect."
}

install_docker_macos() {
    print_info "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    print_info "Press Enter after installation is complete..."
    read
}

print_header "Media Downloader Setup"

OS=$(detect_os)
print_info "Detected OS: $OS"

print_header "Checking Dependencies"

DOCKER_INSTALLED=false
DOCKER_COMPOSE_INSTALLED=false

if check_command docker; then
    DOCKER_INSTALLED=true
fi

if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_INSTALLED=true
    print_success "docker compose is installed"
elif command -v docker-compose &> /dev/null && docker-compose version &> /dev/null; then
    DOCKER_COMPOSE_INSTALLED=true
    print_success "docker-compose is installed"
else
    print_warning "Docker Compose is not installed"
fi

if [ "$DOCKER_INSTALLED" = false ]; then
    print_warning "Docker is not installed"
    read -p "Do you want to install Docker? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$OS" = "linux" ]; then
            install_docker_linux
        elif [ "$OS" = "macos" ]; then
            install_docker_macos
        fi
    else
        print_error "Docker is required. Exiting."
        exit 1
    fi
fi

print_header "Select Mode"
echo "1) Development (localhost, hot reload)"
echo "2) Production (Docker, SSL)"
read -p "Enter choice [1-2]: " MODE_CHOICE

if [ "$MODE_CHOICE" = "1" ]; then
    print_header "Development Mode Setup"

    print_info "Checking development dependencies..."

    if ! check_command cargo; then
        print_error "Rust is not installed. Install from: https://rustup.rs/"
        exit 1
    fi

    if ! check_command node; then
        print_error "Node.js is not installed. Install from: https://nodejs.org/"
        exit 1
    fi

    print_info "Installing backend dependencies..."
    cd backend
    cargo build
    cd ..

    print_info "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..

    print_success "Development setup complete!"
    print_info "Run './scripts/run.sh' to start the development servers"

elif [ "$MODE_CHOICE" = "2" ]; then
    print_header "Production Mode Setup"

    if [ "$DOCKER_COMPOSE_INSTALLED" = false ]; then
        print_error "Docker Compose is required for production mode"
        print_info "Install the Docker Compose plugin or the legacy docker-compose command, then rerun setup."
        exit 1
    fi

    read -p "Enter your domain (e.g., media.example.com): " DOMAIN

    if [ -z "$DOMAIN" ]; then
        print_error "Domain is required for production mode"
        exit 1
    fi

    print_info "Configuring Caddyfile for domain: $DOMAIN"

    cat > Caddyfile << EOF
$DOMAIN {
    reverse_proxy /api/* backend:8080
    reverse_proxy /downloads/* backend:8080
    reverse_proxy frontend:80
}
EOF

    print_info "Creating .env file..."
    cat > .env << EOF
DOMAIN=$DOMAIN
RUST_LOG=info
EOF

    print_success "Production setup complete!"
    print_info "Run './scripts/run.sh' to start the production containers"

else
    print_error "Invalid choice"
    exit 1
fi

print_header "Setup Complete"
print_success "Media Downloader is ready to use!"
