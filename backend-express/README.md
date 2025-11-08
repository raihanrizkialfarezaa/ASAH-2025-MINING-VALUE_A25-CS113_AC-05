# Mining Operations Management System - Backend API

Backend API untuk sistem manajemen operasi tambang dengan Express.js, Prisma ORM, PostgreSQL, dan integrasi ML/AI.

## Tech Stack

- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express.js 4.21.1
- **Database**: PostgreSQL 16.10
- **ORM**: Prisma 5.20.0
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Logging**: Winston + Morgan
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL 16.10
- npm atau yarn
- FastAPI ML service (optional, untuk fitur prediksi)

## Installation

### 1. Clone dan Install Dependencies

```bash
cd backend-express
npm install
```

### 2. Environment Configuration

Copy `.env.example` ke `.env` dan sesuaikan konfigurasi:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mining_db"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
FASTAPI_BASE_URL="http://localhost:8000/api"
FASTAPI_TIMEOUT="30000"
BCRYPT_ROUNDS="10"
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX="100"
AUTH_RATE_LIMIT_WINDOW="900000"
AUTH_RATE_LIMIT_MAX="5"
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

Commands:

- `prisma generate` - Generate Prisma Client
- `prisma migrate dev` - Run migrations
- `prisma db seed` - Populate database dengan data sample

## Running the Application

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000` dengan auto-reload.

### Production Mode

```bash
npm start
```

### Other Scripts

```bash
npm run prisma:studio    # Open Prisma Studio (GUI database)
npm run prisma:generate  # Regenerate Prisma Client
npm run test            # Run tests (Jest)
```

## API Documentation

Base URL: `http://localhost:3000/api/v1`

### Health Check

```
GET /health
```

### Authentication Endpoints

| Method | Endpoint                | Description        | Auth Required |
| ------ | ----------------------- | ------------------ | ------------- |
| POST   | `/auth/register`        | Register user baru | No            |
| POST   | `/auth/login`           | Login user         | No            |
| GET    | `/auth/me`              | Get profile        | Yes           |
| PUT    | `/auth/change-password` | Change password    | Yes           |

### User Management

| Method | Endpoint              | Description         | Roles             |
| ------ | --------------------- | ------------------- | ----------------- |
| GET    | `/users`              | List all users      | ADMIN, SUPERVISOR |
| GET    | `/users/:id`          | Get user detail     | ADMIN, SUPERVISOR |
| POST   | `/users`              | Create user         | ADMIN             |
| PUT    | `/users/:id`          | Update user         | ADMIN             |
| DELETE | `/users/:id`          | Delete user         | ADMIN             |
| PATCH  | `/users/:id/activate` | Activate/deactivate | ADMIN             |

### Truck Management

| Method | Endpoint                      | Description             | Roles                         |
| ------ | ----------------------------- | ----------------------- | ----------------------------- |
| GET    | `/trucks`                     | List all trucks         | All                           |
| GET    | `/trucks/:id`                 | Get truck detail        | All                           |
| GET    | `/trucks/:id/performance`     | Get performance metrics | All                           |
| POST   | `/trucks`                     | Create truck            | ADMIN, SUPERVISOR             |
| PUT    | `/trucks/:id`                 | Update truck            | ADMIN, SUPERVISOR             |
| PATCH  | `/trucks/:id/status`          | Update status           | ADMIN, SUPERVISOR, DISPATCHER |
| POST   | `/trucks/:id/assign-operator` | Assign operator         | ADMIN, SUPERVISOR, DISPATCHER |
| DELETE | `/trucks/:id`                 | Delete truck            | ADMIN                         |

### Excavator Management

| Method | Endpoint                      | Description             | Roles                         |
| ------ | ----------------------------- | ----------------------- | ----------------------------- |
| GET    | `/excavators`                 | List all excavators     | All                           |
| GET    | `/excavators/:id`             | Get excavator detail    | All                           |
| GET    | `/excavators/:id/performance` | Get performance metrics | All                           |
| POST   | `/excavators`                 | Create excavator        | ADMIN, SUPERVISOR             |
| PUT    | `/excavators/:id`             | Update excavator        | ADMIN, SUPERVISOR             |
| PATCH  | `/excavators/:id/status`      | Update status           | ADMIN, SUPERVISOR, DISPATCHER |
| DELETE | `/excavators/:id`             | Delete excavator        | ADMIN                         |

