import app from './app.js';
import config from './config/env.js';
import logger from './config/logger.js';
import prisma from './config/database.js';
import aiDataSyncJob from './jobs/aiDataSync.job.js';

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.env} mode`);

  // Start AI data sync scheduled jobs
  if (config.env !== 'test') {
    aiDataSyncJob.start();
    logger.info('AI data sync jobs started');
  }
});

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} signal received: closing HTTP server`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await prisma.$disconnect();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});
