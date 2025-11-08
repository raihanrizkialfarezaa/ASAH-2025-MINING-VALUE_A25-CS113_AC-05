#  API Backend Architecture - Smart Mining DSS

##  Struktur Proyek

```
backend-express/
│
├── src/
│   ├── config/
│   │   ├── database.js              # Prisma client initialization
│   │   ├── env.js                   # Environment variables validation
│   │   ├── constants.js             # Application constants
│   │   └── logger.js                # Winston logger configuration
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT authentication
│   │   ├── rbac.middleware.js       # Role-based access control
│   │   ├── validate.middleware.js   # Request validation
│   │   ├── rateLimit.middleware.js  # Rate limiting
│   │   ├── cors.middleware.js       # CORS configuration
│   │   ├── error.middleware.js      # Global error handler
│   │   ├── logger.middleware.js     # Request/response logging
│   │   └── sanitize.middleware.js   # Input sanitization
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── truck.validator.js
│   │   ├── excavator.validator.js
│   │   ├── hauling.validator.js
│   │   ├── weather.validator.js
│   │   ├── maintenance.validator.js
│   │   ├── production.validator.js
│   │   └── common.validator.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── truck.controller.js
│   │   ├── excavator.controller.js
│   │   ├── supportEquipment.controller.js
│   │   ├── operator.controller.js
│   │   ├── miningSite.controller.js
│   │   ├── loadingPoint.controller.js
│   │   ├── dumpingPoint.controller.js
│   │   ├── roadSegment.controller.js
│   │   ├── hauling.controller.js
│   │   ├── queue.controller.js
│   │   ├── production.controller.js
│   │   ├── weather.controller.js
│   │   ├── maintenance.controller.js
│   │   ├── incident.controller.js
│   │   ├── fuel.controller.js
│   │   ├── delayReason.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── analytics.controller.js
│   │   ├── ml-proxy.controller.js
│   │   └── chatbot.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── truck.service.js
│   │   ├── excavator.service.js
│   │   ├── supportEquipment.service.js
│   │   ├── operator.service.js
│   │   ├── miningSite.service.js
│   │   ├── loadingPoint.service.js
│   │   ├── dumpingPoint.service.js
│   │   ├── roadSegment.service.js
│   │   ├── hauling.service.js
│   │   ├── queue.service.js
│   │   ├── production.service.js
│   │   ├── weather.service.js
│   │   ├── maintenance.service.js
│   │   ├── incident.service.js
│   │   ├── fuel.service.js
│   │   ├── delayReason.service.js
│   │   ├── dashboard.service.js
│   │   ├── analytics.service.js
│   │   ├── ml-proxy.service.js
│   │   ├── notification.service.js
│   │   └── cache.service.js
│   │
│   ├── routes/
│   │   ├── index.js                 # Route aggregator
│   │   ├── v1/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── equipment.routes.js  # Trucks, excavators, support
│   │   │   ├── location.routes.js   # Sites, loading/dumping points, roads
│   │   │   ├── operation.routes.js  # Hauling, queue, production
│   │   │   ├── maintenance.routes.js
│   │   │   ├── incident.routes.js
│   │   │   ├── fuel.routes.js
│   │   │   ├── weather.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── ml-proxy.routes.js
│   │   │   └── chatbot.routes.js
│   │   └── health.routes.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js           # Standardized response format
│   │   ├── apiError.js              # Custom error classes
│   │   ├── catchAsync.js            # Async error wrapper
│   │   ├── pagination.js            # Pagination helper
│   │   ├── dateHelper.js            # Date utilities
│   │   ├── encryption.js            # Bcrypt utilities
│   │   ├── jwt.js                   # JWT utilities
│   │   ├── fileUpload.js            # File upload handler
│   │   └── calculation.js           # Business calculations
│   │
│   ├── types/
│   │   ├── enums.js                 # Application enums
│   │   └── interfaces.js            # TypeScript-style interfaces (JSDoc)
│   │
│   ├── app.js                       # Express app setup
│   └── server.js                    # Server entry point
│
├── prisma/
│   ├── schema.prisma                # Database schema (sudah ada)
│   ├── migrations/                  # Auto-generated migrations
│   ├── seed/
│   │   ├── seed.js                  # Main seeder
│   │   ├── users.seed.js
│   │   ├── equipment.seed.js
│   │   ├── locations.seed.js
│   │   ├── operators.seed.js
│   │   ├── hauling.seed.js
│   │   └── weather.seed.js
│   └── seed-data/                   # CSV/JSON seed data
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   ├── utils/
│   │   └── middleware/
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── equipment.test.js
│   │   ├── hauling.test.js
│   │   └── ml-proxy.test.js
│   └── setup.js
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT.md
│   └── postman/
│       └── mining-dss.postman_collection.json
│
├── .env.example
├── .env.development
├── .env.production
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── package.json
├── netlify.toml                     # Netlify Functions config
└── README.md
```

