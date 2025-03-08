import db from '../connection';
import { HistoricalDataPoint } from '../../types';
import { logger } from '../../utils/logger';

class HistoricalDataRepository {
  async create(data: Partial<HistoricalDataPoint>): Promise<void> {
    try {
      await db.none(`
        INSERT INTO historical_data(creator_address, rank, total_liquidity_usd, timestamp)
        VALUES($1, $2, $3, $4)
      `, [data.creatorAddress, data.rank, data.totalLiquidityUSD, data.timestamp]);
    } catch (error) {
      logger.error('Error creating historical data point', { data, error });
      throw error;
    }
  }

  async findByCreator(creatorAddress: string): Promise<HistoricalDataPoint[]> {
    try {
      return db.manyOrNone(`
        SELECT * FROM historical_data
        WHERE creator_address = $1
        ORDER BY timestamp DESC
      `, [creatorAddress]);
    } catch (error) {
      logger.error('Error finding historical data by creator', { creatorAddress, error });
      throw error;
    }
  }
}

export const historicalDataRepository = new HistoricalDataRepository(); 