import axios from 'axios';
import config from '../config/env.js';
import logger from '../config/logger.js';
import ApiError from '../utils/apiError.js';

const fastapiClient = axios.create({
  baseURL: config.fastapi.baseUrl,
  timeout: config.fastapi.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

fastapiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      logger.error('FastAPI request timeout');
      throw ApiError.serviceUnavailable('ML service request timeout');
    }
    if (error.response) {
      logger.error(
        `FastAPI error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      );
      throw ApiError.serviceUnavailable(
        `ML service error: ${error.response.data.detail || error.message}`
      );
    }
    logger.error(`FastAPI connection error: ${error.message}`);
    throw ApiError.serviceUnavailable('ML service is currently unavailable');
  }
);

export const mlProxyService = {
  async predictDelayRisk(data) {
    try {
      const response = await fastapiClient.post('/predict/delay-risk', data);
      return response.data;
    } catch (error) {
      logger.error('Delay risk prediction failed', error);
      throw error;
    }
  },

  async predictBreakdown(data) {
    try {
      const response = await fastapiClient.post('/predict/breakdown', data);
      return response.data;
    } catch (error) {
      logger.error('Breakdown prediction failed', error);
      throw error;
    }
  },

  async getRecommendations(data) {
    try {
      const response = await fastapiClient.post('/recommend', data);
      return response.data;
    } catch (error) {
      logger.error('Get recommendations failed', error);
      throw error;
    }
  },

  async chatWithRAG(query, userId, sessionId) {
    try {
      const response = await fastapiClient.post('/chat-rag', {
        query,
        userId,
        sessionId,
      });
      return response.data;
    } catch (error) {
      logger.error('Chat RAG failed', error);
      throw error;
    }
  },

  async healthCheck() {
    try {
      const response = await axios.get(`${config.fastapi.baseUrl}/health`, {
        timeout: 5000,
      });
      return {
        status: 'healthy',
        data: response.data,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  },
};