---

## 🔌 API Endpoints (Complete RESTful API)

### Base URL
- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://your-app.netlify.app/api/v1`

---

##  1. Authentication & User Management

### Authentication
```http
POST   /auth/register              # Register new user
POST   /auth/login                 # Login
POST   /auth/logout                # Logout
POST   /auth/refresh-token         # Refresh JWT token
POST   /auth/forgot-password       # Request password reset
POST   /auth/reset-password        # Reset password with token
GET    /auth/me                    # Get current user profile
PUT    /auth/change-password       # Change password
```

### Users
```http
GET    /users                      # List all users (ADMIN only)
GET    /users/:id                  # Get user by ID
POST   /users                      # Create user (ADMIN only)
PUT    /users/:id                  # Update user
DELETE /users/:id                  # Soft delete user (ADMIN only)
GET    /users/:id/activity-log     # Get user activity log
PUT    /users/:id/activate         # Activate user
PUT    /users/:id/deactivate       # Deactivate user
```

---

##  2. Equipment Management

### Trucks
```http
GET    /equipment/trucks                    # List all trucks
GET    /equipment/trucks/:id                # Get truck detail
POST   /equipment/trucks                    # Create truck
PUT    /equipment/trucks/:id                # Update truck
DELETE /equipment/trucks/:id                # Delete truck
PATCH  /equipment/trucks/:id/status         # Update truck status
GET    /equipment/trucks/status/:status     # Filter by status (idle, hauling, etc.)
GET    /equipment/trucks/:id/history        # Get truck operation history
GET    /equipment/trucks/:id/performance    # Get truck performance metrics
GET    /equipment/trucks/:id/maintenance    # Get truck maintenance schedule
POST   /equipment/trucks/:id/assign-operator # Assign operator to truck
```

### Excavators
```http
GET    /equipment/excavators                # List all excavators
GET    /equipment/excavators/:id            # Get excavator detail
POST   /equipment/excavators                # Create excavator
PUT    /equipment/excavators/:id            # Update excavator
DELETE /equipment/excavators/:id            # Delete excavator
PATCH  /equipment/excavators/:id/status     # Update status
GET    /equipment/excavators/:id/loading-points # Get assigned loading points
GET    /equipment/excavators/:id/queue      # Get current queue at excavator
GET    /equipment/excavators/:id/performance # Performance metrics
```

### Support Equipment
```http
GET    /equipment/support                   # List support equipment
GET    /equipment/support/:id               # Get detail
POST   /equipment/support                   # Create
PUT    /equipment/support/:id               # Update
DELETE /equipment/support/:id               # Delete
GET    /equipment/support/type/:type        # Filter by type (grader, water truck, etc.)
```

### Equipment Analytics
```http
GET    /equipment/analytics/utilization     # Equipment utilization rate
GET    /equipment/analytics/breakdown       # Breakdown analysis
GET    /equipment/analytics/comparison      # Compare equipment performance
GET    /equipment/status-logs               # Equipment status change logs
```

---

##  3. Workforce Management

