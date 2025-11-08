# Dokumen Teknis Implementasi

## Smart Decision Support System untuk Optimasi Operasional Pertambangan Batubara

**ID Tim Capstone Project:** A25-CS113  
**ID Use Case:** AC-05  
**Periode:** 5 Minggu

----------

## 📋 Daftar Isi

1.  [Arsitektur Sistem](https://claude.ai/chat/f44bb1b2-0514-43b7-8cfd-f0d7c2c96e97#arsitektur-sistem)
2.  [Struktur Repositori](https://claude.ai/chat/f44bb1b2-0514-43b7-8cfd-f0d7c2c96e97#struktur-repositori)
3.  [Tech Stack Detail](https://claude.ai/chat/f44bb1b2-0514-43b7-8cfd-f0d7c2c96e97#tech-stack-detail)
4.  [Database Schema & Migrasi](https://claude.ai/chat/f44bb1b2-0514-43b7-8cfd-f0d7c2c96e97#database-schema)
5.  [API Contract & Integration](https://claude.ai/chat/f44bb1b2-0514-43b7-8cfd-f0d7c2c96e97#api-contract)
6.  [Workflow Pengembangan per Minggu](https://claude.ai/chat/f44bb1b2-0514-43b7-8cfd-f0d7c2c96e97#workflow-pengembangan)
7.  [Deployment Strategy](https://claude.ai/chat/f44bb1b2-0514-43b7-8cfd-f0d7c2c96e97#deployment-strategy)
8.  [Testing & Quality Assurance](https://claude.ai/chat/f44bb1b2-0514-43b7-8cfd-f0d7c2c96e97#testing-qa)
9.  [Risk Mitigation Implementation](https://claude.ai/chat/f44bb1b2-0514-43b7-8cfd-f0d7c2c96e97#risk-mitigation)

----------

## 🏗️ 1. Arsitektur Sistem

### 1.1 Overview Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Web Browser (HTML/CSS/JS + Tailwind)                    │   │
│  │  - Dashboard UI (Farhan)                                 │   │
│  │  - Data Visualization (Chart.js)                         │   │
│  │  - AI Chatbot Interface                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NETLIFY (Frontend Host)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Static Assets (HTML/JS/CSS)                             │   │
│  │  Routing & CDN                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ API Calls
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              NETLIFY FUNCTIONS (Backend Express.js)             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Gateway (Raihan)                                    │   │
│  │  ├─ Auth & User Management                               │   │
│  │  ├─ CRUD Operations (Prisma ORM)                         │   │
│  │  └─ Proxy Service (Rizal)                                │   │
│  │     └─ Route to FastAPI via Cloudflare Tunnel            │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ Cloudflare Zero Trust Tunnel
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    HOMESERVER (Ubuntu)                          │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  PostgreSQL Database (Haikal)                          │     │
│  │  ├─ Operational Data (trucks, excavators, weather)     │     │
│  │  ├─ User Data & Auth                                   │     │
│  │  └─ Hauling Activity Logs                              │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Python FastAPI Service (Rizqy & Haikal)              │     │
│  │  ├─ /predict - ML Model Endpoints (.pkl)              │     │
│  │  ├─ /recommend - Rules-Based Agent Logic              │     │
│  │  └─ /chat-rag - AI Chatbot with DB Context            │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Ollama LLM Server (Rizqy)                             │     │
│  │  └─ Local LLM (Qwen 1.8B / Llama 3 8B - Quantized)    │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘

```

### 1.2 Data Flow

**Skenario 1: CRUD Operation (Input Data Operasional)**

```
User Input (FE) 
  → POST /api/v1/trucks (Express.js)
  → Prisma Client
  → PostgreSQL Database
  → Response (201 Created)
  → Update UI (FE)

```

**Skenario 2: ML Prediction (Risiko Keterlambatan)**

```
User Request Prediction (FE)
  → POST /api/proxy/predict (Express.js)
  → Proxy Service validates & forwards
  → POST http://homeserver/predict (FastAPI via Cloudflare Tunnel)
  → Load Model (.pkl)
  → Process Input Data
  → Return Prediction
  → Express.js handles response
  → Display Result (FE)

```

**Skenario 3: AI Chatbot with RAG**

```
User Question (FE)
  → POST /api/proxy/chat-rag (Express.js)
  → Proxy to FastAPI /chat-rag
  → FastAPI queries PostgreSQL (via SQL)
  → Build Context from DB Results
  → Send to Ollama LLM
  → Generate Contextual Answer
  → Return to FE
  → Display in Chat Interface

```

----------

## 📁 2. Struktur Repositori

```
asah-mining-dss/
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml
│       └── deploy-backend.yml
│
├── docs/
│   ├── api/
│   │   ├── postman_collection.json
│   │   └── API_DOCUMENTATION.md
│   ├── database/
│   │   ├── erd_diagram.png
│   │   └── SCHEMA_DOCUMENTATION.md
│   ├── ml/
│   │   ├── model_documentation.md
│   │   └── training_pipeline.md
│   └── deployment/
│       ├── CLOUDFLARE_SETUP.md
│       └── NETLIFY_CONFIG.md
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── dashboard.html
│   │   └── assets/
│   │       ├── css/
│   │       │   └── styles.css
│   │       ├── js/
│   │       │   ├── main.js
│   │       │   ├── api.js
│   │       │   ├── dashboard.js
│   │       │   ├── chatbot.js
│   │       │   └── utils.js
│   │       └── images/
│   ├── tailwind.config.js
│   ├── package.json
│   └── netlify.toml
│
├── backend-express/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── truckController.js
│   │   │   ├── excavatorController.js
│   │   │   ├── weatherController.js
│   │   │   └── haulingController.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   ├── truckRoutes.js
│   │   │   ├── excavatorRoutes.js
│   │   │   ├── weatherRoutes.js
│   │   │   ├── haulingRoutes.js
│   │   │   └── proxyRoutes.js
│   │   ├── services/
│   │   │   ├── mlProxyService.js
│   │   │   ├── authService.js
│   │   │   └── validationService.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validateRequest.js
│   │   ├── config/
│   │   │   └── database.js
│   │   └── index.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .env.example
│   ├── package.json
│   └── netlify.toml
│
├── service-ml-fastapi/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── predict.py
│   │   │   ├── recommend.py
│   │   │   └── chat.py
│   │   ├── models/
│   │   │   ├── prediction_models.py (Pydantic)
│   │   │   └── recommendation_models.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── ml_engine.py
│   │   │   ├── agent_logic.py
│   │   │   └── rag_engine.py
│   │   └── utils/
│   │       ├── logger.py
│   │       └── validators.py
│   ├── models_pkl/
│   │   ├── delay_risk_model.pkl
│   │   ├── breakdown_prediction_model.pkl
│   │   └── model_metadata.json
│   ├── data/
│   │   ├── seeders/
│   │   │   └── seed_data.py
│   │   └── sample/
│   │       └── sample_operational_data.csv
│   ├── tests/
│   │   ├── test_predict.py
│   │   ├── test_recommend.py
│   │   └── test_rag.py
│   ├── .env.example
│   ├── requirements.txt
│   └── Dockerfile
│
├── infrastructure/
│   ├── cloudflare/
│   │   └── tunnel-config.yml
│   └── scripts/
│       ├── setup-homeserver.sh
│       └── deploy-all.sh
│
├── .gitignore
├── README.md
└── PROJECT_PLAN.md

```

----------


Berikut adalah tabel markdown yang sudah dikoreksi untuk setiap bagian:

## 🛠️ 3. Tech Stack Detail

### 3.1 Frontend Stack

| Teknologi | Versi | Fungsi | PIC |
|-----------|-------|--------|-----|
| HTML5 | - | Struktur halaman web | Farhan |
| CSS3 + Tailwind CSS | 3.x | Styling & responsive design | Farhan |
| JavaScript (ES6+) | - | Client-side logic | Farhan |
| Chart.js | 4.x | Data visualization | Farhan |
| Fetch API | - | HTTP client untuk API calls | Farhan |

### 3.2 Backend Express Stack

| Teknologi | Versi | Fungsi | PIC |
|-----------|-------|--------|-----|
| Node.js | 18.x | JavaScript runtime | Raihan & Rizal |
| Express.js | 4.x | Web framework & REST API | Raihan & Rizal |
| Prisma ORM | 5.x | Database ORM & migrations | Raihan |
| bcrypt | 5.x | Password hashing | Raihan |
| jsonwebtoken | 9.x | JWT authentication | Raihan |
| axios | 1.x | HTTP client untuk proxy | Rizal |
| dotenv | 16.x | Environment variables | Raihan & Rizal |

### 3.3 ML/AI Service Stack

| Teknologi | Versi | Fungsi | PIC |
|-----------|-------|--------|-----|
| Python | 3.10 | Programming language | Rizqy & Haikal |
| FastAPI | 0.100+ | Web framework untuk ML service | Rizqy |
| Pydantic | 2.x | Data validation | Rizqy |
| Scikit-learn | 1.3+ | ML model training | Haikal |
| Pandas | 2.x | Data manipulation | Haikal |
| NumPy | 1.24+ | Numerical operations | Haikal |
| Ollama | Latest | LLM inference engine | Rizqy |
| psycopg2 | 2.9+ | PostgreSQL driver | Rizqy & Haikal |

### 3.4 Database & Infrastructure

| Teknologi | Versi | Fungsi | PIC |
|-----------|-------|--------|-----|
| PostgreSQL | 14+ | Relational database | Haikal |
| Ubuntu Server | 22.04 LTS | Homeserver OS | Rizal |
| Cloudflare Tunnel | Latest | Secure homeserver exposure | Rizal |
| Netlify | - | Frontend & serverless backend hosting | Rizal |


----------

## 🗄️ 4. Database Schema & Migrasi

### 4.1 Prisma Schema (Kontrak Database)

**File: `backend-express/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============= USER MANAGEMENT =============
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String   // bcrypt hashed
  role      String   @default("supervisor") // supervisor, admin, operator
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

// ============= OPERATIONAL DATA =============
model Truck {
  id              String           @id @default(cuid())
  code            String           @unique // H-001, H-002, dll
  name            String           // Hauler A
  status          String           @default("idle") // idle, hauling, maintenance, breakdown
  lastMaintenance DateTime?
  totalHours      Int              @default(0)
  capacity        Int              // ton
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  
  haulingActivities HaulingActivity[]
  
  @@map("trucks")
}

model Excavator {
  id              String           @id @default(cuid())
  code            String           @unique // EX-01, EX-02, dll
  name            String           // Excavator Alpha
  status          String           @default("active") // active, maintenance, breakdown
  queueLength     Int              @default(0) // jumlah hauler mengantri
  location        String           // Pit A, Pit B, dll
  lastMaintenance DateTime?
  totalHours      Int              @default(0)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  
  haulingActivities HaulingActivity[]
  
  @@map("excavators")
}

model WeatherLog {
  id          String   @id @default(cuid())
  timestamp   DateTime @default(now())
  condition   String   // Cerah, Berawan, Hujan Ringan, Hujan Lebat, Badai
  temperature Float?   // Celsius
  windSpeed   Float?   // km/h
  visibility  String?  // Baik, Sedang, Buruk
  waveHeight  Float?   // meter (untuk operasi pelabuhan)
  
  @@map("weather_logs")
}

model HaulingActivity {
  id                String     @id @default(cuid())
  truckId           String
  excavatorId       String
  startTime         DateTime
  endTime           DateTime?
  distance          Float      // km
  loadWeight        Float      // ton
  status            String     @default("ongoing") // ongoing, completed, delayed, cancelled
  delayMinutes      Int        @default(0)
  delayReason       String?    // cuaca, breakdown, antrian, dll
  weatherCondition  String?
  
  truck       Truck      @relation(fields: [truckId], references: [id])
  excavator   Excavator  @relation(fields: [excavatorId], references: [id])
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  @@map("hauling_activities")
}

// ============= ML/AI LOGS (OPTIONAL) =============
model PredictionLog {
  id            String   @id @default(cuid())
  modelType     String   // delay_risk, breakdown_prediction
  inputData     Json     // Raw input yang dikirim ke model
  prediction    Json     // Output dari model
  confidence    Float?   // Confidence score (jika ada)
  timestamp     DateTime @default(now())
  
  @@map("prediction_logs")
}

model RecommendationLog {
  id              String   @id @default(cuid())
  recommendation  String   // Teks rekomendasi
  justification   String   // Alasan rekomendasi
  executedBy      String?  // User yang mengeksekusi (jika ada)
  status          String   @default("pending") // pending, executed, ignored
  timestamp       DateTime @default(now())
  
  @@map("recommendation_logs")
}

```

### 4.2 Migrasi Database (PIC: Raihan)

**Langkah-langkah:**

1.  Setelah schema final disepakati (Minggu 1):

```bash
cd backend-express
npx prisma migrate dev --name init_schema

```

2.  Generate Prisma Client:

```bash
npx prisma generate

```

3.  Cek migrasi berhasil:

```bash
npx prisma studio  # Buka GUI untuk lihat tabel

```

### 4.3 Data Seeding (PIC: Haikal)

**File: `backend-express/prisma/seed.js`**

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Users
  const hashedPassword = await bcrypt.hash('supervisor123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { username: 'supervisor1' },
    update: {},
    create: {
      username: 'supervisor1',
      password: hashedPassword,
      role: 'supervisor',
    },
  });

  // 2. Seed Trucks (15 unit)
  const trucks = [];
  for (let i = 1; i <= 15; i++) {
    const truck = await prisma.truck.upsert({
      where: { code: `H-${String(i).padStart(3, '0')}` },
      update: {},
      create: {
        code: `H-${String(i).padStart(3, '0')}`,
        name: `Hauler ${i}`,
        status: i % 5 === 0 ? 'maintenance' : i % 7 === 0 ? 'hauling' : 'idle',
        capacity: 40 + Math.floor(Math.random() * 20), // 40-60 ton
        totalHours: Math.floor(Math.random() * 5000),
      },
    });
    trucks.push(truck);
  }

  // 3. Seed Excavators (5 unit)
  const excavators = [];
  const locations = ['Pit A', 'Pit B', 'Pit C', 'Stockpile Utara', 'Stockpile Selatan'];
  
  for (let i = 1; i <= 5; i++) {
    const excavator = await prisma.excavator.upsert({
      where: { code: `EX-${String(i).padStart(2, '0')}` },
      update: {},
      create: {
        code: `EX-${String(i).padStart(2, '0')}`,
        name: `Excavator ${String.fromCharCode(64 + i)}`, // A, B, C, ...
        status: i === 5 ? 'maintenance' : 'active',
        queueLength: Math.floor(Math.random() * 6), // 0-5 hauler
        location: locations[i - 1],
        totalHours: Math.floor(Math.random() * 8000),
      },
    });
    excavators.push(excavator);
  }

  // 4. Seed Weather Logs (30 hari terakhir)
  const weatherConditions = ['Cerah', 'Berawan', 'Hujan Ringan', 'Hujan Lebat'];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const timestamp = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    await prisma.weatherLog.create({
      data: {
        timestamp,
        condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
        temperature: 25 + Math.random() * 10, // 25-35°C
        windSpeed: Math.random() * 30, // 0-30 km/h
        visibility: Math.random() > 0.3 ? 'Baik' : 'Sedang',
      },
    });
  }

  // 5. Seed Hauling Activities (100 aktivitas terakhir)
  for (let i = 0; i < 100; i++) {
    const truck = trucks[Math.floor(Math.random() * trucks.length)];
    const excavator = excavators[Math.floor(Math.random() * excavators.length)];
    const startTime = new Date(now.getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000));
    const duration = 30 + Math.random() * 60; // 30-90 menit
    
    await prisma.haulingActivity.create({
      data: {
        truckId: truck.id,
        excavatorId: excavator.id,
        startTime,
        endTime: new Date(startTime.getTime() + duration * 60 * 1000),
        distance: 2 + Math.random() * 8, // 2-10 km
        loadWeight: 35 + Math.random() * 20, // 35-55 ton
        status: 'completed',
        delayMinutes: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
        weatherCondition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      },
    });
  }

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```

**Eksekusi seeding:**

```bash
node prisma/seed.js

```

----------

## 🔌 5. API Contract & Integration

### 5.1 REST API Endpoints (Express.js)

#### Authentication

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

```

#### Trucks Management

```
GET    /api/v1/trucks           # List all trucks
GET    /api/v1/trucks/:id       # Get truck detail
POST   /api/v1/trucks           # Create new truck
PUT    /api/v1/trucks/:id       # Update truck
DELETE /api/v1/trucks/:id       # Delete truck
GET    /api/v1/trucks/idle      # Get idle trucks only

```

#### Excavators Management

```
GET    /api/v1/excavators
GET    /api/v1/excavators/:id
POST   /api/v1/excavators
PUT    /api/v1/excavators/:id
DELETE /api/v1/excavators/:id

```

#### Weather Logs

```
GET    /api/v1/weather          # Get recent weather
POST   /api/v1/weather          # Log new weather condition
GET    /api/v1/weather/latest   # Get latest weather

```

#### Hauling Activities

```
GET    /api/v1/hauling
GET    /api/v1/hauling/:id
POST   /api/v1/hauling/start    # Start new hauling activity
PUT    /api/v1/hauling/:id/complete
GET    /api/v1/hauling/stats    # Statistics (delay rate, etc.)

```

#### ML/AI Proxy Endpoints (Rizal)

```
POST   /api/proxy/predict       # Prediksi risiko delay
POST   /api/proxy/recommend     # Rekomendasi optimasi
POST   /api/proxy/chat-rag      # AI Chatbot dengan RAG
GET    /api/proxy/health        # Health check homeserver

```

### 5.2 FastAPI Endpoints (Python Service)

**Base URL:** `http://homeserver.local:8000` (via Cloudflare Tunnel)

```
GET    /health                  # Health check
POST   /predict/delay-risk      # Prediksi risiko keterlambatan hauling
POST   /predict/breakdown       # Prediksi breakdown alat berat
POST   /recommend               # Rekomendasi optimasi berbasis rules
POST   /chat-rag                # AI Chatbot dengan context dari DB
GET    /models/info             # Info model yang digunakan

```

### 5.3 API Request/Response Examples

#### Example 1: Login

**Request:**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "supervisor1",
  "password": "supervisor123"
}

```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clx123456",
      "username": "supervisor1",
      "role": "supervisor"
    }
  }
}

```

#### Example 2: Get Idle Trucks

**Request:**

```http
GET /api/v1/trucks/idle
Authorization: Bearer {token}

```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx789",
      "code": "H-001",
      "name": "Hauler 1",
      "status": "idle",
      "capacity": 45,
      "idleDuration": "02:30:00"
    }
  ]
}

```

#### Example 3: Predict Delay Risk (Proxy to FastAPI)

**Request:**

```http
POST /api/proxy/predict
Authorization: Bearer {token}
Content-Type: application/json

{
  "truckCode": "H-003",
  "excavatorCode": "EX-02",
  "distance": 5.2,
  "weatherCondition": "Hujan Lebat",
  "queueLength": 3
}

```

**Response (200) - from FastAPI:**

```json
{
  "success": true,
  "prediction": {
    "riskLevel": "Tinggi",
    "estimatedDelayMinutes": 45,
    "confidence": 0.87,
    "factors": [
      "Cuaca buruk (Hujan Lebat)",
      "Antrian panjang di excavator (3 hauler)",
      "Jarak hauling relatif jauh (5.2 km)"
    ]
  }
}

```

#### Example 4: Get Recommendation

**Request:**

```http
POST /api/proxy/recommend
Authorization: Bearer {token}

```

**Response (200):**

```json
{
  "success": true,
  "recommendation": {
    "action": "Alokasikan Hauler H-003 ke Excavator EX-01",
    "justification": "Hauler H-003 sedang idle selama 45 menit. Excavator EX-01 memiliki antrian terpendek (1 hauler) dan jarak hauling optimal (3.2 km).",
    "priority": "high",
    "estimatedImpact": "Pengurangan downtime 45 menit, peningkatan efisiensi 12%"
  }
}

```

#### Example 5: AI Chatbot RAG

**Request:**

```http
POST /api/proxy/chat-rag
Authorization: Bearer {token}
Content-Type: application/json

{
  "prompt": "Kenapa Hauler H-003 direkomendasikan pindah ke EX-01?"
}

```

**Response (200):**

```json
{
  "success": true,
  "answer": "Berdasarkan data operasional saat ini, Hauler H-003 telah idle selama 45 menit terakhir. Sementara itu, Excavator EX-01 memiliki antrian terpendek (hanya 1 hauler) dibanding excavator lain. Jarak dari posisi H-003 ke EX-01 adalah 3.2 km yang merupakan jarak optimal. Memindahkan H-003 ke EX-01 akan mengurangi idle time dan meningkatkan produktivitas sebesar 12%.",
  "context": {
    "truckStatus": "idle",
    "idleDuration": "45 menit",
    "targetExcavator": "EX-01",
    "queueLength": 1,
    "distance": 3.2
  }
}

```


----------

## 📅 6. Workflow Pengembangan per Minggu

### MINGGU 1: Fondasi, Desain & Setup

#### 🎯 Target Milestone:

-   ✅ Skema Database PostgreSQL pertama ditetapkan
-   ✅ Wireframe & Mockup website garis besar teridentifikasi
-   ✅ Setup Repositori Git & environment yang dibutuhkan

#### 👥 Task Breakdown:

**ML Team (Rizqy & Haikal):**

-   Finalisasi skema database operasional untuk data pertambangan
-   Riset model prediktif yang sesuai dengan use case (delay risk, breakdown prediction)
-   Setup environment Python (FastAPI, Scikit-learn, Pandas, NumPy)
-   Setup Ollama di homeserver untuk testing awal LLM

**Backend Team (Rizal & Raihan):**

-   Setup proyek Node.js dengan Express.js dan Prisma ORM
-   Desain skema database dan membuat migrations pertama
-   Inisialisasi koneksi database PostgreSQL dengan backend Express dan Prisma ORM
-   Setup repository Git dengan branching strategy (main, develop, feature branches)

**Frontend Team (Farhan):**

-   Desain wireframe & mockup dashboard website menggunakan Figma/tool sejenis
-   Setup komponen UI project (HTML, CSS, JavaScript) dengan Tailwind CSS
-   Penentuan sistem desain (color palette, typography, spacing)
-   Membuat struktur folder frontend yang terorganisir

----------

### MINGGU 2: Pengembangan Inti (Core Dev)

#### 🎯 Target Milestone:

-   ✅ API CRUD berfungsi dengan baik
-   ✅ Model ML ter-validasi (internal testing)
-   ✅ Layout dashboard selesai beserta beberapa page turunannya

#### 👥 Task Breakdown:

**ML Team (Rizqy & Haikal):**

-   Membuat seeders data operasional tambang (data sintetis realistis)
-   Training & validasi model prediktif (contoh: `delay_risk`, `breakdown_prediction`)
-   Mengembangkan endpoint FastAPI untuk trigger AI & ML model (`/predict`)
-   Testing akurasi model dan dokumentasi hasil validasi

**Backend Team (Rizal & Raihan):**

-   Implementasi API CRUD data operasional (alat, cuaca, jadwal hauling)
-   Implementasi API otentikasi dasar (register, login) dengan manajemen role (supervisor, admin)
-   Implementasi middleware untuk authorization dan error handling
-   Testing endpoint dengan Postman/Thunder Client

**Frontend Team (Farhan):**

-   Implementasi layout utama dashboard (navbar, sidebar, footer) dengan HTML/Tailwind
-   Implementasi halaman auth user (login, register page)
-   Komponen visualisasi data (tabel, chart dummy menggunakan Chart.js)
-   Setup routing halaman (dashboard, data alat, log cuaca, prediksi)

----------

### MINGGU 3: Integrasi API & Fitur AI

#### 🎯 Target Milestone:

-   ✅ Dashboard mampu menampilkan data dinamis dari database
-   ✅ Proxy backend ke machine learning model berfungsi dengan baik
-   ✅ AI Chatbot Ollama dapat merespons query sederhana

#### 👥 Task Breakdown:

**ML Team (Rizqy & Haikal):**

-   Menginstall dan mengkonfigurasi platform Ollama untuk menjalankan LLM open-source secara lokal di homeserver
-   Proses pengujian Ollama untuk memastikan berfungsi dengan benar
-   Endpoint FastAPI phase 2 (`/chat-rag`) untuk RAG sederhana dengan PostgreSQL
-   Endpoint FastAPI phase 3 (`/recommend`) untuk rules-based agent
-   Testing RAG: chatbot dapat mengambil data kontekstual dari database

**Backend Team (Rizal & Raihan):**

-   Implementasi API proxy Express ke FastAPI untuk `/predict`, `/chat-rag`, `/recommend`
-   Middleware keamanan untuk API proxy (validasi token, rate limiting)
-   Error handling untuk kasus homeserver down (fallback logic)
-   Testing koneksi Express ↔ FastAPI dengan berbagai skenario

**Frontend Team (Farhan):**

-   Koneksi dashboard ke backend API CRUD
-   Visualisasi data dinamis dari Database (tabel alat berat, log cuaca real-time)
-   Form untuk input/update data operasional (tambah truck, excavator, weather log)
-   Testing integrasi frontend-backend (CRUD operations end-to-end)

----------

### MINGGU 4: Fitur Lengkap & Pengujian

#### 🎯 Target Milestone:

-   ✅ Fitur MVP lengkap (CRUD, Predict, Recommend, Chat)
-   ✅ Semua bagian sistem telah diuji bersama (end-to-end testing)
-   ✅ UI/UX responsive di berbagai perangkat

#### 👥 Task Breakdown:

**ML Team (Rizqy & Haikal):**

-   Menyempurnakan ketepatan dan kinerja ML model (hyperparameter tuning, cross-validation)
-   Refinement RAG prompt untuk meningkatkan akurasi jawaban chatbot
-   Stress testing endpoint FastAPI (load testing dengan tools seperti Locust)
-   Dokumentasi cara kerja model dan endpoint API

**Backend Team (Rizal & Raihan):**

-   Finalisasi error handling & fallback logic (jika homeserver down)
-   Pengujian keamanan API Express (validasi input, SQL injection prevention, XSS protection)
-   Rate limiting untuk mencegah abuse endpoint
-   Testing manajemen otentikasi dan authorization yang baik

**Frontend Team (Farhan):**

-   Implementasi visualisasi data dengan card "Rekomendasi AI" di dashboard
-   Implementasi interface AI Chatbot (chatbox UI, message history)
-   Refinement UI/UX & responsive design (mobile, tablet, desktop)
-   Pengujian integrasi end-to-end (user flow dari login → input data → prediksi → chat)

----------

### MINGGU 5: Deployment & Finalisasi

#### 🎯 Target Milestone:

-   ✅ Proyek live di production (Netlify + Homeserver)
-   ✅ Penyusunan seluruh dokumen teknis lengkap
-   ✅ Video demo & materi presentasi akhir siap

#### 👥 Task Breakdown:

**ML Team (Rizqy & Haikal):**

-   Implementasi sistem pencatatan aktivitas (logging) dan pemantauan kinerja untuk FastAPI dan Ollama di homeserver
-   Monitoring resource usage (CPU, RAM, disk) untuk mencegah crash
-   Final testing semua endpoint ML/AI dalam kondisi production-like

**Backend Team (Rizal & Raihan):**

-   Finalisasi deployment Express.js di Netlify & koneksi database PostgreSQL di homeserver
-   Konfigurasi final Cloudflare Tunnel untuk mengekspos layanan di homeserver (FastAPI, Ollama, PostgreSQL) ke internet publik secara aman
-   Testing koneksi Netlify → Cloudflare Tunnel → Homeserver
-   Setup environment variables production di Netlify

**Frontend Team (Farhan):**

-   Finalisasi styling Tailwind (pre-build) untuk production di Netlify tanpa kompilasi ulang di server side
-   Cross-browser testing (Chrome, Firefox, Safari, Edge)
-   Optimization (minifikasi CSS/JS, lazy loading images)
-   Final UI polish dan bug fixing

**Semua Tim:**

-   Penyusunan dokumentasi teknis:
    -   Architecture diagram (system design, data flow)
    -   API documentation (endpoint list, request/response format)
    -   User guide (cara menggunakan aplikasi)
    -   Deployment guide (cara setup environment, deployment steps)
-   Pembuatan video demo aplikasi (5-10 menit)
-   Persiapan materi presentasi akhir (slides, talking points)
-   Dry-run presentasi untuk feedback internal

----------

## 🔐 7. Manajemen Risiko dan Mitigasi

### Analisis SWOT

#### ✅ **Strengths (Kekuatan Internal)**

**S1: Arsitektur Best Practice**

-   Pembagian tanggung jawab dengan microservices (Express.js untuk API bisnis, FastAPI untuk AI/ML)
-   Sistem scalable, modular, dan mudah dikelola

**S2: Komposisi Tim Ideal**

-   2 ML Engineer + 3 FE/BE Developer sangat seimbang
-   Sesuai dengan kebutuhan use case yang berat di analisis data dan interface pengguna

**S3: Tech Stack Modern**

-   Prisma ORM, FastAPI, PostgreSQL adalah tools modern yang efisien
-   Diminati industri dan memiliki dokumentasi yang lengkap

**S4: Infrastruktur Hemat Biaya**

-   Pemanfaatan homeserver + Cloudflare Tunnel + Netlify free tier
-   Menjalankan layanan compute-heavy (LLM, DB) tanpa biaya cloud VPS mahal

----------

#### ⚠️ **Weaknesses (Kelemahan Internal)**

**W1: Kompleksitas Deployment Hybrid**

-   **Risiko:** Mengelola koneksi antara layanan serverless (Netlify) dan stateful (homeserver) bisa rumit (latency, firewall, environment variables)
-   **Mitigasi:**
    -   Raihan (DevOps) ditugaskan khusus untuk fokus pada alur deployment
    -   Dokumentasi environment variable yang baik
    -   Optimasi penggunaan Cloudflare Tunnel untuk menyederhanakan koneksi

**W2: Ketergantungan pada Homeserver (Single Point of Failure)**

-   **Risiko:** Jika laptop homeserver mati (listrik, internet putus, crash), seluruh layanan inti (DB, ML, AI) akan mati
-   **Mitigasi:**
    -   Backend Express.js (di Netlify) didesain secara defensif
    -   Jika request proxy ke FastAPI gagal, API mengembalikan error `503 Service Unavailable`
    -   Frontend menangani error dengan pesan user-friendly: _"Layanan AI sedang offline, kami sedang memperbaikinya"_
    -   Monitoring dan alerting untuk deteksi dini masalah homeserver

**W3: Kualitas Data Sintetis**

-   **Risiko:** Data sintetis dapat gagal menangkap korelasi kompleks dari operasi tambang real, mempengaruhi akurasi model ML
-   **Mitigasi:**
    -   Tim ML (Haikal & Rizqy) mendedikasikan waktu di Minggu 1-2 untuk riset studi kasus dan paper terkait operasional tambang
    -   Konsultasi dengan domain expert (jika memungkinkan)
    -   Memastikan data sintetis serealistis mungkin dengan distribusi yang masuk akal

----------

#### 🚀 **Opportunities (Peluang Eksternal)**

**O1: Portofolio End-to-End**

-   Proyek mencakup seluruh stack (FE, BE, ML, AI, DevOps, DB)
-   Menjadi proyek portofolio yang sangat kuat untuk semua anggota tim

**O2: Penerapan RAG Lokal**

-   Implementasi RAG dengan Ollama (open-source LLM) adalah teknologi yang sangat relevan dan diminati industri

**O3: Solusi Scalable**

-   Arsitektur proxy Express → FastAPI mudah di-scale
-   Homeserver dapat diganti ke cloud VPS (DigitalOcean, AWS) tanpa mengubah arsitektur kode terlalu banyak

----------

#### ⚡ **Threats (Ancaman Eksternal)**

**T1: Performa Homeserver Terbatas**

-   **Risiko:** Laptop tersedia (AMD A12, RAM 4GB) memiliki resource terbatas. Menjalankan PostgreSQL, FastAPI, dan Ollama LLM bersamaan mungkin menyebabkan crash atau respons lambat
-   **Mitigasi:**
    1.  **Prioritas:** Fokus pada model ML ringan (Scikit-learn) dan RAG sederhana
    2.  **LLM Ringan:** Memilih LLM open-source terkecil yang mumpuni (Qwen 1.8B, Llama 3 8B - quantized GGUF)
    3.  **Load Testing:** Melakukan load testing di Minggu 3 untuk mengukur batas kapabilitas server
    4.  **Backup Plan:** Jika homeserver tidak mampu, siapkan fallback ke Deepseek API (low-cost external LLM)

**T2: Scope Creep (Pembengkakan Lingkup)**

-   **Risiko:** Use case "Agentic AI" dan "Simulasi" sangat luas. Tim dapat tergoda menambah fitur simulasi MESA kompleks atau model ML tambahan, kehilangan fokus dan waktu
-   **Mitigasi:**
    -   Disiplin ketat mengacu pada dokumen Project Plan
    -   Segala ide fitur tambahan (simulasi MESA, optimasi kualitas batubara) dicatat tetapi dimasukkan ke backlog **"Out of Scope"**
    -   Review mingguan untuk memastikan fokus tetap pada MVP

**T3: Resistensi Pengguna (Simulasi)**

-   **Risiko:** Dalam skenario real-world, operator lapangan mungkin enggan mempercayai rekomendasi AI (terbiasa dengan tupoksi dan pengalaman bertahun-tahun)
-   **Mitigasi:**
    1.  **Justifikasi di Dashboard:** Setiap rekomendasi disertai alasan singkat (_"Alokasi ke EX02 karena antrian pendek (1) & Hauler H003 sedang idle"_)
    2.  **AI Chatbot RAG:** Pengguna dapat bertanya spesifik (_"Kenapa saya harus memindahkan H003?"_) dan chatbot memberikan justifikasi lengkap dari database

----------

## 📊 8. Metrics & Success Criteria

### Key Performance Indicators (KPIs):

**Technical KPIs:**

-   ✅ API uptime ≥ 95% selama testing period
-   ✅ Model ML accuracy ≥ 80% untuk prediksi delay risk
-   ✅ API response time (Express → FastAPI) < 2 detik
-   ✅ Chatbot RAG response time < 5 detik
-   ✅ Zero critical security vulnerabilities

**Functional KPIs:**

-   ✅ Semua fitur MVP berfungsi (CRUD, Predict, Recommend, Chat)
-   ✅ Dashboard dapat menampilkan data real-time dari database
-   ✅ Chatbot dapat menjawab minimal 5 jenis query operasional
-   ✅ UI responsive di 3 platform (desktop, tablet, mobile)

**Project Management KPIs:**

-   ✅ Semua milestone mingguan tercapai tepat waktu
-   ✅ Dokumentasi teknis lengkap (architecture, API, user guide)
-   ✅ Video demo & presentasi siap di Minggu 5

----------

## 📚 9. Referensi dan Sumber Daya

### Teknologi & Framework:

-   **Express.js Documentation:** https://expressjs.com/
-   **FastAPI Documentation:** https://fastapi.tiangolo.com/
-   **Prisma ORM:** https://www.prisma.io/docs
-   **Ollama:** https://ollama.ai/
-   **Tailwind CSS:** https://tailwindcss.com/docs

### Deployment & Infrastructure:

-   **Netlify Functions:** https://docs.netlify.com/functions/overview/
-   **Cloudflare Zero Trust Tunnel:** https://developers.cloudflare.com/cloudflare-one/

### Machine Learning:

-   **Scikit-learn:** https://scikit-learn.org/stable/
-   **RAG Implementation Guide:** https://python.langchain.com/docs/use_cases/question_answering/

----------

## 🎯 10. Kesimpulan

Proyek **Smart Decision Support System untuk Optimasi Operasional Pertambangan Batubara** ini dirancang sebagai solusi **"painkiller"** yang konkret untuk mengatasi inefisiensi operasional dan downtime tinggi di industri pertambangan.

### Nilai Tambah Proyek:

1.  **End-to-End Solution:** Mencakup seluruh stack teknologi (FE, BE, ML, AI, DevOps)
2.  **Real-World Relevance:** Mengatasi masalah nyata dengan dampak finansial signifikan
3.  **Modern Architecture:** Microservices, RAG, dan AI Chatbot lokal
4.  **Cost-Effective:** Infrastruktur hemat biaya tanpa mengorbankan fungsionalitas

### Deliverables Akhir:

-   ✅ Portal aplikasi website yang fully functional
-   ✅ Model ML prediktif dengan akurasi tervalidasi
-   ✅ AI Chatbot dengan RAG untuk justifikasi rekomendasi
-   ✅ Dokumentasi teknis lengkap
-   ✅ Video demo dan materi presentasi

Dengan jadwal 5 minggu yang terstruktur, pembagian tugas yang jelas, dan manajemen risiko yang proaktif, tim A25-CS113 siap mengeksekusi proyek ini hingga sukses. 🚀

----------

**Tim A25-CS113**  
Asah led by Dicoding in association with Accenture  
Use Case: AC-05 (Agentic AI & Simulasi)
