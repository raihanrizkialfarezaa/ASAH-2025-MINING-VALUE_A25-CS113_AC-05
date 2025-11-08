import { mlProxyService } from '../services/mlProxy.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/apiResponse.js';

export const mlProxyController = {
  predictDelayRisk: catchAsync(async (req, res) => {
    const result = await mlProxyService.predictDelayRisk(req.body);
    res.json(ApiResponse.success(result));
  }),

  predictBreakdown: catchAsync(async (req, res) => {
    const result = await mlProxyService.predictBreakdown(req.body);
    res.json(ApiResponse.success(result));
  }),

  getRecommendations: catchAsync(async (req, res) => {
    const result = await mlProxyService.getRecommendations(req.body);
    res.json(ApiResponse.success(result));
  }),

  chatWithRAG: catchAsync(async (req, res) => {
    const { query, sessionId } = req.body;
    const userId = req.user?.id || null;
    const result = await mlProxyService.chatWithRAG(query, userId, sessionId);
    res.json(ApiResponse.success(result));
  }),

  healthCheck: catchAsync(async (req, res) => {
    const result = await mlProxyService.healthCheck();
    res.json(ApiResponse.success(result));
  }),
};
