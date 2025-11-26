# AI/ML Service Startup Script for Windows PowerShell

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   MINING OPS AI/ML SERVICE - STARTUP SCRIPT" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
.\venv\Scripts\Activate.ps1

# Install/Update dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
pip install -r requirements.txt

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "Please update .env file with your configuration" -ForegroundColor Yellow
}

# Check if data files exist
Write-Host "Checking data files..." -ForegroundColor Green
if (-not (Test-Path "data\trucks.csv")) {
    Write-Host "⚠️  Warning: Data files not found!" -ForegroundColor Red
    Write-Host "   Please run 'npm run db:export' in backend-express folder first" -ForegroundColor Yellow
    Write-Host "   Then copy CSV files from exports/ to mining-ops-ai-main/data/" -ForegroundColor Yellow
}

# Check if models exist
Write-Host "Checking ML models..." -ForegroundColor Green
if (-not (Test-Path "models\model_fuel.joblib")) {
    Write-Host "⚠️  Warning: ML models not found!" -ForegroundColor Red
    Write-Host "   Running training script..." -ForegroundColor Yellow
    
    if (Test-Path "data\hauling_activities.csv") {
        python create_training_data.py
        python train_models.py
    } else {
        Write-Host "Cannot train models: hauling_activities.csv not found" -ForegroundColor Red
    }
}

# Check Ollama
Write-Host "Checking Ollama service..." -ForegroundColor Green
$ollamaInstalled = Get-Command ollama -ErrorAction SilentlyContinue

if (-not $ollamaInstalled) {
    Write-Host "⚠️  Ollama not installed!" -ForegroundColor Red
    Write-Host "   Download from: https://ollama.com/download" -ForegroundColor Yellow
} else {
    Write-Host "✅ Ollama installed" -ForegroundColor Green
    
    # Check if Ollama is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✅ Ollama server running" -ForegroundColor Green
        
        # Check if model is downloaded
        $models = ollama list
        if (-not ($models -match "qwen2.5:7b")) {
            Write-Host "Downloading qwen2.5:7b model..." -ForegroundColor Yellow
            ollama pull qwen2.5:7b
        } else {
            Write-Host "✅ Model qwen2.5:7b ready" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Ollama server not running!" -ForegroundColor Red
        Write-Host "   Start with: ollama serve" -ForegroundColor Yellow
        Write-Host "   Or run in separate terminal: Start-Process ollama serve" -ForegroundColor Yellow
    }
}

# Run setup checker
Write-Host "Running setup validation..." -ForegroundColor Green
python setup.py

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Starting AI/ML Service on http://localhost:8000" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start FastAPI server
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
