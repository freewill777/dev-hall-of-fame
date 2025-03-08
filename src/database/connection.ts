// src/database/connection.ts
import pgPromise from 'pg-promise';
import { dbConfig } from '../config/database';
import { logger } from '../utils/logger';

// Initialize pg-promise
const pgp = pgPromise({
  error: (error, e) => {
    logger.error('Database error', { error, context: e.query });
  }
});

// Create the database instance
const db = pgp(dbConfig);

// Test connection
db.connect()
  .then(obj => {
    logger.info('Database connection established successfully');
    obj.done(); // release connection
  })
  .catch(error => {
    logger.error('Error connecting to database', { 
      error: error instanceof Error ? error.message : String(error) 
    });
  });

export default db;
