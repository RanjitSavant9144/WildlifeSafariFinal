@echo off
echo ================================================
echo Wildlife Safari - Complete Application Startup
echo ================================================
echo.

echo STEP 1: Starting Backend Services...
call "%~dp0StartBackendServices.bat"

echo.
echo STEP 2: Waiting for backend services to initialize...
timeout /t 10 >nul

echo.
echo STEP 3: Starting Frontend Application...
call "%~dp0StartFrontend.bat"

echo.
echo ================================================
echo Application is starting!
echo ================================================
echo.
echo Backend Services:
echo   - Auth Service:    http://localhost:5001/swagger
echo   - Booking Service: http://localhost:5002/swagger
echo   - Admin Service:   http://localhost:5003/swagger
echo.
echo Frontend Application:
echo   - React App:       http://localhost:3000
echo.
echo Admin Credentials:
echo   - Email:    admin@wildlifesafari.com
echo   - Password: Admin@123
echo ================================================
echo.
pause
