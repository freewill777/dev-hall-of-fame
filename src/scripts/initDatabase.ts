// src/scripts/initDatabase.ts
import fs from 'fs';
import path from 'path';
import db from '../database/connection';
import { logger } from '../utils/logger';

/**
 * Initialize the database with tables and schema
 */
async function initDatabase() {
  try {
    logger.info('Starting database initialization...');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, '../../database/init.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute SQL
    await db.none(sqlContent);
    
    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Error initializing database', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    process.exit(1);
  }
}

// Run the initialization
initDatabase().catch(err => {
  logger.error('Unhandled error in database initialization', { error: err.message });
  process.exit(1);
});
