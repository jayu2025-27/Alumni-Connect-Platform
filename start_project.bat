@echo off
setlocal
echo ===================================================
echo   Alumni Connect - Full Project Startup Script
echo ===================================================

echo.
echo [1/3] Checking environment configuration...
if not exist "backend\.env" (
    echo [ERROR] backend/.env file not found!
    echo Please create it and set your DB_PASSWORD.
    pause
    exit /b
)

echo.
echo [2/3] Starting Backend Server...
echo (A new window will open for the backend)
start "Backend Server" /D "backend" cmd /k "npm start"

echo.
echo [3/3] Starting Frontend Server...
echo (A new window will open for the frontend)
start "Frontend Server" /D "frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo   Project Started!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080
echo.
echo   NOTE: If backend fails, check the backend window
echo         for database login errors and update .env.
echo ===================================================
pause
