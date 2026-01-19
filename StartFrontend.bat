@echo off
echo ================================================
echo Wildlife Safari - Starting Frontend Application
echo ================================================
echo.

cd /d "%~dp0Frontend\wildlife-safari-app"

echo Installing dependencies (if needed)...
if not exist "node_modules\" (
    echo Running npm install...
    call npm install
)

echo.
echo Starting React application...
start "Wildlife Safari Frontend" cmd /k "npm start"

echo.
echo ================================================
echo Frontend is starting...
echo.
echo Application URL: http://localhost:3000
echo ================================================
echo.
echo Press any key to exit...
pause >nul
