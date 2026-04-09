@echo off
setlocal enabledelayedexpansion

if exist .env (
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        set %%a=%%b
    )
)

echo ================================
echo Media Downloader
echo ================================
echo.
echo 1) Development mode (localhost)
echo 2) Production mode (Docker)
echo 3) Stop services
echo.
set /p RUN_CHOICE="Enter choice [1-3]: "

if "%RUN_CHOICE%"=="1" (
    echo.
    echo ================================
    echo Starting Development Mode
    echo ================================
    echo.

    echo Starting backend on http://localhost:8080
    start "Backend" cmd /c "cd backend && cargo run"

    timeout /t 2 /nobreak >nul

    echo Starting frontend on http://localhost:3000
    start "Frontend" cmd /c "cd frontend && npm run dev"

    echo.
    echo [SUCCESS] Development servers started!
    echo Backend: http://localhost:8080
    echo Frontend: http://localhost:3000
    echo.
    echo Press any key to stop servers...
    pause >nul

    taskkill /FI "WindowTitle eq Backend*" /F >nul 2>nul
    taskkill /FI "WindowTitle eq Frontend*" /F >nul 2>nul

) else if "%RUN_CHOICE%"=="2" (
    echo.
    echo ================================
    echo Starting Production Mode
    echo ================================
    echo.

    if not exist docker-compose.yml (
        echo [ERROR] docker-compose.yml not found
        pause
        exit /b 1
    )

    echo Building and starting containers...
    docker compose up -d --build

    echo Waiting for services to be ready...
    timeout /t 5 /nobreak >nul

    docker compose ps | findstr "Up" >nul
    if %errorlevel% equ 0 (
        echo.
        echo [SUCCESS] Services started successfully!

        if not "!DOMAIN!"=="" (
            echo Your site is available at: https://!DOMAIN!
        ) else (
            echo Your site is available at: http://localhost
        )

        echo.
        echo View logs: docker compose logs -f
        echo Stop services: docker compose down
    ) else (
        echo [ERROR] Failed to start services
        docker compose logs
        pause
        exit /b 1
    )

    pause

) else if "%RUN_CHOICE%"=="3" (
    echo.
    echo ================================
    echo Stopping Services
    echo ================================
    echo.

    docker compose down >nul 2>nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] Docker services stopped
    )

    taskkill /FI "WindowTitle eq Backend*" /F >nul 2>nul
    taskkill /FI "WindowTitle eq Frontend*" /F >nul 2>nul
    echo [SUCCESS] Development servers stopped

    pause

) else (
    echo [ERROR] Invalid choice
    pause
    exit /b 1
)
