// src/scripts/testConnection.ts
import { Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { config } from '../config/solana';
import { logger } from '../utils/logger';
import db from '../database/connection';

/**
 * Test script to verify Solana RPC connection and database connection
 */
async function testConnections() {
  logger.info('Starting connection tests...');

  // Test database connection
  try {
    const result = await db.one('SELECT current_timestamp as time');
    logger.info('Database connection successful', { timestamp: result.time });
  } catch (error) {
    logger.error('Database connection failed', { 
      error: error instanceof Error ? error.message : String(error) 
    });
  }

  // Test Solana connection
  try {
    const connection = new Connection(config.rpcEndpoint, 'confirmed');
    const version = await connection.getVersion();
    logger.info('Solana connection successful', { version });

    // Test fetching recent signatures for Token Program
    const signatures = await connection.getSignaturesForAddress(
      TOKEN_PROGRAM_ID,
      { limit: 5 }
    );

    logger.info('Successfully fetched recent token program signatures', {
      count: signatures.length,
      latest: signatures[0]?.signature
    });
  } catch (error) {
    logger.error('Solana connection failed', { 
      error: error instanceof Error ? error.message : String(error) 
    });
  }

  logger.info('Connection tests completed');
}

// Execute the test
testConnections().catch(err => {
  logger.error('Error running test script', { error: err.message });
  process.exit(1);
});