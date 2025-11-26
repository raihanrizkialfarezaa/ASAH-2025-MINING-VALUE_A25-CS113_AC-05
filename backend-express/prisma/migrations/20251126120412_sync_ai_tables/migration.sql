/*
  Warnings:

  - You are about to drop the column `botResponse` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `confidence` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `feedbackComment` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `queryIntent` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `responseSource` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `retrievedContext` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `sqlQuery` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `tokensUsed` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `userFeedback` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `userQuery` on the `chatbot_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `actualOutcome` on the `prediction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `confidence` on the `prediction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `contextData` on the `prediction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `inputData` on the `prediction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `isAccurate` on the `prediction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `modelType` on the `prediction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `prediction` on the `prediction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `predictionId` on the `prediction_logs` table. All the data in the column will be lost.
  - You are about to drop the column `actualImpact` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `contextData` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `effectiveness` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedImpact` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedSavings` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `executedAt` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `executedBy` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `justification` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `recommendation` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `recommendationId` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `recommendation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `recommendation_logs` table. All the data in the column will be lost.
  - Added the required column `aiResponse` to the `chatbot_interactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userQuestion` to the `chatbot_interactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputParameters` to the `prediction_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predictionType` to the `prediction_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `results` to the `prediction_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendationType` to the `recommendation_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendations` to the `recommendation_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scenario` to the `recommendation_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "prediction_logs_modelType_idx";

-- DropIndex
DROP INDEX "prediction_logs_predictionId_key";

-- DropIndex
DROP INDEX "recommendation_logs_recommendationId_key";

-- DropIndex
DROP INDEX "recommendation_logs_status_idx";

-- DropIndex
DROP INDEX "recommendation_logs_timestamp_idx";

-- AlterTable
ALTER TABLE "chatbot_interactions" DROP COLUMN "botResponse",
DROP COLUMN "confidence",
DROP COLUMN "feedbackComment",
DROP COLUMN "queryIntent",
DROP COLUMN "responseSource",
DROP COLUMN "retrievedContext",
DROP COLUMN "sqlQuery",
DROP COLUMN "tokensUsed",
DROP COLUMN "userFeedback",
DROP COLUMN "userQuery",
ADD COLUMN     "aiResponse" TEXT NOT NULL,
ADD COLUMN     "context" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "userQuestion" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "prediction_logs" DROP COLUMN "actualOutcome",
DROP COLUMN "confidence",
DROP COLUMN "contextData",
DROP COLUMN "inputData",
DROP COLUMN "isAccurate",
DROP COLUMN "modelType",
DROP COLUMN "prediction",
DROP COLUMN "predictionId",
ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "executionTime" INTEGER,
ADD COLUMN     "inputParameters" JSONB NOT NULL,
ADD COLUMN     "predictionType" TEXT NOT NULL,
ADD COLUMN     "results" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "recommendation_logs" DROP COLUMN "actualImpact",
DROP COLUMN "category",
DROP COLUMN "contextData",
DROP COLUMN "effectiveness",
DROP COLUMN "estimatedImpact",
DROP COLUMN "estimatedSavings",
DROP COLUMN "executedAt",
DROP COLUMN "executedBy",
DROP COLUMN "justification",
DROP COLUMN "priority",
DROP COLUMN "recommendation",
DROP COLUMN "recommendationId",
DROP COLUMN "remarks",
DROP COLUMN "status",
DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "implementedAt" TIMESTAMP(3),
ADD COLUMN     "implementedBy" TEXT,
ADD COLUMN     "profitActual" DOUBLE PRECISION,
ADD COLUMN     "profitPredicted" DOUBLE PRECISION,
ADD COLUMN     "recommendationType" TEXT NOT NULL,
ADD COLUMN     "recommendations" JSONB NOT NULL,
ADD COLUMN     "results" JSONB,
ADD COLUMN     "scenario" JSONB NOT NULL,
ADD COLUMN     "selectedStrategy" INTEGER,
ADD COLUMN     "selectedStrategyId" TEXT,
ADD COLUMN     "variance" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "system_configs" ADD COLUMN     "updatedBy" TEXT,
ALTER COLUMN "dataType" SET DEFAULT 'STRING';

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "RecommendationCategory";

-- DropEnum
DROP TYPE "RecommendationStatus";

-- CreateTable
CREATE TABLE "model_training_logs" (
    "id" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "trainingDataSize" INTEGER NOT NULL,
    "trainingAccuracy" DOUBLE PRECISION,
    "validationAccuracy" DOUBLE PRECISION,
    "testAccuracy" DOUBLE PRECISION,
    "hyperparameters" JSONB,
    "featureImportance" JSONB,
    "trainedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trainedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_training_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "model_training_logs_modelType_idx" ON "model_training_logs"("modelType");

-- CreateIndex
CREATE INDEX "model_training_logs_trainedAt_idx" ON "model_training_logs"("trainedAt");

-- CreateIndex
CREATE INDEX "model_training_logs_status_idx" ON "model_training_logs"("status");

-- CreateIndex
CREATE INDEX "chatbot_interactions_userId_idx" ON "chatbot_interactions"("userId");

-- CreateIndex
CREATE INDEX "prediction_logs_predictionType_idx" ON "prediction_logs"("predictionType");

-- CreateIndex
CREATE INDEX "recommendation_logs_recommendationType_idx" ON "recommendation_logs"("recommendationType");

-- CreateIndex
CREATE INDEX "recommendation_logs_createdAt_idx" ON "recommendation_logs"("createdAt");

-- CreateIndex
CREATE INDEX "recommendation_logs_implementedAt_idx" ON "recommendation_logs"("implementedAt");

-- CreateIndex
CREATE INDEX "system_configs_category_idx" ON "system_configs"("category");

-- CreateIndex
CREATE INDEX "system_configs_isActive_idx" ON "system_configs"("isActive");

-- AddForeignKey
ALTER TABLE "chatbot_interactions" ADD CONSTRAINT "chatbot_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_logs" ADD CONSTRAINT "recommendation_logs_implementedBy_fkey" FOREIGN KEY ("implementedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_configs" ADD CONSTRAINT "system_configs_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
