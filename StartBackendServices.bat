@echo off
echo ================================================
echo Wildlife Safari - Starting All Backend Services
echo ================================================
echo.

cd /d "%~dp0Backend"

echo Starting Authentication Service (Port 5001)...
start "Auth Service" cmd /k "cd WildlifeSafari.AuthService && dotnet run"
timeout /t 3 >nul

echo Starting Booking Service (Port 5002)...
start "Booking Service" cmd /k "cd WildlifeSafari.BookingService && dotnet run"
timeout /t 3 >nul

echo Starting Admin Service (Port 5003)...
start "Admin Service" cmd /k "cd WildlifeSafari.AdminService && dotnet run"
timeout /t 3 >nul

echo.
echo ================================================
echo All backend services are starting...
echo.
echo Auth Service:    http://localhost:5001/swagger
echo Booking Service: http://localhost:5002/swagger
echo Admin Service:   http://localhost:5003/swagger
echo ================================================
echo.
echo Press any key to exit...
pause >nul