### Operators
```http
GET    /operators                           # List all operators
GET    /operators/:id                       # Get operator detail
POST   /operators                           # Create operator
PUT    /operators/:id                       # Update operator
DELETE /operators/:id                       # Delete operator
GET    /operators/available                 # Get available operators
GET    /operators/:id/performance           # Operator performance metrics
GET    /operators/:id/schedule              # Operator shift schedule
GET    /operators/shift/:shift              # Filter by shift
PUT    /operators/:id/status                # Update operator status
GET    /operators/:id/hauling-history       # Hauling history
```

---

##  4. Location & Site Management

### Mining Sites
```http
GET    /locations/sites                     # List mining sites
GET    /locations/sites/:id                 # Get site detail
POST   /locations/sites                     # Create site
PUT    /locations/sites/:id                 # Update site
DELETE /locations/sites/:id                 # Delete site
GET    /locations/sites/:id/production      # Site production data
GET    /locations/sites/type/:type          # Filter by site type
```

### Loading Points
```http
GET    /locations/loading-points            # List loading points
GET    /locations/loading-points/:id        # Get detail
POST   /locations/loading-points            # Create
PUT    /locations/loading-points/:id        # Update
DELETE /locations/loading-points/:id        # Delete
GET    /locations/loading-points/:id/queue  # Current queue
GET    /locations/loading-points/:id/coal-quality # Coal quality info
PATCH  /locations/loading-points/:id/excavator # Assign excavator
```

### Dumping Points
```http
GET    /locations/dumping-points            # List dumping points
GET    /locations/dumping-points/:id        # Get detail
POST   /locations/dumping-points            # Create
PUT    /locations/dumping-points/:id        # Update
DELETE /locations/dumping-points/:id        # Delete
GET    /locations/dumping-points/:id/stock  # Current stock level
PATCH  /locations/dumping-points/:id/stock  # Update stock
```

### Road Segments
```http
GET    /locations/road-segments             # List road segments
GET    /locations/road-segments/:id         # Get detail
POST   /locations/road-segments             # Create
PUT    /locations/road-segments/:id         # Update
DELETE /locations/road-segments/:id         # Delete
PATCH  /locations/road-segments/:id/condition # Update road condition
GET    /locations/road-segments/critical    # Get roads in critical condition
```

---

##  5. Operational Data (Core)

### Hauling Activities
```http
GET    /operations/hauling                  # List hauling activities
GET    /operations/hauling/:id              # Get detail
POST   /operations/hauling/start            # Start new hauling activity
PUT    /operations/hauling/:id/loading-complete # Complete loading
PUT    /operations/hauling/:id/dumping-complete # Complete dumping
PUT    /operations/hauling/:id/complete     # Complete entire cycle
PUT    /operations/hauling/:id/cancel       # Cancel activity
GET    /operations/hauling/active           # Get active hauling
GET    /operations/hauling/delayed          # Get delayed activities
GET    /operations/hauling/stats            # Statistics (avg cycle time, delay rate)
GET    /operations/hauling/shift/:shift     # Filter by shift
POST   /operations/hauling/:id/add-delay    # Log delay reason
GET    /operations/hauling/truck/:truckId   # Hauling by truck
GET    /operations/hauling/date-range       # Filter by date range
```

### Queue Management
```http
GET    /operations/queue                    # Current queue status all loading points
GET    /operations/queue/:loadingPointId    # Queue at specific loading point
POST   /operations/queue/add                # Add truck to queue
PUT    /operations/queue/:id/remove         # Remove from queue
GET    /operations/queue/logs               # Queue history logs
GET    /operations/queue/analytics          # Queue analytics (avg wait time)
```

### Production Records
```http
GET    /operations/production               # List production records
GET    /operations/production/:id           # Get detail
POST   /operations/production               # Create production record
PUT    /operations/production/:id           # Update record
DELETE /operations/production/:id           # Delete record
GET    /operations/production/date/:date    # Production by date
GET    /operations/production/site/:siteId  # Production by site
GET    /operations/production/summary       # Production summary (daily/weekly/monthly)
GET    /operations/production/achievement   # Production achievement vs target
```

