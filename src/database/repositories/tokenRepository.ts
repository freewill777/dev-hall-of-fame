import db from '../connection';
import { Token } from '../../types';
import { logger } from '../../utils/logger';

class TokenRepository {
  async findByMint(mint: string): Promise<Token | null> {
    try {
      return db.oneOrNone(`
        SELECT * FROM tokens WHERE mint = $1
      `, [mint]);
    } catch (error) {
      logger.error('Error finding token by mint', { mint, error });
      throw error;
    }
  }

  async create(token: Partial<Token>): Promise<Token> {
    try {
      return db.one(`
        INSERT INTO tokens(mint, creator_address, name, symbol, created_at, total_supply, decimals)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [token.mint, token.creatorAddress, token.name, token.symbol, token.createdAt, token.totalSupply, token.decimals]);
    } catch (error) {
      logger.error('Error creating token', { token, error });
      throw error;
    }
  }

  async findByCreator(creatorAddress: string): Promise<Token[]> {
    try {
      return db.manyOrNone(`
        SELECT * FROM tokens WHERE creator_address = $1
      `, [creatorAddress]);
    } catch (error) {
      logger.error('Error finding tokens by creator', { creatorAddress, error });
      throw error;
    }
  }

  async updateLiquidity(mint: string, totalLiquidity: number): Promise<void> {
    try {
      await db.none(`
        UPDATE tokens 
        SET total_liquidity_usd = $2, updated_at = NOW()
        WHERE mint = $1
      `, [mint, totalLiquidity]);
    } catch (error) {
      logger.error('Error updating token liquidity', { mint, totalLiquidity, error });
      throw error;
    }
  }
}

export const tokenRepository = new TokenRepository(); 