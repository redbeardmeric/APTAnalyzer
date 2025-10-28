import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import routes from './routes';
import database from './services/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.port;
const HOST = config.host;

app.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   R.A.P.T.O.R. Backend API                           ║
║   Ranking Advanced Persistent Threat                 ║
║   Ontological Report                                  ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

Server running at: http://${HOST}:${PORT}
Environment: ${config.env}
Database: ${config.database.path}
TAXII Server: ${config.taxii.server}

Database initialized: ${database.isInitialized()}

${
  !database.isInitialized()
    ? `
⚠️  WARNING: Database not initialized!
   Run: npm run db:init
`
    : `
✓  Database ready
   ATT&CK Version: ${database.getMetadata('attack_version')}
   Last Updated: ${database.getMetadata('last_updated')}
`
}

API Documentation:
  GET  /api/health              - Health check
  GET  /api/data-source/info    - Data source info
  GET  /api/tactics             - List all tactics
  GET  /api/techniques          - List all techniques
  GET  /api/techniques?tactic=X - Filter techniques by tactic
  GET  /api/groups              - List all groups
  GET  /api/groups/:id          - Get group details
  GET  /api/groups/:id/techniques - Get group's techniques
  GET  /api/groups/:id/software - Get group's software
  GET  /api/software            - List all software
  GET  /api/mitigations         - List all mitigations
  POST /api/analysis            - Analyze threats
  POST /api/analysis/count      - Count potential matches
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  database.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  database.close();
  process.exit(0);
});
