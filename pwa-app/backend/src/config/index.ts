import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',

  taxii: {
    server: process.env.TAXII_SERVER || 'https://attack-taxii.mitre.org',
    apiRoot: process.env.TAXII_API_ROOT || '/api/v21',
    discovery: process.env.TAXII_DISCOVERY || '/taxii2/',
  },

  database: {
    path: path.resolve(process.env.DATABASE_PATH || './database/raptor.db'),
  },

  cache: {
    ttlHours: parseInt(process.env.CACHE_TTL_HOURS || '168', 10),
    autoUpdate: process.env.AUTO_UPDATE_ENABLED === 'true',
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
  },
} as const;

export default config;
