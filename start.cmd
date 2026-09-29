@echo off
title GigMate Launcher
cd /d "%~dp0"

:: Handle CLI arguments directly if provided (e.g. start.cmd 1 or start.cmd 2)
if "%~1"=="1" goto START_DOCKER
if "%~1"=="2" goto START_LOCAL
if "%~1"=="3" goto START_FRONTEND
if "%~1"=="4" goto START_BACKEND
if "%~1"=="5" goto STOP_DOCKER

echo ================================================================
echo                   GIGMATE - LAUNCHER
echo      Volunteer Management ^& Student Opportunity Platform
echo ================================================================
echo.
echo Choose how you would like to run the project:
echo.
echo   [1] Start with Docker Compose (MySQL + Spring Boot + React) (Default in 8s)
echo   [2] Start Locally (Spring Boot Backend + React Frontend in new windows)
echo   [3] Start Frontend Only (React Vite on port 3000)
echo   [4] Start Backend Only (Spring Boot on port 8080)
echo   [5] Stop Running Docker Containers (docker compose down)
echo.
echo ================================================================

choice /c 12345 /d 1 /t 8 /m "Enter your choice"
if errorlevel 5 goto STOP_DOCKER
if errorlevel 4 goto START_BACKEND
if errorlevel 3 goto START_FRONTEND
if errorlevel 2 goto START_LOCAL
if errorlevel 1 goto START_DOCKER

:START_DOCKER
cls
echo ================================================================
echo Launching GigMate via Docker Compose...
echo MySQL: 3306 ^| Backend: 8080 ^| Frontend: 3000
echo ================================================================
echo.
docker compose up -d --build
if errorlevel 1 (
    echo.
    echo [ERROR] Docker failed to start. Is Docker Desktop running?
    echo Try choosing Option 2 to run locally without Docker.
    echo.
    pause
    exit /b 1
)
echo.
echo Containers launched successfully!
echo Waiting a few seconds for services to initialize...
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo.
echo Press any key to view live container logs (Ctrl+C to exit logs):
pause >nul
docker compose logs -f
goto END

:START_LOCAL
cls
echo ================================================================
echo Starting Spring Boot Backend and React Frontend Locally...
echo ================================================================
echo.
echo 1. Launching Backend in a separate window (port 8080)...
start "GigMate Backend (Spring Boot :8080)" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"

echo 2. Launching Frontend in a separate window (port 3000)...
start "GigMate Frontend (Vite :3000)" cmd /k "cd /d "%~dp0gigmate-frontend" && npm.cmd run dev"

echo.
echo Both services are booting up! Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo.
echo Done! Keep the opened terminal windows running while using the app.
pause
goto END

:START_FRONTEND
cls
echo Starting Frontend (Vite)...
start "GigMate Frontend (Vite :3000)" cmd /k "cd /d "%~dp0gigmate-frontend" && npm.cmd run dev"
timeout /t 3 /nobreak >nul
start http://localhost:3000
goto END

:START_BACKEND
cls
echo Starting Backend (Spring Boot)...
start "GigMate Backend (Spring Boot :8080)" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"
goto END

:STOP_DOCKER
cls
echo Stopping Docker containers...
docker compose down
echo Docker containers stopped.
pause
goto END

:END
exit /b 0
