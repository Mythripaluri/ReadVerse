@echo off
echo.
echo ================================
echo  Novel Narrate Nest - Quick Start
echo ================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ================================
echo  Servers Starting...
echo ================================
echo.
echo Backend:  http://localhost:5002
echo Frontend: http://localhost:8080
echo.
echo Press any key to close this window...
pause >nul