@echo off
echo 🚀 BIT Test Portal - Quick Start Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo ✅ npm is installed
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

echo 🎯 Starting development server...
echo The application will open at http://localhost:3000
echo.
echo 📝 Login credentials:
echo    Username: admin
echo    Password: admin123
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
