@echo off
echo 🛑 Pausing Bualoi Relief Fund Project...
echo.

REM Stop development server
echo 📱 Stopping development server...
taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Development server stopped
) else (
    echo ℹ️  No development server running
)

REM Run pause script
node scripts/pause-project.js %*

pause