---

##  6. Weather Management

### Weather Logs
```http
GET    /weather                             # List weather logs
GET    /weather/:id                         # Get detail
POST   /weather                             # Create weather log
PUT    /weather/:id                         # Update
DELETE /weather/:id                         # Delete
GET    /weather/latest                      # Latest weather
GET    /weather/site/:siteId                # Weather at specific site
GET    /weather/forecast                    # Weather forecast (jika ada integrasi)
GET    /weather/risk-assessment             # Weather risk assessment
GET    /weather/history                     # Weather history (for ML training)
```

---

##  7. Maintenance Management

### Maintenance Logs
```http
GET    /maintenance                         # List maintenance logs
GET    /maintenance/:id                     # Get detail
POST   /maintenance                         # Create maintenance log
PUT    /maintenance/:id                     # Update
DELETE /maintenance/:id                     # Delete
GET    /maintenance/scheduled               # Scheduled maintenance
GET    /maintenance/overdue                 # Overdue maintenance
GET    /maintenance/equipment/:equipmentId  # Maintenance by equipment
POST   /maintenance/:id/complete            # Mark as completed
GET    /maintenance/analytics               # Maintenance analytics
GET    /maintenance/cost-summary            # Maintenance cost summary
```

---

##  8. Incident Management

### Incident Reports
```http
GET    /incidents                           # List incident reports
GET    /incidents/:id                       # Get detail
POST   /incidents                           # Create incident report
PUT    /incidents/:id                       # Update
DELETE /incidents/:id                       # Delete
GET    /incidents/severity/:severity        # Filter by severity
GET    /incidents/type/:type                # Filter by type
GET    /incidents/status/:status            # Filter by status
POST   /incidents/:id/investigate           # Start investigation
POST   /incidents/:id/resolve               # Resolve incident
GET    /incidents/analytics                 # Incident analytics
GET    /incidents/trending                  # Trending incidents
```

---

##  9. Fuel Management

### Fuel Consumption
```http
GET    /fuel/consumption                    # List fuel consumption records
GET    /fuel/consumption/:id                # Get detail
POST   /fuel/consumption                    # Log fuel consumption
PUT    /fuel/consumption/:id                # Update
DELETE /fuel/consumption/:id                # Delete
GET    /fuel/consumption/equipment/:equipmentId # Fuel by equipment
GET    /fuel/consumption/analytics          # Fuel analytics
GET    /fuel/consumption/efficiency         # Fuel efficiency analysis
GET    /fuel/consumption/cost               # Fuel cost summary
GET    /fuel/consumption/date-range         # Filter by date range
```

---

##  10. Dashboard & Analytics

### Dashboard
```http
GET    /dashboard/overview                  # Dashboard overview
GET    /dashboard/real-time                 # Real-time operational data
GET    /dashboard/kpi                       # Key Performance Indicators
GET    /dashboard/alerts                    # System alerts
GET    /dashboard/equipment-status          # Equipment status summary
GET    /dashboard/production-today          # Today's production
GET    /dashboard/delay-summary             # Delay summary
```

### Analytics
```http
GET    /analytics/operational-efficiency    # Operational efficiency metrics
GET    /analytics/equipment-utilization     # Equipment utilization
GET    /analytics/delay-analysis            # Delay root cause analysis
GET    /analytics/cost-analysis             # Cost breakdown analysis
GET    /analytics/production-trends         # Production trends
GET    /analytics/fuel-efficiency           # Fuel efficiency trends
GET    /analytics/maintenance-trends        # Maintenance patterns
GET    /analytics/custom-report             # Generate custom report
POST   /analytics/export                    # Export analytics data (CSV/Excel)
```

---

##  11. ML/AI Proxy Endpoints

### Predictions
```http
POST   /ml/predict/delay-risk               # Predict hauling delay risk
POST   /ml/predict/breakdown                # Predict equipment breakdown
POST   /ml/predict/fuel-consumption         # Predict fuel consumption
POST   /ml/predict/production               # Predict production output
GET    /ml/models/info                      # ML models information
GET    /ml/models/accuracy                  # Model accuracy metrics
```

