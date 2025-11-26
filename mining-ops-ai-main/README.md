# Mining Operations AI/ML Service

AI-powered decision support system untuk operasi tambang menggunakan hybrid simulation (SimPy + Machine Learning) dan Ollama LLM.

## 🚀 Quick Start

### Prerequisites

1. **Python 3.10+** installed
2. **Ollama** installed dan running ([Download](https://ollama.com/download))
3. **Data CSV** dari backend database

### Installation

#### Windows:

```powershell
.\start.ps1
```

#### Linux/Mac:

```bash
chmod +x start.sh
./start.sh
```

### Manual Setup

```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# 5. Pastikan Ollama running
ollama serve

# 6. Download model
ollama pull qwen2.5:7b

# 7. Export data dari backend
cd ../backend-express
npm run db:export
# Copy file CSV dari exports/ ke mining-ops-ai-main/data/

# 8. Train models (first time only)
python create_training_data.py
python train_models.py

# 9. Start service
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

## 📚 API Endpoints

Setelah service berjalan, akses dokumentasi interaktif:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints:

#### 1. Health Check

```
GET /
```

#### 2. Get Strategic Recommendations

```
POST /get_top_3_strategies
```

Request body:

```json
{
  "fixed_conditions": {
    "weatherCondition": "Cerah",
    "roadCondition": "GOOD",
    "shift": "SHIFT_1",
    "target_road_id": "cmhsbjn...",
    "target_excavator_id": "cmhsbjp...",
    "target_schedule_id": "cmhsbjs..."
  },
  "decision_variables": {
    "alokasi_truk": [5, 10, 15],
    "jumlah_excavator": [1, 2]
  },
  "financial_params": {
    "HargaJualBatuBara": 800000,
    "HargaSolar": 15000,
    "BiayaPenaltiKeterlambatanKapal": 100000000
  }
}
```

#### 3. Ask Chatbot

```
POST /ask_chatbot
```

Request body:

```json
{
  "pertanyaan_user": "Mengapa strategi 1 lebih baik?",
  "top_3_strategies_context": [...]
}
```

## 🔄 Re-training Models

Ketika ada data baru:

```bash
# 1. Export data terbaru dari backend
cd ../backend-express
npm run db:export

# 2. Copy CSV files ke data/
cp exports/*.csv ../mining-ops-ai-main/data/

# 3. Re-create training data
cd ../mining-ops-ai-main
python create_training_data.py

# 4. Re-train models
python train_models.py

# 5. Restart service
# Models akan otomatis ter-reload
```

## 📁 File Structure

```
mining-ops-ai-main/
├── api.py                      # FastAPI server (main entry point)
├── simulator.py                # Hybrid simulation engine
├── config.py                   # Configuration management
├── setup.py                    # Setup validation script
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
├── start.sh / start.ps1        # Startup scripts
│
├── data/                       # CSV data files
│   ├── trucks.csv
│   ├── excavators.csv
│   ├── operators.csv
│   ├── road_segments.csv
│   ├── sailing_schedules.csv
│   ├── vessels.csv
│   ├── maintenance_logs.csv
│   └── hauling_activities.csv
│
├── models/                     # Trained ML models
│   ├── model_fuel.joblib
│   ├── model_load_weight.joblib
│   ├── model_delay_probability.joblib
│   ├── numerical_columns.json
│   └── categorical_columns.json
│
├── logs/                       # Application logs
│   └── ai_service.log
│
└── monitoring/                 # Prometheus monitoring
    ├── prometheus.yml
    └── mining_exporter.py
```

## 🧠 How It Works

### 1. Hybrid Simulation

Sistem menggunakan **SimPy** (Discrete Event Simulation) untuk mensimulasikan operasi tambang secara realistis dengan antrian dinamis.

### 2. Machine Learning Predictions

3 model ML terpisah memprediksi:

- **Fuel Consumption** (RandomForestRegressor)
- **Load Weight** (RandomForestRegressor)
- **Delay Probability** (RandomForestClassifier)

### 3. Ollama LLM Chatbot

Model **qwen2.5:7b** (atau llama3:8b) menganalisis hasil simulasi dan menjawab pertanyaan dalam bahasa natural.

### 4. Strategic Recommendations

Sistem menjalankan multiple skenario dan memberikan Top 3 strategi terbaik berdasarkan:

- Profit bersih
- Efisiensi operasional
- Risiko keterlambatan
- Konsumsi bahan bakar

## 🔧 Troubleshooting

### Ollama tidak terhubung

```bash
# Check if Ollama is running
curl http://localhost:11434

# Start Ollama
ollama serve

# Verify model
ollama list
```

### Data files tidak ditemukan

```bash
# Export dari backend
cd ../backend-express
npm run db:export

# Copy ke AI service
cp exports/*.csv ../mining-ops-ai-main/data/
```

### Models tidak ter-load

```bash
# Re-train models
python create_training_data.py
python train_models.py
```

### Port 8000 sudah digunakan

```bash
# Gunakan port lain
uvicorn api:app --host 0.0.0.0 --port 8001 --reload

# Update .env
AI_SERVICE_PORT=8001
```

## 📊 Monitoring

Service menyediakan custom Prometheus exporter:

```bash
cd monitoring
python mining_exporter.py
```

Akses metrics di: http://localhost:9090

## 🔐 Security

- Service sebaiknya di-deploy di internal network
- Untuk production, tambahkan authentication layer
- Gunakan environment variables untuk sensitive data
- Jangan commit .env file

## 📝 License

Internal use only - Mining Operations Project

## 🤝 Support

Untuk bantuan atau pertanyaan, hubungi tim development.
