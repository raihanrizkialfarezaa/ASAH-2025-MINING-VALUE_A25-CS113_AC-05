# 🚀 QUICK START GUIDE - Mining Operations AI

## ⚡ 3-Minute Setup

### Prerequisites Check

```powershell
# Verify installations
node --version      # Should be v18+ or v22+
python --version    # Should be 3.12.x
psql --version      # Should be PostgreSQL 14+
```

---

## 🎯 START ALL SERVICES (In Order)

### 1. Start Backend Express (Terminal 1)

```powershell
cd "b:\ASAH FEBE AI\ASAH 2025 MINING VALUE_A25-CS113_AC-05\backend-express"
npm run dev
```

**Expected Output**:

```
🚀 Server berjalan di http://localhost:3000
🔗 Database terhubung!
✅ Scheduled jobs initialized
```

**Check Health**: http://localhost:3000/api/ai/health

---

### 2. Start AI/ML Service (Terminal 2)

```powershell
cd "b:\ASAH FEBE AI\ASAH 2025 MINING VALUE_A25-CS113_AC-05\mining-ops-ai-main"
.\.venv\Scripts\activate
python main.py
```

**Expected Output**:

```
--- MEMUAT SISTEM (FINAL VERSION v3.0) ---
✅ Berhasil mengimpor 'otak' dari simulator.py
🚀 Memulai Server API...
INFO: Uvicorn running on http://127.0.0.1:8000
⚠️ OLLAMA TIDAK TERHUBUNG (normal - optional)
```

**Check Health**: http://localhost:8000/health  
**API Docs**: http://localhost:8000/docs

---

### 3. Start Frontend React (Terminal 3)

```powershell
cd "b:\ASAH FEBE AI\ASAH 2025 MINING VALUE_A25-CS113_AC-05\mining-ops-frontend"
npm start
```

**Expected Output**:

```
Compiled successfully!
You can now view mining-ops-frontend in the browser.
  Local:            http://localhost:3001
```

**Access**:

- Main App: http://localhost:3001
- AI Dashboard: http://localhost:3001/ai
- Integration Test: http://localhost:3001/test-ai

---

## ✅ VERIFICATION CHECKLIST

### Backend (Port 3000)

```powershell
# Health check
curl http://localhost:3000/api/ai/health

# Expected response:
# {"status":"healthy","aiServiceConnected":true,...}
```

### AI Service (Port 8000)

```powershell
# Health check
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","models_loaded":3,...}
```

### Frontend (Port 3001)

1. Open browser: http://localhost:3001/test-ai
2. Click "Run All Tests"
3. Verify: 4/4 tests passed ✅

---

## 🎮 USAGE EXAMPLES

### Get AI Recommendations

```powershell
# Using curl
curl -X POST http://localhost:8000/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "weather": "SUNNY",
    "shift": "PAGI",
    "target_production": 5000,
    "truck_available": 10,
    "excavator_available": 3
  }'
```

**Expected Response**:

```json
{
  "status": "success",
  "recommended_strategy": {
    "weather_strategy": "intensive_ops",
    "shift_optimization": "maximize_morning_production",
    "equipment_allocation": {...},
    "predicted_metrics": {
      "total_production": 5200,
      "fuel_consumption": 850,
      "delay_probability": 0.15
    }
  }
}
```

### Ask Chatbot

```javascript
// From frontend
const response = await aiService.askChatbot("What's the best strategy for rainy weather?", { weather: 'RAINY', shift: 'SIANG' });
```

**Expected Response**:

```json
{
  "answer": "For rainy weather, I recommend...",
  "confidence": 0.85,
  "context_used": {...}
}
```

---

## 🔧 COMMON ISSUES

### Issue: Port Already in Use

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /F /PID <PID>
```

### Issue: Database Not Connected

```powershell
# Check PostgreSQL running
pg_isready -h localhost -p 5432

# If not running, start service
net start postgresql-x64-14
```

### Issue: Virtual Environment Not Activated

```powershell
# Windows PowerShell
cd mining-ops-ai-main
.\.venv\Scripts\activate

# You should see (.venv) in terminal prompt
```

### Issue: Frontend Shows API Errors

1. Check backend running: http://localhost:3000/api/ai/health
2. Check CORS in browser DevTools → Network
3. Clear localStorage and refresh page
4. Check token expiry (re-login if needed)

---

## 📊 TESTING WORKFLOWS

### 1. Integration Test (Automated)

1. Navigate to: http://localhost:3001/test-ai
2. Click "Run All Tests"
3. Expand each test to see details
4. Verify 4/4 passed

### 2. Manual UI Test

1. Navigate to: http://localhost:3001/ai
2. Fill form:
   - Weather: SUNNY
   - Shift: PAGI
   - Production Target: 5000
   - Trucks: 10
   - Excavators: 3
3. Click "Get Recommendations"
4. View strategy cards
5. Test chatbot (bottom-right)
6. Save a recommendation
7. View history

### 3. API Test (Postman/curl)

```powershell
# 1. Health checks
curl http://localhost:3000/api/ai/health
curl http://localhost:8000/health

