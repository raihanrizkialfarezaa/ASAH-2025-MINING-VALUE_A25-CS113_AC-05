@echo off
echo ========================================
echo STARTING ALL MINING OPERATIONS SERVICES
echo ========================================
echo.

echo [1/3] Starting Backend Express Server (Port 3000)...
start "Backend Express" cmd /k "cd /d "%~dp0backend-express" && npm start"
timeout /t 5 /nobreak > nul

echo [2/3] Starting Frontend React App (Port 3001)...
start "Frontend React" cmd /k "cd /d "%~dp0mining-ops-frontend" && npm start"
timeout /t 5 /nobreak > nul

echo [3/3] Starting AI Service Python (Port 8000)...
start "AI Service" cmd /k "cd /d "%~dp0mining-ops-ai-main" && .\venv\Scripts\activate && python api.py"
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo ALL SERVICES STARTED!
echo ========================================
echo.
echo Backend API:  http://localhost:3000
echo Frontend UI:  http://localhost:3001
echo AI Service:   http://localhost:8000
echo AI Docs:      http://localhost:8000/docs
echo.
echo Press any key to exit this window...
pause > nul