### Operator Management

| Method | Endpoint                     | Description             | Roles             |
| ------ | ---------------------------- | ----------------------- | ----------------- |
| GET    | `/operators`                 | List all operators      | All               |
| GET    | `/operators/:id`             | Get operator detail     | All               |
| GET    | `/operators/:id/performance` | Get performance metrics | All               |
| POST   | `/operators`                 | Create operator         | ADMIN, SUPERVISOR |
| PUT    | `/operators/:id`             | Update operator         | ADMIN, SUPERVISOR |
| DELETE | `/operators/:id`             | Delete operator         | ADMIN             |

### Hauling Activity

| Method | Endpoint                        | Description            | Roles                  |
| ------ | ------------------------------- | ---------------------- | ---------------------- |
| GET    | `/hauling`                      | List all activities    | All                    |
| GET    | `/hauling/active`               | Get active operations  | All                    |
| GET    | `/hauling/statistics`           | Get statistics         | All                    |
| GET    | `/hauling/:id`                  | Get activity detail    | All                    |
| POST   | `/hauling`                      | Start new hauling      | SUPERVISOR, DISPATCHER |
| PATCH  | `/hauling/:id/complete-loading` | Complete loading phase | OPERATOR               |
| PATCH  | `/hauling/:id/complete-dumping` | Complete dumping phase | OPERATOR               |
| PATCH  | `/hauling/:id/complete`         | Complete full cycle    | SUPERVISOR, DISPATCHER |
| PATCH  | `/hauling/:id/cancel`           | Cancel activity        | ADMIN, SUPERVISOR      |
| POST   | `/hauling/:id/delay`            | Add delay reason       | All                    |

### Location Management

| Method | Endpoint                    | Description          | Roles             |
| ------ | --------------------------- | -------------------- | ----------------- |
| GET    | `/mining-sites`             | List mining sites    | All               |
| GET    | `/locations/loading-points` | List loading points  | All               |
| GET    | `/locations/dumping-points` | List dumping points  | All               |
| GET    | `/locations/road-segments`  | List road segments   | All               |
| POST   | `/mining-sites`             | Create mining site   | ADMIN, SUPERVISOR |
| POST   | `/locations/loading-points` | Create loading point | ADMIN, SUPERVISOR |

### Weather Monitoring

| Method | Endpoint          | Description        | Roles                         |
| ------ | ----------------- | ------------------ | ----------------------------- |
| GET    | `/weather`        | List weather logs  | All                           |
| GET    | `/weather/latest` | Get latest weather | All                           |
| GET    | `/weather/:id`    | Get weather detail | All                           |
| POST   | `/weather`        | Create weather log | ADMIN, SUPERVISOR, DISPATCHER |

### Maintenance Management

| Method | Endpoint                | Description              | Roles             |
| ------ | ----------------------- | ------------------------ | ----------------- |
| GET    | `/maintenance`          | List maintenance logs    | All               |
| GET    | `/maintenance/upcoming` | Get upcoming maintenance | All               |
| GET    | `/maintenance/:id`      | Get maintenance detail   | All               |
| POST   | `/maintenance`          | Create maintenance log   | ADMIN, SUPERVISOR |

### Production Records

| Method | Endpoint                 | Description             | Roles                         |
| ------ | ------------------------ | ----------------------- | ----------------------------- |
| GET    | `/production`            | List production records | All                           |
| GET    | `/production/statistics` | Get statistics          | All                           |
| GET    | `/production/:id`        | Get record detail       | All                           |
| POST   | `/production`            | Create record           | ADMIN, SUPERVISOR, DISPATCHER |

### Dashboard Analytics

| Method | Endpoint                           | Description            | Roles |
| ------ | ---------------------------------- | ---------------------- | ----- |
| GET    | `/dashboard/overview`              | Get dashboard overview | All   |
| GET    | `/dashboard/equipment-utilization` | Equipment utilization  | All   |
| GET    | `/dashboard/delay-analysis`        | Delay analysis         | All   |
| GET    | `/dashboard/maintenance-overview`  | Maintenance overview   | All   |

