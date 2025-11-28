# Mining Operations AI System - Integration Complete

## Fitur AI yang Telah Diimplementasi

### 1. AI Strategic Recommendations (Machine Learning)

- ✅ Simulasi hybrid menggunakan SimPy + ML models
- ✅ Prediksi fuel consumption, load weight, dan delay probability
- ✅ Optimasi resource allocation (trucks & excavators)
- ✅ Real-time operational conditions monitoring
- ✅ Top 3 strategic recommendations dengan ranking

### 2. Chatbot Assistant (LLM Qwen)

- ✅ Ollama integration dengan model Qwen 2.5:7b
- ✅ Context-aware responses berdasarkan recommendations
- ✅ **Database query capability (READ-ONLY)**
  - Chatbot dapat otomatis membuat query SQL SELECT
  - Akses ke 15+ tabel operasional (trucks, excavators, hauling, production, dll)
  - Keamanan: HANYA SELECT queries, forbidden keywords (DROP, DELETE, UPDATE, INSERT, etc)
  - Format response: [SQL_QUERY]...[/SQL_QUERY]

### 3. UI Integration

- ✅ Route `/ai-recommendations` ditambahkan ke App.js
- ✅ Menu "AI Recommendations" di sidebar dengan icon Bot
- ✅ Parameter form dengan real-time data integration
- ✅ Recommendation cards dengan visualization
- ✅ Chatbot widget dengan suggested questions
- ✅ Real-time status dashboard

## Struktur Kode yang Ditambahkan/Dimodifikasi

### Backend (Express.js)

- `src/routes/ai.routes.js` - AI endpoints
- `src/controllers/ai.controller.js` - Request handlers
- `src/services/ai.service.js` - Business logic & ML proxy
- `scripts/check-ai-integration.js` - Database validation script

### AI Service (Python FastAPI)

- `api.py` - Enhanced dengan database query service
- `db_query_service.py` - **NEW: Safe database query execution**
- `simulator.py` - ML models & SimPy simulation
- `requirements.txt` - Added psycopg2-binary

### Frontend (React)

- `src/App.js` - Added AI route
- `src/components/layout/Layout.jsx` - Added AI menu item
- `src/pages/AI/AIRecommendations.jsx` - Main AI page
- `src/components/AI/ChatbotWidget.jsx` - Fixed response parsing
- `src/components/AI/ParameterForm.jsx` - Parameter input
- `src/components/AI/RecommendationCard.jsx` - Strategy display
- `src/components/AI/RealtimeStatus.jsx` - Real-time metrics

## Database Query Capability Details

### Allowed Operations

```sql
-- ✅ Allowed
SELECT * FROM trucks WHERE status = 'AVAILABLE'
SELECT COUNT(*) FROM hauling_activities WHERE shift = 'SHIFT_1'
SELECT * FROM weather_logs ORDER BY timestamp DESC LIMIT 1

-- ❌ Forbidden
DELETE FROM trucks
UPDATE production_records SET ...
INSERT INTO ...
DROP TABLE ...
```

### Accessible Tables

- trucks, excavators, operators
- hauling_activities, road_segments
- vessels, sailing_schedules
- weather_logs, production_records
- maintenance_logs, fuel_consumption
- incident_reports, chatbot_interactions
- prediction_logs, recommendation_logs

### How It Works

1. User bertanya ke chatbot (contoh: "berapa jumlah truk yang available?")
2. LLM Qwen menganalisis pertanyaan
3. Jika memerlukan data database, LLM generate SQL query
4. Query divalidasi (harus SELECT, tidak boleh ada forbidden keywords)
5. Execute query via psycopg2
6. Results ditambahkan ke response chatbot

## Cara Menjalankan

### Option 1: Manual

```bash
# Terminal 1 - AI Service
cd mining-ops-ai-main
python api.py

# Terminal 2 - Backend
cd backend-express
set NODE_ENV=development
node src/server.js

# Terminal 3 - Frontend
cd mining-ops-frontend
npm start
```

### Option 2: Batch Script

```bash
start-all-services.bat
```

## Testing

1. Login ke aplikasi
2. Klik menu "AI Recommendations" di sidebar
3. Isi parameter form (pilih road segment & excavator)
4. Klik "Get Recommendations"
5. Tunggu simulasi (~30-60 detik)
6. Lihat 3 strategi terbaik
7. Klik chatbot widget di kanan bawah
8. Tanya: "Berapa jumlah truk yang tersedia?" atau "Apa cuaca terkini?"
9. Chatbot akan otomatis query database dan menampilkan hasil

## Keamanan

- ✅ Read-only database access
- ✅ SQL injection protection via parameterized queries
- ✅ Whitelist of allowed tables
- ✅ Forbidden keyword filtering
- ✅ Authentication required untuk AI endpoints
- ✅ Error handling untuk query failures

## Data Flow

```
User Input (UI)
    ↓
Frontend (React)
    ↓
Backend API (Express)
    ↓
AI Service (FastAPI)
    ↓
├─→ ML Models (Predictions)
├─→ SimPy (Simulation)
└─→ Ollama (Chatbot)
     ↓
     Database Query (if needed)
     ↓
Response to User
```

## Environment Variables Required

```env
# Backend Express
DATABASE_URL=postgresql://...
AI_SERVICE_URL=http://localhost:8000

# AI Service
DATABASE_URL=postgresql://...
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

## Next Steps untuk Improvement

1. Query result caching untuk performa
2. Query complexity limits (LIMIT clause enforcement)
3. Rate limiting untuk chatbot queries
4. Audit logging untuk semua database queries
5. Query execution timeout
6. More sophisticated NLP untuk query generation
7. Multi-turn conversation support dengan session management
