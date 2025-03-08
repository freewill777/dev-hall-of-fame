// src/database/repositories/creatorRepository.ts
import db from '../connection';
import { TokenCreator, FilterOptions } from '../../types';
import { logger } from '../../utils/logger';

class CreatorRepository {
  /**
   * Find a creator by address
   */
  async findByAddress(address: string): Promise<TokenCreator | null> {
    try {
      const creator = await db.oneOrNone(`
        SELECT id, address, first_seen as "firstSeen", last_seen as "lastSeen", 
               total_tokens_created as "totalTokensCreated", 
               total_liquidity_usd as "totalLiquidityUSD", 
               current_rank as rank, previous_rank as "previousRank",
               created_at as "createdAt", updated_at as "updatedAt"
        FROM token_creators
        WHERE address = $1
      `, [address]);
      
      return creator;
    } catch (error) {
      logger.error('Error finding creator by address', { 
        address,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Create a new creator
   */
  async create(creator: Partial<TokenCreator>): Promise<TokenCreator> {
    try {
      return db.one(`
        INSERT INTO token_creators(
          address, first_seen, last_seen, 
          total_tokens_created, total_liquidity_usd, 
          current_rank, previous_rank
        )
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, address, first_seen as "firstSeen", last_seen as "lastSeen", 
                 total_tokens_created as "totalTokensCreated", 
                 total_liquidity_usd as "totalLiquidityUSD", 
                 current_rank as rank, previous_rank as "previousRank",
                 created_at as "createdAt", updated_at as "updatedAt"
      `, [
        creator.address,
        creator.firstSeen,
        creator.lastSeen,
        creator.totalTokensCreated || 0,
        creator.totalLiquidityUSD || 0,
        creator.rank || 0,
        creator.previousRank || null
      ]);
    } catch (error) {
      logger.error('Error creating creator', { 
        creator,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Update an existing creator
   */
  async update(creator: Partial<TokenCreator>): Promise<TokenCreator> {
    try {
      return db.one(`
        UPDATE token_creators
        SET last_seen = $2,
            total_tokens_created = $3,
            total_liquidity_usd = $4,
            updated_at = NOW()
        WHERE address = $1
        RETURNING id, address, first_seen as "firstSeen", last_seen as "lastSeen", 
                 total_tokens_created as "totalTokensCreated", 
                 total_liquidity_usd as "totalLiquidityUSD", 
                 current_rank as rank, previous_rank as "previousRank",
                 created_at as "createdAt", updated_at as "updatedAt"
      `, [
        creator.address,
        creator.lastSeen,
        creator.totalTokensCreated,
        creator.totalLiquidityUSD
      ]);
    } catch (error) {
      logger.error('Error updating creator', { 
        creator,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Update creator's rank
   */
  async updateRank(address: string, newRank: number, previousRank: number | null): Promise<void> {
    try {
      await db.none(`
        UPDATE token_creators
        SET current_rank = $2,
            previous_rank = $3,
            updated_at = NOW()
        WHERE address = $1
      `, [address, newRank, previousRank]);
    } catch (error) {
      logger.error('Error updating creator rank', { 
        address, newRank, previousRank,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Find all creators ordered by liquidity
   */
  async findAllOrderByLiquidity(): Promise<TokenCreator[]> {
    try {
      return db.manyOrNone(`
        SELECT id, address, first_seen as "firstSeen", last_seen as "lastSeen", 
               total_tokens_created as "totalTokensCreated", 
               total_liquidity_usd as "totalLiquidityUSD", 
               current_rank as rank, previous_rank as "previousRank",
               created_at as "createdAt", updated_at as "updatedAt"
        FROM token_creators
        ORDER BY total_liquidity_usd DESC
      `);
    } catch (error) {
      logger.error('Error finding all creators ordered by liquidity', { 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Find all creators with filters
   */
  async findAllWithFilters(filters: FilterOptions): Promise<TokenCreator[]> {
    try {
      let query = `
        SELECT id, address, first_seen as "firstSeen", last_seen as "lastSeen", 
               total_tokens_created as "totalTokensCreated", 
               total_liquidity_usd as "totalLiquidityUSD", 
               current_rank as rank, previous_rank as "previousRank",
               created_at as "createdAt", updated_at as "updatedAt"
        FROM token_creators
        WHERE 1=1
      `;
      
      const params: any[] = [];
      
      // Apply filters
      if (filters.minLiquidityUSD !== undefined) {
        params.push(filters.minLiquidityUSD);
        query += ` AND total_liquidity_usd >= $${params.length}`;
      }
      
      if (filters.maxRank !== undefined) {
        params.push(filters.maxRank);
        query += ` AND current_rank <= $${params.length}`;
      }
      
      // Apply sorting
      if (filters.sortBy === 'liquidityUSD') {
        query += ` ORDER BY total_liquidity_usd ${filters.sortDirection === 'asc' ? 'ASC' : 'DESC'}`;
      } else if (filters.sortBy === 'tokenCount') {
        query += ` ORDER BY total_tokens_created ${filters.sortDirection === 'asc' ? 'ASC' : 'DESC'}`;
      } else if (filters.sortBy === 'age') {
        query += ` ORDER BY first_seen ${filters.sortDirection === 'asc' ? 'ASC' : 'DESC'}`;
      } else {
        // Default sort
        query += ` ORDER BY total_liquidity_usd DESC`;
      }
      
      // Apply pagination
      if (filters.limit !== undefined) {
        params.push(filters.limit);
        query += ` LIMIT $${params.length}`;
      }
      
      if (filters.offset !== undefined) {
        params.push(filters.offset);
        query += ` OFFSET $${params.length}`;
      }
      
      return db.manyOrNone(query, params);
    } catch (error) {
      logger.error('Error finding creators with filters', { 
        filters,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Count creators with filters
   */
  async countWithFilters(filters: FilterOptions): Promise<number> {
    try {
      let query = `
        SELECT COUNT(*) as count
        FROM token_creators
        WHERE 1=1
      `;
      
      const params: any[] = [];
      
      // Apply filters
      if (filters.minLiquidityUSD !== undefined) {
        params.push(filters.minLiquidityUSD);
        query += ` AND total_liquidity_usd >= $${params.length}`;
      }
      
      if (filters.maxRank !== undefined) {
        params.push(filters.maxRank);
        query += ` AND current_rank <= $${params.length}`;
      }
      
      const result = await db.one(query, params);
      return parseInt(result.count);
    } catch (error) {
      logger.error('Error counting creators with filters', { 
        filters,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}

export const creatorRepository = new CreatorRepository();
