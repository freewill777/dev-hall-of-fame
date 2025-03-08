// src/api/controllers/creatorController.ts
import { Request, Response, NextFunction } from 'express';
import { creatorRepository } from '../../database/repositories/creatorRepository';
import { tokenRepository } from '../../database/repositories/tokenRepository';
import { FilterOptions } from '../../types';
import { logger } from '../../utils/logger';

export const creatorController = {
  /**
   * Get all creators (paginated and filtered)
   */
  async getAllCreators(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: FilterOptions = {
        timeRange: req.query.timeRange as any,
        minLiquidityUSD: req.query.minLiquidity ? Number(req.query.minLiquidity) : undefined,
        maxRank: req.query.maxRank ? Number(req.query.maxRank) : undefined,
        sortBy: req.query.sortBy as any || 'liquidityUSD',
        sortDirection: req.query.sortDirection as any || 'desc',
        limit: req.query.limit ? Number(req.query.limit) : 50,
        offset: req.query.offset ? Number(req.query.offset) : 0
      };
      
      const creators = await creatorRepository.findAllWithFilters(filters);
      const totalCount = await creatorRepository.countWithFilters(filters);
      
      res.json({
        creators,
        totalCount,
        page: Math.floor(filters.offset! / filters.limit!) + 1,
        pageSize: filters.limit,
        filters,
        lastUpdated: new Date()
      });
    } catch (error) {
      logger.error('Error getting all creators', { 
        error: error instanceof Error ? error.message : String(error)
      });
      next(error);
    }
  },
  
  /**
   * Get a single creator by address
   */
  async getCreatorByAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { address } = req.params;
      
      const creator = await creatorRepository.findByAddress(address);
      if (!creator) {
        res.status(404).json({ message: 'Creator not found' });
        return;
      }
      
      // Get creator's tokens
      const tokens = await tokenRepository.findByCreator(address);