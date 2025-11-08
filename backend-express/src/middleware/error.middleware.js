import config from '../config/env.js';
import logger from '../config/logger.js';
import ApiResponse from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!statusCode) {
    statusCode = 500;
  }

  if (!message) {
    message = 'Internal server error';
  }

  const response = {
    success: false,
    statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(statusCode).json(response);
};

export const notFound = (req, res, next) => {
  res.status(404).json(ApiResponse.notFound(`Route ${req.originalUrl} not found`));
};

export const notFoundHandler = notFound;
