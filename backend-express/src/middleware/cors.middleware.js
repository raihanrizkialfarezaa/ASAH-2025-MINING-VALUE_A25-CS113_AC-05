import cors from 'cors';
import config from '../config/env.js';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = config.cors.origin.split(',');

    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
