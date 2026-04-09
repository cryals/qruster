@echo off
setlocal enabledelayedexpansion

echo ================================
echo Media Downloader Setup
echo ================================
echo.

echo Checking dependencies...

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Docker is not installed
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
) else (
    echo [OK] Docker is installed
)

where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    docker compose version >nul 2>nul
    if %errorlevel% neq 0 (
        echo [WARNING] docker-compose is not installed
        pause
        exit /b 1
    ) else (
        echo [OK] docker-compose is installed
    )
) else (
    echo [OK] docker-compose is installed
)

echo.
echo ================================
echo Select Mode
echo ================================
echo 1) Development (localhost, hot reload)
echo 2) Production (Docker, SSL)
echo.
set /p MODE_CHOICE="Enter choice [1-2]: "

if "%MODE_CHOICE%"=="1" (
    echo.
    echo ================================
    echo Development Mode Setup
    echo ================================
    echo.

    where cargo >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Rust is not installed
        echo Install from: https://rustup.rs/
        pause
        exit /b 1
    )

    where node >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Node.js is not installed
        echo Install from: https://nodejs.org/
        pause
        exit /b 1
    )

    echo Installing backend dependencies...
    cd backend
    cargo build
    cd ..

    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..

    echo.
    echo [SUCCESS] Development setup complete!
    echo Run 'scripts\run.bat' to start the development servers
    pause

) else if "%MODE_CHOICE%"=="2" (
    echo.
    echo ================================
    echo Production Mode Setup
    echo ================================
    echo.

    set /p DOMAIN="Enter your domain (e.g., media.example.com): "

    if "!DOMAIN!"=="" (
        echo [ERROR] Domain is required for production mode
        pause
        exit /b 1
    )

    echo Configuring Caddyfile for domain: !DOMAIN!

    (
        echo !DOMAIN! {
        echo     reverse_proxy /api/* backend:8080
        echo     reverse_proxy frontend:80
        echo }
    ) > Caddyfile

    echo Creating .env file...
    (
        echo DOMAIN=!DOMAIN!
        echo RUST_LOG=info
    ) > .env

    echo.
    echo [SUCCESS] Production setup complete!
    echo Run 'scripts\run.bat' to start the production containers
    pause

) else (
    echo [ERROR] Invalid choice
    pause
    exit /b 1
)

echo.
echo ================================
echo Setup Complete
echo ================================
echo [SUCCESS] Media Downloader is ready to use!
pause
