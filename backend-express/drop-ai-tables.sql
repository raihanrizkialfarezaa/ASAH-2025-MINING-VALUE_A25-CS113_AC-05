-- Drop AI tables yang conflict
DROP TABLE IF EXISTS "prediction_logs" CASCADE;
DROP TABLE IF EXISTS "chatbot_interactions" CASCADE;
DROP TABLE IF EXISTS "recommendation_logs" CASCADE;
DROP TABLE IF EXISTS "model_training_logs" CASCADE;
DROP TABLE IF EXISTS "system_configs" CASCADE;
