import express from 'express';
import helmet from 'helmet';
import corsMiddleware from './middleware/cors.middleware.js';
import sanitizeMiddleware from './middleware/sanitize.middleware.js';
import { httpLogger } from './middleware/logger.middleware.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';
import prisma from './config/database.js';
import logger from './config/logger.js';
import { mlProxyService } from './services/mlProxy.service.js';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeMiddleware);
app.use(httpLogger);

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const mlHealth = await mlProxyService.healthCheck();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        mlService: mlHealth.status,
      },
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
