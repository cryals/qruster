#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

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

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

compose() {
    if docker compose version &> /dev/null; then
        docker compose "$@"
    elif command -v docker-compose &> /dev/null && docker-compose version &> /dev/null; then
        docker-compose "$@"
    else
        print_error "Docker Compose is not installed"
        print_info "Install the Docker Compose plugin or the legacy docker-compose command."
        exit 1
    fi
}

if [ -f .env ]; then
    source .env
fi

print_header "Media Downloader"

echo "1) Development mode (localhost)"
echo "2) Production mode (Docker)"
echo "3) Stop services"
read -p "Enter choice [1-3]: " RUN_CHOICE

if [ "$RUN_CHOICE" = "1" ]; then
    print_header "Starting Development Mode"

    print_info "Starting backend on http://localhost:8080"
    cd backend
    cargo run &
    BACKEND_PID=$!
    cd ..

    sleep 2

    print_info "Starting frontend on http://localhost:3000"
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..

    print_success "Development servers started!"
    print_info "Backend: http://localhost:8080"
    print_info "Frontend: http://localhost:3000"
    print_info "Press Ctrl+C to stop"

    trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
    wait

elif [ "$RUN_CHOICE" = "2" ]; then
    print_header "Starting Production Mode"

    if [ ! -f docker-compose.yml ]; then
        print_error "docker-compose.yml not found"
        exit 1
    fi

    print_info "Building and starting containers..."
    compose up -d --build

    print_info "Waiting for services to be ready..."
    sleep 5

    if compose ps | grep -q "Up"; then
        print_success "Services started successfully!"

        if [ ! -z "$DOMAIN" ]; then
            print_info "Your site is available at: https://$DOMAIN"
        else
            print_info "Your site is available at: http://localhost"
        fi

        print_info "View logs: docker compose logs -f"
        print_info "Stop services: docker compose down"
    else
        print_error "Failed to start services"
        compose logs
        exit 1
    fi

elif [ "$RUN_CHOICE" = "3" ]; then
    print_header "Stopping Services"

    if compose ps &> /dev/null; then
        compose down
        print_success "Docker services stopped"
    fi

    pkill -f "cargo run" || true
    pkill -f "vite" || true
    print_success "Development servers stopped"

else
    print_error "Invalid choice"
    exit 1
fi
