@echo off
echo ============================================
echo Starting Mining Operations AI System
echo ============================================
echo.

echo [1/3] Starting AI Service (FastAPI)...
cd /d "b:\ASAH FEBE AI\ASAH 2025 MINING VALUE_A25-CS113_AC-05\mining-ops-ai-main"
start "AI Service" cmd /k "python api.py"
timeout /t 5 /nobreak > nul

echo [2/3] Starting Backend Express Server...
cd /d "b:\ASAH FEBE AI\ASAH 2025 MINING VALUE_A25-CS113_AC-05\backend-express"
start "Backend Server" cmd /k "set NODE_ENV=development && node src/server.js"
timeout /t 3 /nobreak > nul

echo [3/3] Starting Frontend React App...
cd /d "b:\ASAH FEBE AI\ASAH 2025 MINING VALUE_A25-CS113_AC-05\mining-ops-frontend"
start "Frontend" cmd /k "npm start"

echo.
echo ============================================
echo All services are starting...
echo ============================================
echo AI Service: http://localhost:8000
echo Backend API: http://localhost:3000
echo Frontend UI: http://localhost:3001
echo ============================================
echo.
pause
