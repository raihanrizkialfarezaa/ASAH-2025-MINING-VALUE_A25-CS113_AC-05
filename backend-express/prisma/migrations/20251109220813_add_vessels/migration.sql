-- CreateEnum
CREATE TYPE "VesselType" AS ENUM ('MOTHER_VESSEL', 'BARGE', 'TUG_BOAT');

-- CreateEnum
CREATE TYPE "VesselStatus" AS ENUM ('AVAILABLE', 'LOADING', 'SAILING', 'DISCHARGING', 'MAINTENANCE', 'CHARTERED');

-- CreateEnum
CREATE TYPE "SailingStatus" AS ENUM ('SCHEDULED', 'STANDBY', 'LOADING', 'SAILING', 'ARRIVED', 'DISCHARGING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "vessels" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vesselType" "VesselType" NOT NULL,
    "gt" DOUBLE PRECISION NOT NULL,
    "dwt" DOUBLE PRECISION NOT NULL,
    "loa" DOUBLE PRECISION,
    "capacity" DOUBLE PRECISION NOT NULL,
    "owner" TEXT NOT NULL,
    "isOwned" BOOLEAN NOT NULL DEFAULT false,
    "status" "VesselStatus" NOT NULL DEFAULT 'AVAILABLE',
    "currentLocation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vessels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sailing_schedules" (
    "id" TEXT NOT NULL,
    "scheduleNumber" TEXT NOT NULL,
    "vesselId" TEXT NOT NULL,
    "voyageNumber" TEXT NOT NULL,
    "loadingPort" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "etaLoading" TIMESTAMP(3) NOT NULL,
    "etsLoading" TIMESTAMP(3),
    "etaDestination" TIMESTAMP(3),
    "ataLoading" TIMESTAMP(3),
    "loadingStart" TIMESTAMP(3),
    "loadingComplete" TIMESTAMP(3),
    "atsLoading" TIMESTAMP(3),
    "ataDestination" TIMESTAMP(3),
    "plannedQuantity" DOUBLE PRECISION NOT NULL,
    "actualQuantity" DOUBLE PRECISION,
    "buyer" TEXT NOT NULL,
    "contractNumber" TEXT,
    "status" "SailingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sailing_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_records" (
    "id" TEXT NOT NULL,
    "shipmentNumber" TEXT NOT NULL,
    "vesselId" TEXT NOT NULL,
    "sailingScheduleId" TEXT,
    "shipmentDate" TIMESTAMP(3) NOT NULL,
    "loadingDate" TIMESTAMP(3),
    "coalType" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "calorie" DOUBLE PRECISION,
    "totalMoisture" DOUBLE PRECISION,
    "ashContent" DOUBLE PRECISION,
    "sulfurContent" DOUBLE PRECISION,
    "stockpileOrigin" TEXT,
    "buyer" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "surveyorName" TEXT,
    "blNumber" TEXT,
    "coaNumber" TEXT,
    "freightCost" DOUBLE PRECISION,
    "totalFreight" DOUBLE PRECISION,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipment_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barge_loading_logs" (
    "id" TEXT NOT NULL,
    "loadingNumber" TEXT NOT NULL,
    "vesselCode" TEXT NOT NULL,
    "vesselName" TEXT NOT NULL,
    "loadingDate" TIMESTAMP(3) NOT NULL,
    "shift" "Shift" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "stockpileSource" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "loaderUsed" TEXT,
    "bargeTrips" INTEGER NOT NULL DEFAULT 0,
    "weatherCondition" TEXT,
    "tidalCondition" TEXT,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "delayReason" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barge_loading_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jetty_berths" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "portName" TEXT NOT NULL,
    "maxVesselSize" DOUBLE PRECISION,
    "maxDraft" DOUBLE PRECISION,
    "hasConveyor" BOOLEAN NOT NULL DEFAULT false,
    "loadingCapacity" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jetty_berths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "berthing_logs" (
    "id" TEXT NOT NULL,
    "jettyBerthId" TEXT NOT NULL,
    "vesselCode" TEXT NOT NULL,
    "vesselName" TEXT NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "berthingTime" TIMESTAMP(3),
    "loadingStart" TIMESTAMP(3),
    "loadingEnd" TIMESTAMP(3),
    "departureTime" TIMESTAMP(3),
    "draftArrival" DOUBLE PRECISION,
    "draftDeparture" DOUBLE PRECISION,
    "waitingTime" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "berthing_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vessels_code_key" ON "vessels"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sailing_schedules_scheduleNumber_key" ON "sailing_schedules"("scheduleNumber");

-- CreateIndex
CREATE INDEX "sailing_schedules_vesselId_idx" ON "sailing_schedules"("vesselId");

-- CreateIndex
CREATE INDEX "sailing_schedules_etaLoading_idx" ON "sailing_schedules"("etaLoading");

-- CreateIndex
CREATE INDEX "sailing_schedules_status_idx" ON "sailing_schedules"("status");

-- CreateIndex
CREATE UNIQUE INDEX "shipment_records_shipmentNumber_key" ON "shipment_records"("shipmentNumber");

-- CreateIndex
CREATE INDEX "shipment_records_vesselId_idx" ON "shipment_records"("vesselId");

-- CreateIndex
CREATE INDEX "shipment_records_shipmentDate_idx" ON "shipment_records"("shipmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "barge_loading_logs_loadingNumber_key" ON "barge_loading_logs"("loadingNumber");

-- CreateIndex
CREATE INDEX "barge_loading_logs_loadingDate_idx" ON "barge_loading_logs"("loadingDate");

-- CreateIndex
CREATE UNIQUE INDEX "jetty_berths_code_key" ON "jetty_berths"("code");

-- CreateIndex
CREATE INDEX "berthing_logs_jettyBerthId_idx" ON "berthing_logs"("jettyBerthId");

-- CreateIndex
CREATE INDEX "berthing_logs_arrivalTime_idx" ON "berthing_logs"("arrivalTime");

-- AddForeignKey
ALTER TABLE "sailing_schedules" ADD CONSTRAINT "sailing_schedules_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_records" ADD CONSTRAINT "shipment_records_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_records" ADD CONSTRAINT "shipment_records_sailingScheduleId_fkey" FOREIGN KEY ("sailingScheduleId") REFERENCES "sailing_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "berthing_logs" ADD CONSTRAINT "berthing_logs_jettyBerthId_fkey" FOREIGN KEY ("jettyBerthId") REFERENCES "jetty_berths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