### ML/AI Integration

| Method | Endpoint                 | Description                 | Roles  |
| ------ | ------------------------ | --------------------------- | ------ |
| GET    | `/ml/health`             | Check ML service health     | Public |
| POST   | `/ml/predict/delay-risk` | Predict delay risk          | All    |
| POST   | `/ml/predict/breakdown`  | Predict equipment breakdown | All    |
| POST   | `/ml/recommend`          | Get recommendations         | All    |
| POST   | `/ml/chat-rag`           | Chat with RAG               | All    |

## Authentication

API menggunakan JWT Bearer token authentication.

### Login Flow

1. POST `/api/v1/auth/login` dengan credentials:

```json
{
  "email": "admin@mining.com",
  "password": "password123"
}
```

2. Response:

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "ADMIN" },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

3. Gunakan accessToken di header:

```
Authorization: Bearer eyJhbGc...
```

## User Roles

- **ADMIN**: Full access ke semua fitur
- **SUPERVISOR**: Manage operations, equipment, operators
- **DISPATCHER**: Manage hauling activities, assignments
- **OPERATOR**: Execute hauling operations (loading/dumping)
- **VIEWER**: Read-only access

## Sample Credentials

Setelah seeding, gunakan credentials berikut:

```
Admin:
email: admin@mining.com
password: password123

Supervisor:
email: supervisor1@mining.com
password: password123

Dispatcher:
email: dispatcher1@mining.com
password: password123

Operator:
email: operator1@mining.com
password: password123
```

## Database Schema

### Core Models

- **User**: User accounts dengan role-based access
- **Operator**: Operator profiles dengan license info
- **MiningSite**: Mining site locations
- **LoadingPoint**: Loading points dengan excavator assignment
- **DumpingPoint**: Dumping points dengan capacity tracking
- **RoadSegment**: Road network dengan conditions
- **Truck**: Dump truck fleet dengan status tracking
- **Excavator**: Excavator fleet dengan performance metrics
- **HaulingActivity**: Core hauling operations lifecycle
- **QueueLog**: Truck queue management
- **WeatherLog**: Weather monitoring dengan risk assessment
- **MaintenanceLog**: Equipment maintenance tracking
- **IncidentReport**: Safety incident reports
- **FuelConsumption**: Fuel usage tracking
- **DelayReason**: Delay tracking dengan categorization
- **ProductionRecord**: Daily production achievement
- **EquipmentStatusLog**: Equipment status history
- **PredictionLog**: ML prediction results
- **RecommendationLog**: ML recommendation history
- **ChatbotInteraction**: RAG chatbot conversations
- **SystemConfig**: System configuration

## Error Handling

API menggunakan standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "statusCode": 404
  }
}
```

Error Codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resources)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP

## Logging

Logs disimpan di:

- `logs/error.log` - Error logs
- `logs/combined.log` - All logs
- Console output (development mode)

## Testing

```bash
npm test
```

## Deployment

### Environment Variables Production

Set minimal variables berikut:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=strong-secret-key
JWT_REFRESH_SECRET=strong-refresh-key
FASTAPI_BASE_URL=https://ml-service.com/api
```

### Build untuk Production

```bash
npm install --production
npx prisma generate
npx prisma migrate deploy
```

### Process Management

Gunakan PM2 untuk production:

```bash
npm install -g pm2
pm2 start src/server.js --name mining-api
pm2 save
pm2 startup
```

## Integration dengan FastAPI ML Service

Backend ini terintegrasi dengan FastAPI service untuk fitur ML/AI:

- Delay risk prediction
- Equipment breakdown prediction
- Operational recommendations
- RAG-based chatbot

Pastikan FastAPI service berjalan di URL yang dikonfigurasi di `FASTAPI_BASE_URL`.

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL running
pg_isready

# Test connection
psql -U user -d mining_db -c "SELECT 1"
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change PORT in .env
```

### Prisma Client Not Generated

```bash
npx prisma generate
```

## License

Proprietary - ASAH Mining Operations 2025

## Contact

Untuk pertanyaan atau support, hubungi tim development.
