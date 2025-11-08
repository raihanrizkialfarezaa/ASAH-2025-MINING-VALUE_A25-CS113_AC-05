import express from 'express';
import { mlProxyController } from '../controllers/mlProxy.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/health', mlProxyController.healthCheck);

router.use(authenticate);

router.post('/predict/delay-risk', mlProxyController.predictDelayRisk);
router.post('/predict/breakdown', mlProxyController.predictBreakdown);
router.post('/recommend', mlProxyController.getRecommendations);
router.post('/chat-rag', mlProxyController.chatWithRAG);

export default router;
