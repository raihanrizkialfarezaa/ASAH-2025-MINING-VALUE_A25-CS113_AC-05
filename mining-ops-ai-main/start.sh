#!/bin/bash
# AI/ML Service Startup Script

echo "=================================================="
echo "   MINING OPS AI/ML SERVICE - STARTUP SCRIPT"
echo "=================================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/Update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if data files exist
echo "Checking data files..."
if [ ! -f "data/trucks.csv" ]; then
    echo "⚠️  Warning: Data files not found!"
    echo "   Please run 'npm run db:export' in backend-express folder first"
    echo "   Then copy CSV files to data/ folder"
fi

# Check if models exist
echo "Checking ML models..."
if [ ! -f "models/model_fuel.joblib" ]; then
    echo "⚠️  Warning: ML models not found!"
    echo "   Running training script..."
    python create_training_data.py
    python train_models.py
fi

# Check Ollama
echo "Checking Ollama service..."
if ! command -v ollama &> /dev/null; then
    echo "⚠️  Ollama not installed!"
    echo "   Download from: https://ollama.com/download"
else
    echo "✅ Ollama installed"
    
    # Check if Ollama is running
    if ! curl -s http://localhost:11434 > /dev/null; then
        echo "⚠️  Ollama server not running!"
        echo "   Start with: ollama serve"
    else
        echo "✅ Ollama server running"
        
        # Check if model is downloaded
        if ! ollama list | grep -q "qwen2.5:7b"; then
            echo "Downloading qwen2.5:7b model..."
            ollama pull qwen2.5:7b
        fi
    fi
fi

# Run setup checker
echo "Running setup validation..."
python setup.py

echo ""
echo "=================================================="
echo "Starting AI/ML Service..."
echo "=================================================="

# Start FastAPI server
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
