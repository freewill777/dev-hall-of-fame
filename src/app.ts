// src/app.ts
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { errorMiddleware } from './api/middleware/error';
import routes from './api/routes';
import { logger } from './utils/logger';
import { initScheduler } from './services/scheduler/updateScheduler';
import { config } from './config/app';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorMiddleware);

// Create HTTP server
const server = createServer(app);

// Start server
server.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
  
  // Initialize scheduler for data updates
  initScheduler();
});

export default server;