# 2. Get realtime conditions
curl http://localhost:8000/realtime-conditions

# 3. Get recommendations
curl -X POST http://localhost:8000/recommendations \
  -H "Content-Type: application/json" \
  -d '{"weather":"SUNNY","shift":"PAGI","target_production":5000}'

# 4. Ask chatbot
curl -X POST http://localhost:8000/chatbot \
  -H "Content-Type: application/json" \
  -d '{"question":"What is the best shift?","context":{}}'
```

---

## 🎓 KEY ENDPOINTS

### Backend Express (http://localhost:3000)

| Method | Endpoint                      | Description                   |
| ------ | ----------------------------- | ----------------------------- |
| GET    | `/api/ai/health`              | System health check           |
| GET    | `/api/ai/realtime-conditions` | Current operational data      |
| POST   | `/api/ai/recommendations`     | Get strategic recommendations |
| GET    | `/api/ai/recommendations/:id` | Get specific recommendation   |
| POST   | `/api/ai/chatbot`             | Ask AI chatbot                |
| GET    | `/api/ai/analytics`           | Performance analytics         |
| GET    | `/api/ai/predictions/history` | ML prediction logs            |
| GET    | `/api/ai/chatbot/history`     | Chat interaction logs         |
| POST   | `/api/ai/export`              | Export data to CSV            |

### AI Service (http://localhost:8000)

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| GET    | `/health`              | AI service health         |
| GET    | `/realtime-conditions` | Live mining metrics       |
| POST   | `/recommendations`     | Get ML-powered strategies |
| POST   | `/chatbot`             | Q&A with AI               |
| GET    | `/models/performance`  | ML model metrics          |
| GET    | `/docs`                | Swagger API documentation |

---

## 📈 PERFORMANCE EXPECTATIONS

### Response Times (Normal Operation)

- Health checks: < 100ms
- Realtime data: 500ms - 2s
- Recommendations: 3s - 8s (includes ML + simulation)
- Chatbot (fallback): < 200ms
- Chatbot (with Ollama): 2s - 5s

### Resource Usage

- Backend: ~50MB RAM, <5% CPU
- AI Service: ~300MB RAM, 10-30% CPU (during predictions)
- Frontend: ~150MB RAM (browser)
- PostgreSQL: ~200MB RAM

---

## 🔄 DAILY OPERATIONS

### Morning Startup

1. Start PostgreSQL (usually auto-starts)
2. Start Backend: `npm run dev`
3. Start AI Service: `python main.py`
4. Start Frontend: `npm start`
5. Verify health: http://localhost:3001/test-ai

### Shutdown

1. Ctrl+C in Frontend terminal
2. Ctrl+C in AI Service terminal
3. Ctrl+C in Backend terminal
4. (PostgreSQL keeps running)

### Data Sync

**Automatic**:

- Daily 02:00 - Full export (27 tables)
- Hourly - Incremental sync

**Manual**:

```powershell
cd backend-express
node scripts/export-db-to-csv.js
```

---

## 🎯 SUCCESS CRITERIA

System is working correctly if:

- ✅ Backend health returns 200 OK
- ✅ AI service health shows 3 models loaded
- ✅ Frontend loads without errors
- ✅ Integration test shows 4/4 passed
- ✅ Recommendations return in <10s
- ✅ Chatbot responds (with or without Ollama)
- ✅ No console errors in browser
- ✅ Database queries execute successfully

---

## 📞 QUICK REFERENCE

**Workspace Root**:

```
b:\ASAH FEBE AI\ASAH 2025 MINING VALUE_A25-CS113_AC-05\
```

**Service Ports**:

- Backend: 3000
- AI Service: 8000
- Frontend: 3001
- PostgreSQL: 5432
- Ollama (optional): 11434

**Important Files**:

- Backend: `backend-express/src/routes/ai.routes.js`
- AI Core: `mining-ops-ai-main/simulator.py`
- Frontend API: `mining-ops-frontend/src/services/aiService.js`
- Database: `backend-express/prisma/schema.prisma`

**Logs Location**:

- Backend: `backend-express/logs/`
- AI Service: Console output
- Frontend: Browser DevTools Console

---

## 🆘 EMERGENCY RESTART

If system is misbehaving, full restart:

```powershell
# 1. Stop all (Ctrl+C in each terminal)

# 2. Clear caches (if needed)
cd backend-express
rm -rf node_modules; npm install

cd ../mining-ops-ai-main
rm -rf .venv; python -m venv .venv
.\.venv\Scripts\activate; pip install -r requirements.txt

# 3. Restart database
net stop postgresql-x64-14
net start postgresql-x64-14

# 4. Re-run migrations
cd backend-express
npx prisma migrate deploy

# 5. Start services in order (Backend → AI → Frontend)
```

---

**Last Updated**: Auto-generated during deployment  
**Version**: 1.0.0  
**Status**: Production-Ready

For detailed documentation, see: `PROJECT_FINALIZATION_GUIDE.md`
