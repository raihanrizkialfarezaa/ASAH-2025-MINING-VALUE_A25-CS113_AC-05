"""
Configuration module for AI/ML Service
Handles environment variables and service configuration
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directories
BASE_DIR = Path(__file__).resolve().parent
DATA_FOLDER = os.getenv('DATA_FOLDER', 'data')
MODEL_FOLDER = os.getenv('MODEL_FOLDER', 'models')
LOG_FOLDER = os.getenv('LOG_FOLDER', 'logs')

# Server Configuration
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8000))
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

# Ollama Configuration
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'qwen2.5:7b')

# Database Configuration
DATABASE_URL = os.getenv('DATABASE_URL', '')

# Backend API Configuration
BACKEND_API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:5000')

# Simulation Parameters
MAX_SIMULATION_TIME = int(os.getenv('MAX_SIMULATION_TIME', 480))
DEFAULT_SHIFT_DURATION = int(os.getenv('DEFAULT_SHIFT_DURATION', 8))

# Logging Configuration
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FILE = os.getenv('LOG_FILE', 'logs/ai_service.log')

# Model file paths
MODEL_FUEL_PATH = os.path.join(MODEL_FOLDER, 'model_fuel.joblib')
MODEL_LOAD_PATH = os.path.join(MODEL_FOLDER, 'model_load_weight.joblib')
MODEL_DELAY_PATH = os.path.join(MODEL_FOLDER, 'model_delay_probability.joblib')
NUMERICAL_COLS_PATH = os.path.join(MODEL_FOLDER, 'numerical_columns.json')
CATEGORICAL_COLS_PATH = os.path.join(MODEL_FOLDER, 'categorical_columns.json')

# Data file paths
TRUCKS_CSV = os.path.join(DATA_FOLDER, 'trucks.csv')
EXCAVATORS_CSV = os.path.join(DATA_FOLDER, 'excavators.csv')
OPERATORS_CSV = os.path.join(DATA_FOLDER, 'operators.csv')
ROAD_SEGMENTS_CSV = os.path.join(DATA_FOLDER, 'road_segments.csv')
SAILING_SCHEDULES_CSV = os.path.join(DATA_FOLDER, 'sailing_schedules.csv')
VESSELS_CSV = os.path.join(DATA_FOLDER, 'vessels.csv')
MAINTENANCE_LOGS_CSV = os.path.join(DATA_FOLDER, 'maintenance_logs.csv')

# Ensure directories exist
os.makedirs(DATA_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)
os.makedirs(LOG_FOLDER, exist_ok=True)

print(f"✅ Configuration loaded for environment: {ENVIRONMENT}")
