// src/services/dataProcessing/creatorProcessor.ts
import { TokenCreator, Token, LiquidityPool } from '../../types';
import { creatorRepository } from '../../database/repositories/creatorRepository';
import { tokenRepository } from '../../database/repositories/tokenRepository';
import { liquidityPoolRepository } from '../../database/repositories/liquidityPoolRepository';
import { historicalDataRepository } from '../../database/repositories/historicalDataRepository';
import { logger } from '../../utils/logger';

export class CreatorProcessor {
  /**
   * Process new token creation events and update creator stats
   */
  async processNewTokens(tokens: Token[]): Promise<void> {
    try {
      for (const token of tokens) {
        // Check if token already exists in database
        const existingToken = await tokenRepository.findByMint(token.mint);
        if (existingToken) {
          continue; // Skip existing tokens
        }
        
        // Save new token
        await tokenRepository.create(token);
        
        // Update creator stats
        await this.updateCreatorStats(token.creatorAddress);
      }
    } catch (error) {
      logger.error('Error processing new tokens', { 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Process liquidity pool data and update token and creator stats
   */
  async processLiquidityPools(pools: LiquidityPool[]): Promise<void> {
    try {
      for (const pool of pools) {
        // Check if pool already exists in database
        const existingPool = await liquidityPoolRepository.findByAddress(pool.address);
        
        if (existingPool) {
          // Update existing pool
          await liquidityPoolRepository.update(pool);
        } else {
          // Save new pool
          await liquidityPoolRepository.create(pool);
          
          // Create mappings to tokens
          await liquidityPoolRepository.createTokenMapping(pool.tokenA, pool.address);
          await liquidityPoolRepository.createTokenMapping(pool.tokenB, pool.address);
        }
        
        // Update token liquidity stats
        await this.updateTokenLiquidityStats(pool.tokenA);
        await this.updateTokenLiquidityStats(pool.tokenB);
      }
    } catch (error) {
      logger.error('Error processing liquidity pools', { 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Update token's liquidity stats
   */
  private async updateTokenLiquidityStats(tokenMint: string): Promise<void> {
    try {
      // Get all liquidity pools for this token
      const pools = await liquidityPoolRepository.findByToken(tokenMint);
      
      // Calculate total liquidity
      const totalLiquidity = pools.reduce((sum, pool) => sum + pool.liquidityUSD, 0);
      
      // Update token's liquidity stats
      await tokenRepository.updateLiquidity(tokenMint, totalLiquidity);
      
      // Get token to update creator stats
      const token = await tokenRepository.findByMint(tokenMint);
      if (token) {
        await this.updateCreatorStats(token.creatorAddress);
      }
    } catch (error) {
      logger.error('Error updating token liquidity stats', { 
        tokenMint, 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Update creator's stats based on their tokens
   */
  private async updateCreatorStats(creatorAddress: string): Promise<void> {
    try {
      // Get all tokens by this creator
      const tokens = await tokenRepository.findByCreator(creatorAddress);
      
      // Calculate total liquidity across all tokens
      const totalLiquidity = tokens.reduce((sum, token) => sum + token.totalLiquidityUSD, 0);
      
      // Check if creator exists
      const creator = await creatorRepository.findByAddress(creatorAddress);
      
      if (creator) {
        // Update existing creator
        await creatorRepository.update({
          ...creator,
          totalTokensCreated: tokens.length,
          totalLiquidityUSD: totalLiquidity,
          lastSeen: new Date()
        });
      } else {
        // Create new creator
        await creatorRepository.create({
          address: creatorAddress,
          firstSeen: new Date(),
          lastSeen: new Date(),
          totalTokensCreated: tokens.length,
          totalLiquidityUSD: totalLiquidity,
          rank: 0 // Will be updated by ranking process
        });
      }
    } catch (error) {
      logger.error('Error updating creator stats', { 
        creatorAddress, 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
  
  /**
   * Update all creator rankings
   */
  async updateAllRankings(): Promise<void> {
    try {
      // Get all creators ordered by liquidity
      const creators = await creatorRepository.findAllOrderByLiquidity();
      
      // Update rankings
      for (let i = 0; i < creators.length; i++) {
        const creator = creators[i];
        
        // Save previous rank for historical tracking
        const previousRank = creator.rank;
        
        // Update rank (1-based indexing)
        await creatorRepository.updateRank(creator.address, i + 1, previousRank);
        
        // Store historical data point if rank changed
        if (previousRank !== i + 1) {
          await historicalDataRepository.create({
            creatorAddress: creator.address,
            rank: i + 1,
            totalLiquidityUSD: creator.totalLiquidityUSD,
            timestamp: new Date()
          });
        }
      }
      
      logger.info(`Updated rankings for ${creators.length} creators`);
    } catch (error) {
      logger.error('Error updating all rankings', { 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}

export const creatorProcessor = new CreatorProcessor();
