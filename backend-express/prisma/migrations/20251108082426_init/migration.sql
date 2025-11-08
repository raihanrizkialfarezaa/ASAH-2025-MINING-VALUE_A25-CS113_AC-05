-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPERVISOR', 'OPERATOR', 'DISPATCHER', 'MAINTENANCE_STAFF');

-- CreateEnum
CREATE TYPE "SiteType" AS ENUM ('PIT', 'STOCKPILE', 'CRUSHER', 'PORT', 'COAL_HAULING_ROAD', 'ROM_PAD');

-- CreateEnum
CREATE TYPE "DumpingType" AS ENUM ('STOCKPILE', 'CRUSHER', 'WASTE_DUMP', 'ROM_STOCKPILE', 'PORT');

-- CreateEnum
CREATE TYPE "RoadCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TruckStatus" AS ENUM ('IDLE', 'HAULING', 'LOADING', 'DUMPING', 'IN_QUEUE', 'MAINTENANCE', 'BREAKDOWN', 'REFUELING', 'STANDBY', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "ExcavatorStatus" AS ENUM ('ACTIVE', 'IDLE', 'MAINTENANCE', 'BREAKDOWN', 'STANDBY', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "SupportEquipmentType" AS ENUM ('GRADER', 'WATER_TRUCK', 'FUEL_TRUCK', 'DOZER', 'COMPACTOR', 'LIGHT_VEHICLE');

-- CreateEnum
CREATE TYPE "SupportEquipmentStatus" AS ENUM ('ACTIVE', 'IDLE', 'MAINTENANCE', 'BREAKDOWN', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('SIM_A', 'SIM_B1', 'SIM_B2', 'OPERATOR_ALAT_BERAT');

-- CreateEnum
CREATE TYPE "OperatorStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'SICK', 'RESIGNED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('SHIFT_1', 'SHIFT_2', 'SHIFT_3');

-- CreateEnum
CREATE TYPE "HaulingStatus" AS ENUM ('PLANNED', 'IN_QUEUE', 'LOADING', 'HAULING', 'DUMPING', 'RETURNING', 'COMPLETED', 'DELAYED', 'CANCELLED', 'INCIDENT');

-- CreateEnum
CREATE TYPE "WeatherCondition" AS ENUM ('CERAH', 'BERAWAN', 'MENDUNG', 'HUJAN_RINGAN', 'HUJAN_SEDANG', 'HUJAN_LEBAT', 'BADAI', 'KABUT');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('EXCELLENT', 'GOOD', 'MODERATE', 'POOR', 'VERY_POOR');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'OVERHAUL', 'INSPECTION');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DELAYED');

-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('ACCIDENT', 'NEAR_MISS', 'EQUIPMENT_FAILURE', 'SPILL', 'FIRE', 'COLLISION', 'ROLLOVER', 'ENVIRONMENTAL', 'SAFETY_VIOLATION');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('REPORTED', 'INVESTIGATING', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('SOLAR', 'BENSIN', 'PERTAMAX');

-- CreateEnum
CREATE TYPE "DelayCategory" AS ENUM ('WEATHER', 'EQUIPMENT', 'QUEUE', 'ROAD', 'OPERATOR', 'FUEL', 'ADMINISTRATIVE', 'SAFETY', 'OTHER');

-- CreateEnum
CREATE TYPE "RecommendationCategory" AS ENUM ('ALLOCATION', 'MAINTENANCE', 'ROUTE_OPTIMIZATION', 'FUEL_EFFICIENCY', 'SAFETY', 'PRODUCTION', 'COST_REDUCTION');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('PENDING', 'EXECUTED', 'IGNORED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SUPERVISOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mining_sites" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siteType" "SiteType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "elevation" DOUBLE PRECISION,
    "capacity" DOUBLE PRECISION,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mining_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loading_points" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "miningSiteId" TEXT NOT NULL,
    "excavatorId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxQueueSize" INTEGER NOT NULL DEFAULT 5,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "coalSeam" TEXT,
    "coalQuality" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loading_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dumping_points" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "miningSiteId" TEXT NOT NULL,
    "dumpingType" "DumpingType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "capacity" DOUBLE PRECISION,
    "currentStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dumping_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "road_segments" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "miningSiteId" TEXT NOT NULL,
    "startPoint" TEXT NOT NULL,
    "endPoint" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "roadCondition" "RoadCondition" NOT NULL DEFAULT 'GOOD',
    "maxSpeed" INTEGER NOT NULL DEFAULT 30,
    "gradient" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastMaintenance" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "road_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trucks" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "yearManufacture" INTEGER,
    "capacity" DOUBLE PRECISION NOT NULL,
    "fuelCapacity" DOUBLE PRECISION,
    "status" "TruckStatus" NOT NULL DEFAULT 'IDLE',
    "lastMaintenance" TIMESTAMP(3),
    "nextMaintenance" TIMESTAMP(3),
    "totalHours" INTEGER NOT NULL DEFAULT 0,
    "totalDistance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentOperatorId" TEXT,
    "currentLocation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "purchaseDate" TIMESTAMP(3),
    "retirementDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trucks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excavators" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "yearManufacture" INTEGER,
    "bucketCapacity" DOUBLE PRECISION,
    "status" "ExcavatorStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastMaintenance" TIMESTAMP(3),
    "nextMaintenance" TIMESTAMP(3),
    "totalHours" INTEGER NOT NULL DEFAULT 0,
    "currentLocation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "purchaseDate" TIMESTAMP(3),
    "retirementDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "excavators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_equipment" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "equipmentType" "SupportEquipmentType" NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "status" "SupportEquipmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastMaintenance" TIMESTAMP(3),
    "totalHours" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operators" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "licenseType" "LicenseType" NOT NULL,
    "licenseExpiry" TIMESTAMP(3),
    "competency" JSONB,
    "status" "OperatorStatus" NOT NULL DEFAULT 'ACTIVE',
    "shift" "Shift",
    "totalHours" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 5.0,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "resignDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hauling_activities" (
    "id" TEXT NOT NULL,
    "activityNumber" TEXT NOT NULL,
    "truckId" TEXT NOT NULL,
    "excavatorId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "loadingPointId" TEXT NOT NULL,
    "dumpingPointId" TEXT NOT NULL,
    "roadSegmentId" TEXT,
    "shift" "Shift" NOT NULL,
    "queueStartTime" TIMESTAMP(3),
    "queueEndTime" TIMESTAMP(3),
    "loadingStartTime" TIMESTAMP(3) NOT NULL,
    "loadingEndTime" TIMESTAMP(3),
    "departureTime" TIMESTAMP(3),
    "arrivalTime" TIMESTAMP(3),
    "dumpingStartTime" TIMESTAMP(3),
    "dumpingEndTime" TIMESTAMP(3),
    "returnTime" TIMESTAMP(3),
    "queueDuration" INTEGER NOT NULL DEFAULT 0,
    "loadingDuration" INTEGER NOT NULL DEFAULT 0,
    "haulingDuration" INTEGER NOT NULL DEFAULT 0,
    "dumpingDuration" INTEGER NOT NULL DEFAULT 0,
    "returnDuration" INTEGER NOT NULL DEFAULT 0,
    "totalCycleTime" INTEGER NOT NULL DEFAULT 0,
    "loadWeight" DOUBLE PRECISION NOT NULL,
    "targetWeight" DOUBLE PRECISION NOT NULL,
    "loadEfficiency" DOUBLE PRECISION,
    "distance" DOUBLE PRECISION NOT NULL,
    "fuelConsumed" DOUBLE PRECISION,
    "status" "HaulingStatus" NOT NULL DEFAULT 'LOADING',
    "weatherCondition" TEXT,
    "roadCondition" "RoadCondition" NOT NULL DEFAULT 'GOOD',
    "isDelayed" BOOLEAN NOT NULL DEFAULT false,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "delayReasonId" TEXT,
    "delayReasonDetail" TEXT,
    "predictedDelayRisk" TEXT,
    "predictedDelayMinutes" INTEGER,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hauling_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queue_logs" (
    "id" TEXT NOT NULL,
    "loadingPointId" TEXT NOT NULL,
    "truckId" TEXT,
    "queueLength" INTEGER NOT NULL,
    "queueStartTime" TIMESTAMP(3) NOT NULL,
    "queueEndTime" TIMESTAMP(3),
    "waitingTime" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "queue_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_records" (
    "id" TEXT NOT NULL,
    "recordDate" DATE NOT NULL,
    "shift" "Shift" NOT NULL,
    "miningSiteId" TEXT NOT NULL,
    "targetProduction" DOUBLE PRECISION NOT NULL,
    "actualProduction" DOUBLE PRECISION NOT NULL,
    "achievement" DOUBLE PRECISION NOT NULL,
    "avgCalori" DOUBLE PRECISION,
    "avgAshContent" DOUBLE PRECISION,
    "avgSulfur" DOUBLE PRECISION,
    "avgMoisture" DOUBLE PRECISION,
    "totalTrips" INTEGER NOT NULL DEFAULT 0,
    "totalDistance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFuel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgCycleTime" DOUBLE PRECISION,
    "trucksOperating" INTEGER NOT NULL DEFAULT 0,
    "trucksBreakdown" INTEGER NOT NULL DEFAULT 0,
    "excavatorsOperating" INTEGER NOT NULL DEFAULT 0,
    "excavatorsBreakdown" INTEGER NOT NULL DEFAULT 0,
    "utilizationRate" DOUBLE PRECISION,
    "downtimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_logs" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "miningSiteId" TEXT,
    "condition" "WeatherCondition" NOT NULL,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "windSpeed" DOUBLE PRECISION,
    "windDirection" TEXT,
    "rainfall" DOUBLE PRECISION,
    "visibility" "Visibility" NOT NULL DEFAULT 'GOOD',
    "waveHeight" DOUBLE PRECISION,
    "seaCondition" TEXT,
    "isOperational" BOOLEAN NOT NULL DEFAULT true,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "remarks" TEXT,

    CONSTRAINT "weather_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_logs" (
    "id" TEXT NOT NULL,
    "maintenanceNumber" TEXT NOT NULL,
    "truckId" TEXT,
    "excavatorId" TEXT,
    "supportEquipmentId" TEXT,
    "maintenanceType" "MaintenanceType" NOT NULL,
    "scheduledDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3) NOT NULL,
    "completionDate" TIMESTAMP(3),
    "duration" INTEGER,
    "cost" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "partsReplaced" JSONB,
    "mechanicName" TEXT,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "downtimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_reports" (
    "id" TEXT NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "miningSiteCode" TEXT,
    "truckId" TEXT,
    "excavatorId" TEXT,
    "reportedById" TEXT NOT NULL,
    "operatorId" TEXT,
    "incidentType" "IncidentType" NOT NULL,
    "severity" "Severity" NOT NULL,
    "description" TEXT NOT NULL,
    "rootCause" TEXT,
    "injuries" INTEGER NOT NULL DEFAULT 0,
    "fatalities" INTEGER NOT NULL DEFAULT 0,
    "equipmentDamage" TEXT,
    "productionLoss" DOUBLE PRECISION,
    "estimatedCost" DOUBLE PRECISION,
    "downtimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "IncidentStatus" NOT NULL DEFAULT 'REPORTED',
    "actionTaken" TEXT,
    "preventiveMeasure" TEXT,
    "photos" JSONB,
    "documents" JSONB,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incident_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_consumptions" (
    "id" TEXT NOT NULL,
    "consumptionDate" TIMESTAMP(3) NOT NULL,
    "truckId" TEXT,
    "excavatorId" TEXT,
    "supportEquipmentId" TEXT,
    "fuelType" "FuelType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "costPerLiter" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "operatingHours" DOUBLE PRECISION,
    "distance" DOUBLE PRECISION,
    "fuelEfficiency" DOUBLE PRECISION,
    "fuelStation" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fuel_consumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delay_reasons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" "DelayCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "delay_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_status_logs" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "truckId" TEXT,
    "excavatorId" TEXT,
    "supportEquipmentId" TEXT,
    "previousStatus" TEXT NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "statusReason" TEXT,
    "location" TEXT,
    "durationMinutes" INTEGER,
    "remarks" TEXT,

    CONSTRAINT "equipment_status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction_logs" (
    "id" TEXT NOT NULL,
    "predictionId" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "modelVersion" TEXT,
    "inputData" JSONB NOT NULL,
    "prediction" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION,
    "contextData" JSONB,
    "actualOutcome" JSONB,
    "isAccurate" BOOLEAN,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prediction_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_logs" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "category" "RecommendationCategory" NOT NULL,
    "priority" "Priority" NOT NULL,
    "justification" TEXT NOT NULL,
    "contextData" JSONB,
    "estimatedImpact" TEXT,
    "estimatedSavings" DOUBLE PRECISION,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'PENDING',
    "executedBy" TEXT,
    "executedAt" TIMESTAMP(3),
    "actualImpact" TEXT,
    "effectiveness" DOUBLE PRECISION,
    "remarks" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_interactions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "userQuery" TEXT NOT NULL,
    "queryIntent" TEXT,
    "retrievedContext" JSONB,
    "sqlQuery" TEXT,
    "botResponse" TEXT NOT NULL,
    "responseSource" TEXT,
    "confidence" DOUBLE PRECISION,
    "responseTime" INTEGER,
    "tokensUsed" INTEGER,
    "userFeedback" TEXT,
    "feedbackComment" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configs" (
    "id" TEXT NOT NULL,
    "configKey" TEXT NOT NULL,
    "configValue" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mining_sites_code_key" ON "mining_sites"("code");

-- CreateIndex
CREATE UNIQUE INDEX "loading_points_code_key" ON "loading_points"("code");

-- CreateIndex
CREATE UNIQUE INDEX "dumping_points_code_key" ON "dumping_points"("code");

-- CreateIndex
CREATE UNIQUE INDEX "road_segments_code_key" ON "road_segments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "trucks_code_key" ON "trucks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "excavators_code_key" ON "excavators"("code");

-- CreateIndex
CREATE UNIQUE INDEX "support_equipment_code_key" ON "support_equipment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "operators_userId_key" ON "operators"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "operators_employeeNumber_key" ON "operators"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "hauling_activities_activityNumber_key" ON "hauling_activities"("activityNumber");

-- CreateIndex
CREATE INDEX "hauling_activities_truckId_loadingStartTime_idx" ON "hauling_activities"("truckId", "loadingStartTime");

-- CreateIndex
CREATE INDEX "hauling_activities_shift_loadingStartTime_idx" ON "hauling_activities"("shift", "loadingStartTime");

-- CreateIndex
CREATE INDEX "hauling_activities_status_idx" ON "hauling_activities"("status");

-- CreateIndex
CREATE INDEX "queue_logs_loadingPointId_timestamp_idx" ON "queue_logs"("loadingPointId", "timestamp");

-- CreateIndex
CREATE INDEX "production_records_recordDate_idx" ON "production_records"("recordDate");

-- CreateIndex
CREATE UNIQUE INDEX "production_records_recordDate_shift_miningSiteId_key" ON "production_records"("recordDate", "shift", "miningSiteId");

-- CreateIndex
CREATE INDEX "weather_logs_timestamp_idx" ON "weather_logs"("timestamp");

-- CreateIndex
CREATE INDEX "weather_logs_miningSiteId_timestamp_idx" ON "weather_logs"("miningSiteId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_logs_maintenanceNumber_key" ON "maintenance_logs"("maintenanceNumber");

-- CreateIndex
CREATE INDEX "maintenance_logs_actualDate_idx" ON "maintenance_logs"("actualDate");

-- CreateIndex
CREATE INDEX "maintenance_logs_status_idx" ON "maintenance_logs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "incident_reports_incidentNumber_key" ON "incident_reports"("incidentNumber");

-- CreateIndex
CREATE INDEX "incident_reports_incidentDate_idx" ON "incident_reports"("incidentDate");

-- CreateIndex
CREATE INDEX "incident_reports_severity_idx" ON "incident_reports"("severity");

-- CreateIndex
CREATE INDEX "fuel_consumptions_consumptionDate_idx" ON "fuel_consumptions"("consumptionDate");

-- CreateIndex
CREATE UNIQUE INDEX "delay_reasons_code_key" ON "delay_reasons"("code");

-- CreateIndex
CREATE INDEX "equipment_status_logs_timestamp_idx" ON "equipment_status_logs"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "prediction_logs_predictionId_key" ON "prediction_logs"("predictionId");

-- CreateIndex
CREATE INDEX "prediction_logs_timestamp_idx" ON "prediction_logs"("timestamp");

-- CreateIndex
CREATE INDEX "prediction_logs_modelType_idx" ON "prediction_logs"("modelType");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_logs_recommendationId_key" ON "recommendation_logs"("recommendationId");

-- CreateIndex
CREATE INDEX "recommendation_logs_timestamp_idx" ON "recommendation_logs"("timestamp");

-- CreateIndex
CREATE INDEX "recommendation_logs_status_idx" ON "recommendation_logs"("status");

-- CreateIndex
CREATE INDEX "chatbot_interactions_sessionId_idx" ON "chatbot_interactions"("sessionId");

-- CreateIndex
CREATE INDEX "chatbot_interactions_timestamp_idx" ON "chatbot_interactions"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_configKey_key" ON "system_configs"("configKey");

-- AddForeignKey
ALTER TABLE "loading_points" ADD CONSTRAINT "loading_points_miningSiteId_fkey" FOREIGN KEY ("miningSiteId") REFERENCES "mining_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loading_points" ADD CONSTRAINT "loading_points_excavatorId_fkey" FOREIGN KEY ("excavatorId") REFERENCES "excavators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dumping_points" ADD CONSTRAINT "dumping_points_miningSiteId_fkey" FOREIGN KEY ("miningSiteId") REFERENCES "mining_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "road_segments" ADD CONSTRAINT "road_segments_miningSiteId_fkey" FOREIGN KEY ("miningSiteId") REFERENCES "mining_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_currentOperatorId_fkey" FOREIGN KEY ("currentOperatorId") REFERENCES "operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operators" ADD CONSTRAINT "operators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hauling_activities" ADD CONSTRAINT "hauling_activities_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "trucks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hauling_activities" ADD CONSTRAINT "hauling_activities_excavatorId_fkey" FOREIGN KEY ("excavatorId") REFERENCES "excavators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hauling_activities" ADD CONSTRAINT "hauling_activities_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hauling_activities" ADD CONSTRAINT "hauling_activities_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hauling_activities" ADD CONSTRAINT "hauling_activities_loadingPointId_fkey" FOREIGN KEY ("loadingPointId") REFERENCES "loading_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hauling_activities" ADD CONSTRAINT "hauling_activities_dumpingPointId_fkey" FOREIGN KEY ("dumpingPointId") REFERENCES "dumping_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hauling_activities" ADD CONSTRAINT "hauling_activities_roadSegmentId_fkey" FOREIGN KEY ("roadSegmentId") REFERENCES "road_segments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hauling_activities" ADD CONSTRAINT "hauling_activities_delayReasonId_fkey" FOREIGN KEY ("delayReasonId") REFERENCES "delay_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queue_logs" ADD CONSTRAINT "queue_logs_loadingPointId_fkey" FOREIGN KEY ("loadingPointId") REFERENCES "loading_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_records" ADD CONSTRAINT "production_records_miningSiteId_fkey" FOREIGN KEY ("miningSiteId") REFERENCES "mining_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weather_logs" ADD CONSTRAINT "weather_logs_miningSiteId_fkey" FOREIGN KEY ("miningSiteId") REFERENCES "mining_sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "trucks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_excavatorId_fkey" FOREIGN KEY ("excavatorId") REFERENCES "excavators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_supportEquipmentId_fkey" FOREIGN KEY ("supportEquipmentId") REFERENCES "support_equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_reports" ADD CONSTRAINT "incident_reports_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "trucks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_reports" ADD CONSTRAINT "incident_reports_excavatorId_fkey" FOREIGN KEY ("excavatorId") REFERENCES "excavators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_reports" ADD CONSTRAINT "incident_reports_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_reports" ADD CONSTRAINT "incident_reports_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_consumptions" ADD CONSTRAINT "fuel_consumptions_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "trucks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_consumptions" ADD CONSTRAINT "fuel_consumptions_excavatorId_fkey" FOREIGN KEY ("excavatorId") REFERENCES "excavators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_consumptions" ADD CONSTRAINT "fuel_consumptions_supportEquipmentId_fkey" FOREIGN KEY ("supportEquipmentId") REFERENCES "support_equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_status_logs" ADD CONSTRAINT "equipment_status_logs_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "trucks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_status_logs" ADD CONSTRAINT "equipment_status_logs_excavatorId_fkey" FOREIGN KEY ("excavatorId") REFERENCES "excavators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_status_logs" ADD CONSTRAINT "equipment_status_logs_supportEquipmentId_fkey" FOREIGN KEY ("supportEquipmentId") REFERENCES "support_equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
