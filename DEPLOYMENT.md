# Mining Operations AI-Integrated System - Deployment Guide

Comprehensive guide untuk deployment sistem Mining Operations dengan integrasi AI/ML.

## 📋 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│                    Port: 3000                                │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Backend Express API                             │
│              Port: 5000                                      │
│              - Authentication                                │
│              - Database Operations                           │
│              - AI Service Orchestration                      │
└────────┬───────────────────────────┬────────────────────────┘
         │                           │
┌────────▼─────────┐       ┌────────▼──────────┐
│   PostgreSQL     │       │  AI/ML Service    │
│   Port: 5432     │       │  FastAPI:8000     │
└──────────────────┘       └────────┬──────────┘
                                    │
                          ┌─────────▼──────────┐
                          │  Ollama LLM        │
                          │  Port: 11434       │
                          └────────────────────┘
```

## 🚀 Quick Start (Development)

### Prerequisites

1. **Node.js** 18+ installed
2. **Python** 3.10+ installed
3. **PostgreSQL** 15+ installed
4. **Ollama** installed ([Download](https://ollama.com/download))

### Step 1: Database Setup

```powershell
# Create database
createdb mining_dss

# Update .env in backend-express
# Copy .env.example to .env and update DATABASE_URL
```

### Step 2: Backend Express

```powershell
cd backend-express

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start server
npm run dev
```

Server akan berjalan di `http://localhost:5000`

### Step 3: AI/ML Service

```powershell
cd mining-ops-ai-main

# Start Ollama (di terminal terpisah)
ollama serve

# Pull model
ollama pull qwen2.5:7b

# Run startup script
.\start.ps1
# Atau manual:
# python -m venv venv
# .\venv\Scripts\activate
# pip install -r requirements.txt
# uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

AI Service akan berjalan di `http://localhost:8000`

### Step 4: Frontend

```powershell
cd mining-ops-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🐳 Docker Deployment (Production)

### Prerequisites

- Docker installed
- Docker Compose installed

### Deployment Steps

```powershell
# 1. Clone repository
git clone <repository-url>
cd ASAH-2025-MINING-VALUE

# 2. Configure environment
# Create .env file di root directory
cp .env.example .env
# Edit .env sesuai kebutuhan

# 3. Build and start all services
docker-compose up -d --build

# 4. Wait for services to be healthy
docker-compose ps

# 5. Initialize database
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# 6. Pull Ollama model
docker exec -it mining-ollama ollama pull qwen2.5:7b

# 7. Export initial data for AI
docker-compose exec backend npm run db:export
```

### Service URLs (Docker)

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin123)

### Docker Commands

```powershell
# View logs
docker-compose logs -f backend
docker-compose logs -f ai-service

# Restart service
docker-compose restart backend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Update and restart
docker-compose up -d --build --no-deps backend
```

## 📦 Data Sync Process

### Manual Data Export

```powershell
# Export dari PostgreSQL ke CSV
cd backend-express
npm run db:export

# Copy ke AI service
xcopy /Y exports\*.csv ..\mining-ops-ai-main\data\
```

### Automatic Sync (Production)

Backend automatically syncs data ke AI service setiap hari jam 02:00 melalui scheduled job.

### Re-train ML Models

```powershell
cd mining-ops-ai-main

# 1. Pastikan data terbaru tersedia
ls data/*.csv

# 2. Create training data
python create_training_data.py

# 3. Train models
python train_models.py

# 4. Restart AI service
# Development:
# Ctrl+C kemudian jalankan lagi uvicorn

# Docker:
docker-compose restart ai-service
```

## 🔧 Configuration

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/mining_dss
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_TIMEOUT=120000
JWT_SECRET=your_secret_here
```

### AI Service (.env)

```env
HOST=0.0.0.0
PORT=8000
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
ENVIRONMENT=production
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## 🧪 Testing

### Backend Tests

```powershell
cd backend-express
npm test
```

### AI Service Validation

```powershell
cd mining-ops-ai-main
python setup.py  # Run setup checker
python validate_data.py  # Validate training data
```

### API Testing

```powershell
# Health checks
curl http://localhost:5000/health
curl http://localhost:8000/

# Test recommendation (dengan auth token)
curl -X POST http://localhost:5000/api/v1/ai/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```

## 📊 Monitoring

### Prometheus Metrics

Akses: http://localhost:9090

Metrics tersedia:

- API request rates
- Response times
- Error rates
- AI service performance
- Database query times

### Grafana Dashboards

Akses: http://localhost:3001

- Username: admin
- Password: admin123

Import dashboard dari `mining-ops-ai-main/monitoring/`

## 🔐 Security Checklist

- [ ] Change default passwords
- [ ] Update JWT_SECRET
- [ ] Configure CORS properly
- [ ] Setup SSL certificates
- [ ] Configure firewall rules
- [ ] Regular database backups
- [ ] Update dependencies regularly

## 🐛 Troubleshooting

### AI Service tidak connect

```powershell
# Check Ollama
curl http://localhost:11434

# Start Ollama
ollama serve

# Verify model
ollama list
```

### Database connection error

```powershell
# Check PostgreSQL running
pg_isready

# Check connection string
psql $DATABASE_URL
```

### Frontend tidak bisa connect backend

- Check CORS configuration di backend
- Verify VITE_API_BASE_URL di frontend .env
- Check backend running dan accessible

### Models tidak ditemukan

```powershell
cd mining-ops-ai-main

# Re-train
python create_training_data.py
python train_models.py

# Verify
ls models/
```

## 📝 Maintenance

### Daily Tasks (Automated)

- ✅ Data export dari PostgreSQL ke AI service (02:00)
- ✅ Log rotation
- ✅ Health checks

### Weekly Tasks (Manual)

- Review prediction accuracy
- Check error logs
- Monitor disk space
- Review system performance

### Monthly Tasks

- Re-train models dengan data terbaru
- Update dependencies
- Security patches
- Database backup verification

## 🚦 Production Deployment

### Before Go-Live

1. ✅ All tests passing
2. ✅ Security audit completed
3. ✅ Performance testing done
4. ✅ Backup strategy in place
5. ✅ Monitoring configured
6. ✅ Documentation updated
7. ✅ Team training completed

### Deployment Steps

```powershell
# 1. Backup production data
pg_dump mining_dss > backup_$(date +%Y%m%d).sql

# 2. Pull latest code
git pull origin main

# 3. Update dependencies
cd backend-express && npm install
cd ../mining-ops-ai-main && pip install -r requirements.txt
cd ../mining-ops-frontend && npm install

# 4. Run migrations
cd backend-express
npm run db:migrate

# 5. Build frontend
cd ../mining-ops-frontend
npm run build

# 6. Restart services
pm2 restart all  # Atau gunakan Docker Compose
```

## 📞 Support

Untuk bantuan atau pertanyaan:

- Email: support@mining-ops.com
- Documentation: /docs
- API Docs: http://localhost:8000/docs

## 📄 License

Internal use only - Mining Operations Project 2025