### Recommendations
```http
POST   /ml/recommend/allocation             # Get allocation recommendation
POST   /ml/recommend/maintenance            # Get maintenance recommendation
POST   /ml/recommend/route-optimization     # Route optimization
GET    /ml/recommendations/history          # Recommendation history
PUT    /ml/recommendations/:id/execute      # Mark recommendation as executed
PUT    /ml/recommendations/:id/ignore       # Ignore recommendation
GET    /ml/recommendations/:id/impact       # Get recommendation impact
```

---

##  12. AI Chatbot with RAG

### Chatbot
```http
POST   /chatbot/query                       # Send query to chatbot
GET    /chatbot/sessions                    # List chat sessions
GET    /chatbot/sessions/:sessionId         # Get session history
POST   /chatbot/sessions                    # Create new session
DELETE /chatbot/sessions/:sessionId         # Delete session
POST   /chatbot/feedback                    # Submit feedback
GET    /chatbot/analytics                   # Chatbot usage analytics
```

---

##  13. Reference Data (Master)

### Delay Reasons
```http
GET    /reference/delay-reasons             # List delay reasons
GET    /reference/delay-reasons/:id         # Get detail
POST   /reference/delay-reasons             # Create
PUT    /reference/delay-reasons/:id         # Update
DELETE /reference/delay-reasons/:id         # Delete
GET    /reference/delay-reasons/category/:category # Filter by category
```

### System Configuration
```http
GET    /config                              # List system configs
GET    /config/:key                         # Get config by key
PUT    /config/:key                         # Update config
GET    /config/category/:category           # Get configs by category
```

---

##  14. Health & Monitoring

### Health Checks
```http
GET    /health                              # API health check
GET    /health/database                     # Database connection check
GET    /health/ml-service                   # ML service health check
GET    /health/detailed                     # Detailed health report
```

---

##  15. Audit & Logs

### System Logs
```http
GET    /logs/api                            # API access logs
GET    /logs/errors                         # Error logs
GET    /logs/predictions                    # ML prediction logs
GET    /logs/recommendations                # Recommendation logs
GET    /logs/equipment-status               # Equipment status change logs
```

---

##  Authorization Matrix

| Endpoint Category | ADMIN | SUPERVISOR | OPERATOR | DISPATCHER | MAINTENANCE |
|------------------|-------|------------|----------|------------|-------------|
| User Management | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| Equipment (Read) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Equipment (Write) | ✅ | ✅ | ❌ | ❌ | ✅ |
| Hauling (Read) | ✅ | ✅ | ✅ (own) | ✅ | ❌ |
| Hauling (Write) | ✅ | ✅ | ✅ (own) | ✅ | ❌ |
| Production | ✅ | ✅ | ❌ | ❌ | ❌ |
| Maintenance (Read) | ✅ | ✅ | ❌ | ❌ | ✅ |
| Maintenance (Write) | ✅ | ✅ | ❌ | ❌ | ✅ |
| Incidents | ✅ | ✅ | ✅ (report) | ✅ | ✅ |
| Analytics | ✅ | ✅ | ❌ | ✅ | ❌ |
| ML/AI | ✅ | ✅ | ❌ | ✅ | ❌ |
| Config | ✅ | ❌ | ❌ | ❌ | ❌ |

---

##  Request/Response Formats

### Standard Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2025-11-06T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "totalItems": 100,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2025-11-06T12:00:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "capacity",
        "message": "Capacity must be a positive number"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-11-06T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

---

##  Query Parameters (Common)

### Pagination
```
?page=1&limit=20&sort=createdAt&order=desc
```

### Filtering
```
?status=IDLE&isActive=true&minCapacity=40&maxCapacity=60
```

### Date Range
```
?startDate=2025-01-01&endDate=2025-01-31
```

### Search
```
?search=hauler&searchFields=name,code
```

### Include Relations
```
?include=operator,loadingPoint,dumpingPoint
```
