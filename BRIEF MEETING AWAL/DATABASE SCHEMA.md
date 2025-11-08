# DATABASE SCHEMA

```tsx
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// 1. USER MANAGEMENT & AUTHENTICATION
// ============================================

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String?  @unique
  password  String   // bcrypt hashed
  fullName  String
  role      Role     @default(SUPERVISOR)
  isActive  Boolean  @default(true)
  lastLogin DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  operatorProfile    Operator?
  haulingActivities  HaulingActivity[]
  incidentReports    IncidentReport[]
  
  @@map("users")
}

enum Role {
  ADMIN
  SUPERVISOR
  OPERATOR
  DISPATCHER
  MAINTENANCE_STAFF
}

// ============================================
// 2. MINING SITE & LOCATION MASTER DATA
// ============================================

model MiningSite {
  id          String   @id @default(cuid())
  code        String   @unique // "PIT-A", "PIT-B"
  name        String   // "Pit Alpha Utara"
  siteType    SiteType
  isActive    Boolean  @default(true)
  latitude    Float?
  longitude   Float?
  elevation   Float?   // meter above sea level
  capacity    Float?   // ton per hari (kapasitas produksi)
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  loadingPoints     LoadingPoint[]
  dumpingPoints     DumpingPoint[]
  roadSegments      RoadSegment[]
  weatherLogs       WeatherLog[]
  productionRecords ProductionRecord[]
  
  @@map("mining_sites")
}

enum SiteType {
  PIT              // Area penggalian
  STOCKPILE        // Area penumpukan
  CRUSHER          // Area crushing
  PORT             // Pelabuhan
  COAL_HAULING_ROAD // Jalan hauling
  ROM_PAD          // Run of Mine stockpile
}

model LoadingPoint {
  id            String     @id @default(cuid())
  code          String     @unique // "LP-A01"
  name          String     // "Loading Point Pit A - Zona 1"
  miningSiteId  String
  excavatorId   String?    // Excavator yang sedang beroperasi di loading point ini
  isActive      Boolean    @default(true)
  maxQueueSize  Int        @default(5) // Maksimal antrian hauler
  latitude      Float?
  longitude     Float?
  coalSeam      String?    // Lapisan batubara (Seam A, B, C)
  coalQuality   Json?      // {calori: 5500, ash: 8, sulfur: 0.5}
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  // Relations
  miningSite        MiningSite        @relation(fields: [miningSiteId], references: [id])
  excavator         Excavator?        @relation(fields: [excavatorId], references: [id])
  haulingActivities HaulingActivity[]
  queueLogs         QueueLog[]
  
  @@map("loading_points")
}

model DumpingPoint {
  id           String   @id @default(cuid())
  code         String   @unique // "DP-STK01"
  name         String   // "Dumping Point Stockpile Utara"
  miningSiteId String
  dumpingType  DumpingType
  isActive     Boolean  @default(true)
  capacity     Float?   // ton (kapasitas maksimal)
  currentStock Float    @default(0) // ton (stock saat ini)
  latitude     Float?
  longitude    Float?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Relations
  miningSite        MiningSite        @relation(fields: [miningSiteId], references: [id])
  haulingActivities HaulingActivity[]
  
  @@map("dumping_points")
}

enum DumpingType {
  STOCKPILE      // Penumpukan batubara
  CRUSHER        // Crushing plant
  WASTE_DUMP     // Pembuangan overburden
  ROM_STOCKPILE  // Run of Mine stockpile
  PORT           // Pelabuhan
}

model RoadSegment {
  id              String       @id @default(cuid())
  code            String       @unique // "RS-A01-STK"
  name            String       // "Jalan Pit A ke Stockpile"
  miningSiteId    String
  startPoint      String       // Loading point code atau lokasi
  endPoint        String       // Dumping point code atau lokasi
  distance        Float        // km
  roadCondition   RoadCondition @default(GOOD)
  maxSpeed        Int          @default(30) // km/h
  gradient        Float?       // % kemiringan jalan (untuk perhitungan konsumsi BBM)
  isActive        Boolean      @default(true)
  lastMaintenance DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  
  // Relations
  miningSite        MiningSite        @relation(fields: [miningSiteId], references: [id])
  haulingActivities HaulingActivity[]
  
  @@map("road_segments")
}

enum RoadCondition {
  EXCELLENT
  GOOD
  FAIR
  POOR
  CRITICAL
}

// ============================================
// 3. EQUIPMENT MASTER DATA
// ============================================

model Truck {
  id               String         @id @default(cuid())
  code             String         @unique // "H-001"
  name             String         // "Hauler Unit 1"
  brand            String?        // "Hino", "Scania", "Mitsubishi"
  model            String?        // "FM 260 JD"
  yearManufacture  Int?
  capacity         Float          // ton
  fuelCapacity     Float?         // liter
  status           TruckStatus    @default(IDLE)
  lastMaintenance  DateTime?
  nextMaintenance  DateTime?
  totalHours       Int            @default(0) // Jam operasi total (hour meter)
  totalDistance    Float          @default(0) // km
  currentOperatorId String?       // Operator yang sedang mengoperasikan
  currentLocation  String?        // Lokasi terakhir
  isActive         Boolean        @default(true)
  purchaseDate     DateTime?
  retirementDate   DateTime?
  remarks          String?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  
  // Relations
  currentOperator       Operator?          @relation(fields: [currentOperatorId], references: [id])
  haulingActivities     HaulingActivity[]
  maintenanceLogs       MaintenanceLog[]
  fuelConsumptions      FuelConsumption[]
  incidentReports       IncidentReport[]
  equipmentStatusLogs   EquipmentStatusLog[]
  
  @@map("trucks")
}

enum TruckStatus {
  IDLE              // Menganggur
  HAULING           // Sedang hauling
  LOADING           // Sedang loading
  DUMPING           // Sedang dumping
  IN_QUEUE          // Antri di loading point
  MAINTENANCE       // Maintenance terjadwal
  BREAKDOWN         // Breakdown/rusak
  REFUELING         // Sedang isi BBM
  STANDBY           // Standby (tidak dipakai tapi siap operasi)
  OUT_OF_SERVICE    // Tidak beroperasi (pensiun, rusak berat)
}

model Excavator {
  id               String            @id @default(cuid())
  code             String            @unique // "EX-01"
  name             String            // "Excavator Alpha"
  brand            String?           // "Komatsu", "Hitachi", "Caterpillar"
  model            String?           // "PC400"
  yearManufacture  Int?
  bucketCapacity   Float?            // m3
  status           ExcavatorStatus   @default(ACTIVE)
  lastMaintenance  DateTime?
  nextMaintenance  DateTime?
  totalHours       Int               @default(0) // Jam operasi total
  currentLocation  String?           // Loading point yang sedang dioperasikan
  isActive         Boolean           @default(true)
  purchaseDate     DateTime?
  retirementDate   DateTime?
  remarks          String?
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  
  // Relations
  loadingPoints         LoadingPoint[]
  haulingActivities     HaulingActivity[]
  maintenanceLogs       MaintenanceLog[]
  fuelConsumptions      FuelConsumption[]
  incidentReports       IncidentReport[]
  equipmentStatusLogs   EquipmentStatusLog[]
  
  @@map("excavators")
}

enum ExcavatorStatus {
  ACTIVE           // Beroperasi
  IDLE             // Tidak beroperasi tapi siap
  MAINTENANCE      // Maintenance terjadwal
  BREAKDOWN        // Breakdown/rusak
  STANDBY          // Standby
  OUT_OF_SERVICE   // Tidak beroperasi
}

model SupportEquipment {
  id               String                  @id @default(cuid())
  code             String                  @unique // "GR-01" (Grader), "WTR-01" (Water truck)
  name             String
  equipmentType    SupportEquipmentType
  brand            String?
  model            String?
  status           SupportEquipmentStatus  @default(ACTIVE)
  lastMaintenance  DateTime?
  totalHours       Int                     @default(0)
  isActive         Boolean                 @default(true)
  createdAt        DateTime                @default(now())
  updatedAt        DateTime                @updatedAt
  
  // Relations
  maintenanceLogs       MaintenanceLog[]
  fuelConsumptions      FuelConsumption[]
  equipmentStatusLogs   EquipmentStatusLog[]
  
  @@map("support_equipment")
}

enum SupportEquipmentType {
  GRADER          // Motor grader (perata jalan)
  WATER_TRUCK     // Truk air (penyiram jalan)
  FUEL_TRUCK      // Truk BBM
  DOZER           // Bulldozer
  COMPACTOR       // Compactor
  LIGHT_VEHICLE   // Kendaraan ringan (pickup, dll)
}

enum SupportEquipmentStatus {
  ACTIVE
  IDLE
  MAINTENANCE
  BREAKDOWN
  OUT_OF_SERVICE
}

// ============================================
// 4. OPERATOR & WORKFORCE
// ============================================

model Operator {
  id              String       @id @default(cuid())
  userId          String       @unique
  employeeNumber  String       @unique
  licenseNumber   String?      // Nomor SIM/sertifikat operator
  licenseType     LicenseType
  licenseExpiry   DateTime?
  competency      Json?        // {excavator: true, truck: true, grader: false}
  status          OperatorStatus @default(ACTIVE)
  shift           Shift?
  totalHours      Int          @default(0) // Total jam operasi
  rating          Float?       @default(5.0) // Rating performa (1-5)
  joinDate        DateTime
  resignDate      DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  
  // Relations
  user                  User                @relation(fields: [userId], references: [id])
  trucks                Truck[]
  haulingActivities     HaulingActivity[]
  incidentReports       IncidentReport[]
  
  @@map("operators")
}

enum LicenseType {
  SIM_A           // Mobil
  SIM_B1          // Truk/bus kecil
  SIM_B2          // Truk/bus besar
  OPERATOR_ALAT_BERAT  // Sertifikat operator alat berat
}

enum OperatorStatus {
  ACTIVE
  ON_LEAVE
  SICK
  RESIGNED
  SUSPENDED
}

enum Shift {
  SHIFT_1  // 07:00-15:00
  SHIFT_2  // 15:00-23:00
  SHIFT_3  // 23:00-07:00
}

// ============================================
// 5. OPERATIONAL DATA (HAULING & PRODUCTION)
// ============================================

model HaulingActivity {
  id                    String              @id @default(cuid())
  activityNumber        String              @unique // "HA-20250101-001"
  
  // Equipment
  truckId               String
  excavatorId           String
  operatorId            String
  supervisorId          String              // User supervisor yang memantau
  
  // Location & Route
  loadingPointId        String
  dumpingPointId        String
  roadSegmentId         String?
  
  // Timing
  shift                 Shift
  queueStartTime        DateTime?           // Mulai antri
  queueEndTime          DateTime?           // Selesai antri (mulai loading)
  loadingStartTime      DateTime
  loadingEndTime        DateTime?
  departureTime         DateTime?           // Berangkat dari loading point
  arrivalTime           DateTime?           // Tiba di dumping point
  dumpingStartTime      DateTime?
  dumpingEndTime        DateTime?
  returnTime            DateTime?           // Kembali ke base/loading point
  
  // Performance Metrics
  queueDuration         Int                 @default(0) // menit
  loadingDuration       Int                 @default(0) // menit
  haulingDuration       Int                 @default(0) // menit (dari loading ke dumping)
  dumpingDuration       Int                 @default(0) // menit
  returnDuration        Int                 @default(0) // menit
  totalCycleTime        Int                 @default(0) // menit (total waktu 1 siklus)
  
  // Load Details
  loadWeight            Float               // ton (actual)
  targetWeight          Float               // ton (target)
  loadEfficiency        Float?              // % (actual/target * 100)
  distance              Float               // km
  fuelConsumed          Float?              // liter
  
  // Status & Conditions
  status                HaulingStatus       @default(ONGOING)
  weatherCondition      String?             // Dari WeatherLog
  roadCondition         RoadCondition       @default(GOOD)
  
  // Delay Analysis
  isDelayed             Boolean             @default(false)
  delayMinutes          Int                 @default(0)
  delayReasonId         String?
  delayReasonDetail     String?             // Keterangan detail delay
  
  // AI/ML Predictions (optional, bisa null sebelum prediksi)
  predictedDelayRisk    String?             // "Low", "Medium", "High"
  predictedDelayMinutes Int?
  
  // Remarks
  remarks               String?
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
  
  // Relations
  truck         Truck           @relation(fields: [truckId], references: [id])
  excavator     Excavator       @relation(fields: [excavatorId], references: [id])
  operator      Operator        @relation(fields: [operatorId], references: [id])
  supervisor    User            @relation(fields: [supervisorId], references: [id])
  loadingPoint  LoadingPoint    @relation(fields: [loadingPointId], references: [id])
  dumpingPoint  DumpingPoint    @relation(fields: [dumpingPointId], references: [id])
  roadSegment   RoadSegment?    @relation(fields: [roadSegmentId], references: [id])
  delayReason   DelayReason?    @relation(fields: [delayReasonId], references: [id])
  
  @@index([truckId, loadingStartTime])
  @@index([shift, loadingStartTime])
  @@index([status])
  @@map("hauling_activities")
}

enum HaulingStatus {
  PLANNED         // Sudah dijadwalkan
  IN_QUEUE        // Antri di loading point
  LOADING         // Sedang loading
  HAULING         // Dalam perjalanan ke dumping
  DUMPING         // Sedang dumping
  RETURNING       // Kembali
  COMPLETED       // Selesai
  DELAYED         // Terlambat
  CANCELLED       // Dibatalkan
  INCIDENT        // Ada incident/kecelakaan
}

model QueueLog {
  id              String       @id @default(cuid())
  loadingPointId  String
  truckId         String?
  queueLength     Int          // Jumlah hauler dalam antrian
  queueStartTime  DateTime
  queueEndTime    DateTime?
  waitingTime     Int?         // menit
  timestamp       DateTime     @default(now())
  
  // Relations
  loadingPoint LoadingPoint @relation(fields: [loadingPointId], references: [id])
  
  @@index([loadingPointId, timestamp])
  @@map("queue_logs")
}

model ProductionRecord {
  id              String   @id @default(cuid())
  recordDate      DateTime @db.Date
  shift           Shift
  miningSiteId    String
  
  // Production
  targetProduction Float   // ton
  actualProduction Float   // ton
  achievement     Float    // % (actual/target * 100)
  
  // Coal Quality
  avgCalori       Float?   // kcal/kg
  avgAshContent   Float?   // %
  avgSulfur       Float?   // %
  avgMoisture     Float?   // %
  
  // Operational Summary
  totalTrips      Int      @default(0)
  totalDistance   Float    @default(0) // km
  totalFuel       Float    @default(0) // liter
  avgCycleTime    Float?   // menit
  
  // Equipment Usage
  trucksOperating Int      @default(0)
  trucksBreakdown Int      @default(0)
  excavatorsOperating Int  @default(0)
  excavatorsBreakdown Int  @default(0)
  
  // Efficiency
  utilizationRate Float?   // % (jam operasi / jam kerja * 100)
  downtimeHours   Float    @default(0)
  
  remarks         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  miningSite MiningSite @relation(fields: [miningSiteId], references: [id])
  
  @@unique([recordDate, shift, miningSiteId])
  @@index([recordDate])
  @@map("production_records")
}

// ============================================
// 6. WEATHER & ENVIRONMENTAL CONDITIONS
// ============================================

model WeatherLog {
  id            String        @id @default(cuid())
  timestamp     DateTime      @default(now())
  miningSiteId  String?
  
  // Weather Conditions
  condition     WeatherCondition
  temperature   Float?        // Celsius
  humidity      Float?        // %
  windSpeed     Float?        // km/h
  windDirection String?       // N, NE, E, SE, S, SW, W, NW
  rainfall      Float?        // mm
  visibility    Visibility    @default(GOOD)
  
  // Special Conditions (untuk tambang dekat laut/pelabuhan)
  waveHeight    Float?        // meter
  seaCondition  String?       // "Calm", "Moderate", "Rough"
  
  // Impact Assessment
  isOperational Boolean       @default(true) // Apakah kondisi memungkinkan operasi
  riskLevel     RiskLevel     @default(LOW)
  
  remarks       String?
  
  // Relations
  miningSite MiningSite? @relation(fields: [miningSiteId], references: [id])
  
  @@index([timestamp])
  @@index([miningSiteId, timestamp])
  @@map("weather_logs")
}

enum WeatherCondition {
  CERAH
  BERAWAN
  MENDUNG
  HUJAN_RINGAN
  HUJAN_SEDANG
  HUJAN_LEBAT
  BADAI
  KABUT
}

enum Visibility {
  EXCELLENT  // > 10 km
  GOOD       // 5-10 km
  MODERATE   // 2-5 km
  POOR       // 1-2 km
  VERY_POOR  // < 1 km
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

// ============================================
// 7. MAINTENANCE & BREAKDOWN
// ============================================

model MaintenanceLog {
  id                String            @id @default(cuid())
  maintenanceNumber String            @unique // "MNT-20250101-001"
  
  // Equipment (polymorphic - bisa truck, excavator, atau support equipment)
  truckId           String?
  excavatorId       String?
  supportEquipmentId String?
  
  // Maintenance Details
  maintenanceType   MaintenanceType
  scheduledDate     DateTime?
  actualDate        DateTime
  completionDate    DateTime?
  
  // Duration & Cost
  duration          Int?              // jam
  cost              Float?            // Rupiah
  
  // Details
  description       String
  partsReplaced     Json?             // [{part: "Filter oli", qty: 2, cost: 500000}]
  mechanicName      String?
  
  // Status
  status            MaintenanceStatus @default(SCHEDULED)
  
  // Impact
  downtimeHours     Float             @default(0)
  
  remarks           String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  // Relations
  truck             Truck?            @relation(fields: [truckId], references: [id])
  excavator         Excavator?        @relation(fields: [excavatorId], references: [id])
  supportEquipment  SupportEquipment? @relation(fields: [supportEquipmentId], references: [id])
  
  @@index([actualDate])
  @@index([status])
  @@map("maintenance_logs")
}

enum MaintenanceType {
  PREVENTIVE          // Maintenance terjadwal
  CORRECTIVE          // Perbaikan breakdown
  PREDICTIVE          // Maintenance berdasarkan prediksi ML
  OVERHAUL            // Overhaul total
  INSPECTION          // Inspeksi rutin
}

enum MaintenanceStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  DELAYED
}

model IncidentReport {
  id              String         @id @default(cuid())
  incidentNumber  String         @unique // "INC-20250101-001"
  incidentDate    DateTime
  reportDate      DateTime       @default(now())
  
  // Location
  location        String
  miningSiteCode  String?
  
  // Equipment Involved (bisa multiple)
  truckId         String?
  excavatorId     String?
  
  // People Involved
  reportedById    String         // User yang melaporkan
  operatorId      String?        // Operator yang terlibat
  
  // Incident Details
  incidentType    IncidentType
  severity        Severity
  description     String
  rootCause       String?
  
  // Impact
  injuries        Int            @default(0) // Jumlah korban luka
  fatalities      Int            @default(0) // Jumlah korban meninggal
  equipmentDamage String?
  productionLoss  Float?         // ton
  estimatedCost   Float?         // Rupiah
  downtimeHours   Float          @default(0)
  
  // Status & Actions
  status          IncidentStatus @default(REPORTED)
  actionTaken     String?
  preventiveMeasure String?
  
  // Attachments
  photos          Json?          // Array of photo URLs
  documents       Json?          // Array of document URLs
  
  remarks         String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  // Relations
  truck       Truck?    @relation(fields: [truckId], references: [id])
  excavator   Excavator? @relation(fields: [excavatorId], references: [id])
  reportedBy  User      @relation(fields: [reportedById], references: [id])
  operator    Operator? @relation(fields: [operatorId], references: [id])
  
  @@index([incidentDate])
  @@index([severity])
  @@map("incident_reports")
}

enum IncidentType {
  ACCIDENT           // Kecelakaan
  NEAR_MISS          // Hampir celaka
  EQUIPMENT_FAILURE  // Kegagalan alat
  SPILL              // Tumpahan (BBM, oli, dll)
  FIRE               // Kebakaran
  COLLISION          // Tabrakan
  ROLLOVER           // Terguling
  ENVIRONMENTAL      // Lingkungan (longsor, dll)
  SAFETY_VIOLATION   // Pelanggaran K3
}

enum Severity {
  LOW        // Ringan
  MEDIUM     // Sedang
  HIGH       // Berat
  CRITICAL   // Kritis/fatal
}

enum IncidentStatus {
  REPORTED       // Dilaporkan
  INVESTIGATING  // Dalam investigasi
  RESOLVED       // Diselesaikan
  CLOSED         // Ditutup
}

// ============================================
// 8. FUEL MANAGEMENT
// ============================================

model FuelConsumption {
  id                  String   @id @default(cuid())
  consumptionDate     DateTime
  
  // Equipment
  truckId             String?
  excavatorId         String?
  supportEquipmentId  String?
  
  // Fuel Details
  fuelType            FuelType
  quantity            Float    // liter
  costPerLiter        Float?   // Rupiah
  totalCost           Float?   // Rupiah
  
  // Performance
  operatingHours      Float?   // jam
  distance            Float?   // km (untuk truck)
  fuelEfficiency      Float?   // km/liter atau liter/jam
  
  // Location
  fuelStation         String?
  
  remarks             String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  // Relations
  truck             Truck?            @relation(fields: [truckId], references: [id])
  excavator         Excavator?        @relation(fields: [excavatorId], references: [id])
  supportEquipment  SupportEquipment? @relation(fields: [supportEquipmentId], references: [id])
  
  @@index([consumptionDate])
  @@map("fuel_consumptions")
}

enum FuelType {
  SOLAR      // Diesel/solar
  BENSIN     // Gasoline
  PERTAMAX   // Premium gasoline
}

// ============================================
// 9. REFERENCE DATA (MASTER)
// ============================================

model DelayReason {
  id          String   @id @default(cuid())
  code        String   @unique // "DLY-WTH-01"
  category    DelayCategory
  name        String   // "Hujan Lebat"
  description String?
  isActive    Boolean  @default(true)
  
  // Relations
  haulingActivities HaulingActivity[]
  
  @@map("delay_reasons")
}

enum DelayCategory {
  WEATHER            // Cuaca
  EQUIPMENT          // Alat rusak/maintenance
  QUEUE              // Antrian panjang
  ROAD               // Kondisi jalan
  OPERATOR           // Operator (istirahat, pergantian shift)
  FUEL               // BBM habis
  ADMINISTRATIVE     // Administratif
  SAFETY             // Keselamatan
  OTHER              // Lainnya
}

model EquipmentStatusLog {
  id                  String    @id @default(cuid())
  timestamp           DateTime  @default(now())
  
  // Equipment
  truckId             String?
  excavatorId         String?
  supportEquipmentId  String?
  
  // Status Change
  previousStatus      String
  currentStatus       String
  statusReason        String?
  
  // Location
  location            String?
  
  // Duration in previous status
  durationMinutes     Int?      // Berapa lama di status sebelumnya
  
  remarks             String?
  
  // Relations
  truck             Truck?            @relation(fields: [truckId], references: [id])
  excavator         Excavator?        @relation(fields: [excavatorId], references: [id])
  supportEquipment  SupportEquipment? @relation(fields: [supportEquipmentId], references: [id])
  
  @@index([timestamp])
  @@map("equipment_status_logs")
}

// ============================================
// 10. AI/ML LOGS & PREDICTIONS
// ============================================

model PredictionLog {
  id            String   @id @default(cuid())
  predictionId  String   @unique // "PRED-20250101-001"
  modelType     String   // "delay_risk", "breakdown_prediction"
  modelVersion  String?  // "v1.0.2"
  
  // Input Data (features yang dikirim ke model)
  inputData     Json     // {truckCode: "H-001", distance: 5.2, weather: "Hujan Lebat", ...}
  
  // Prediction Output
  prediction    Json     // {riskLevel: "High", estimatedDelay: 45, confidence: 0.87}
  confidence    Float?   // 0-1
  
  // Context
  contextData   Json?    // Data tambahan untuk audit (cuaca saat itu, status fleet, dll)
  
  // Evaluation (jika sudah ada actual)
  actualOutcome Json?    // Hasil aktual setelah prediksi dibuat
  isAccurate    Boolean? // Apakah prediksi akurat
  
  timestamp     DateTime @default(now())
  
  @@index([timestamp])
  @@index([modelType])
  @@map("prediction_logs")
}

model RecommendationLog {
  id                String              @id @default(cuid())
  recommendationId  String              @unique // "REC-20250101-001"
  
  // Recommendation Details
  recommendation    String              // "Alokasikan Hauler H-003 ke Excavator EX-01"
  category          RecommendationCategory
  priority          Priority
  
  // Justification & Context
  justification     String              // Alasan detail
  contextData       Json?               // Data pendukung keputusan
  
  // Impact Estimation
  estimatedImpact   String?             // "Pengurangan downtime 45 menit, peningkatan efisiensi 12%"
  estimatedSavings  Float?              // Rupiah
  
  // Execution
  status            RecommendationStatus @default(PENDING)
  executedBy        String?             // User ID yang mengeksekusi
  executedAt        DateTime?
  
  // Evaluation
  actualImpact      String?             // Impact setelah dijalankan
  effectiveness     Float?              // 0-100% (seberapa efektif rekomendasi)
  
  remarks           String?
  timestamp         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  @@index([timestamp])
  @@index([status])
  @@map("recommendation_logs")
}

enum RecommendationCategory {
  ALLOCATION         // Alokasi hauler
  MAINTENANCE        // Maintenance scheduling
  ROUTE_OPTIMIZATION // Optimasi rute
  FUEL_EFFICIENCY    // Efisiensi BBM
  SAFETY             // Keselamatan
  PRODUCTION         // Produksi
  COST_REDUCTION     // Pengurangan biaya
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum RecommendationStatus {
  PENDING       // Menunggu eksekusi
  EXECUTED      // Sudah dijalankan
  IGNORED       // Diabaikan
  EXPIRED       // Kadaluarsa (tidak relevan lagi)
  CANCELLED     // Dibatalkan
}

// ============================================
// 11. CHATBOT INTERACTION LOGS (untuk RAG)
// ============================================

model ChatbotInteraction {
  id              String   @id @default(cuid())
  sessionId       String   // Session ID untuk group conversation
  userId          String?  // User yang bertanya (bisa null untuk anonymous)
  
  // Query
  userQuery       String   // Pertanyaan user
  queryIntent     String?  // Intent yang terdeteksi (optional)
  
  // RAG Process
  retrievedContext Json?   // Context yang diambil dari DB untuk RAG
  sqlQuery        String?  // SQL query yang di-generate untuk RAG (untuk audit)
  
  // Response
  botResponse     String   // Jawaban dari chatbot
  responseSource  String?  // "database", "llm_knowledge", "hybrid"
  confidence      Float?   // Confidence score response
  
  // Performance
  responseTime    Int?     // Milliseconds
  tokensUsed      Int?     // Tokens yang digunakan LLM
  
  // Feedback
  userFeedback    String?  // "helpful", "not_helpful"
  feedbackComment String?
  
  timestamp       DateTime @default(now())
  
  @@index([sessionId])
  @@index([timestamp])
  @@map("chatbot_interactions")
}

// ============================================
// 12. SYSTEM CONFIGURATION
// ============================================

model SystemConfig {
  id          String   @id @default(cuid())
  configKey   String   @unique
  configValue String
  dataType    String   // "string", "number", "boolean", "json"
  category    String   // "operational", "ai", "notification", dll
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("system_configs")
}

// ============================================
// INDEXES & OPTIMIZATIONS
// ============================================

// Composite indexes untuk query optimization sudah ditambahkan di model yang relevan
// Contoh penting:
// - HaulingActivity: [truckId, loadingStartTime], [shift, loadingStartTime]
// - WeatherLog: [miningSiteId, timestamp]
// - PredictionLog: [modelType], [timestamp]
```