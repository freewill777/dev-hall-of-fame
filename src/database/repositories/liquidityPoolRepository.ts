import db from '../connection';
import { LiquidityPool } from '../../types';
import { logger } from '../../utils/logger';

class LiquidityPoolRepository {
  async findByAddress(address: string): Promise<LiquidityPool | null> {
    try {
      return db.oneOrNone(`
        SELECT * FROM liquidity_pools WHERE address = $1
      `, [address]);
    } catch (error) {
      logger.error('Error finding pool by address', { address, error });
      throw error;
    }
  }

  async create(pool: Partial<LiquidityPool>): Promise<LiquidityPool> {
    try {
      return db.one(`
        INSERT INTO liquidity_pools(address, token_a, token_b, amm_type, liquidity_usd, volume_24h)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [pool.address, pool.tokenA, pool.tokenB, pool.ammType, pool.liquidityUSD, pool.volume24h]);
    } catch (error) {
      logger.error('Error creating liquidity pool', { pool, error });
      throw error;
    }
  }

  async update(pool: Partial<LiquidityPool>): Promise<void> {
    try {
      await db.none(`
        UPDATE liquidity_pools 
        SET liquidity_usd = $2, volume_24h = $3, updated_at = NOW()
        WHERE address = $1
      `, [pool.address, pool.liquidityUSD, pool.volume24h]);
    } catch (error) {
      logger.error('Error updating liquidity pool', { pool, error });
      throw error;
    }
  }

  async findByToken(tokenMint: string): Promise<LiquidityPool[]> {
    try {
      return db.manyOrNone(`
        SELECT lp.* FROM liquidity_pools lp
        JOIN token_liquidity_pools tlp ON tlp.pool_address = lp.address
        WHERE tlp.token_mint = $1
      `, [tokenMint]);
    } catch (error) {
      logger.error('Error finding pools by token', { tokenMint, error });
      throw error;
    }
  }

  async createTokenMapping(tokenMint: string, poolAddress: string): Promise<void> {
    try {
      await db.none(`
        INSERT INTO token_liquidity_pools(token_mint, pool_address)
        VALUES($1, $2)
        ON CONFLICT DO NOTHING
      `, [tokenMint, poolAddress]);
    } catch (error) {
      logger.error('Error creating token-pool mapping', { tokenMint, poolAddress, error });
      throw error;
    }
  }
}

export const liquidityPoolRepository = new LiquidityPoolRepository(); 