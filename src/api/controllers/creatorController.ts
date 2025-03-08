import { Request, Response, NextFunction } from 'express';
import { creatorRepository } from '../../database/repositories/creatorRepository';

export const creatorController = {
  async getAllCreators(req: Request, res: Response, next: NextFunction) {
    try {
      const creators = await creatorRepository.findAllWithFilters(req.query);
      res.json(creators);
    } catch (error) {
      next(error);
    }
  },

  async getCreatorByAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const creator = await creatorRepository.findByAddress(req.params.address);
      if (!creator) {
        return res.status(404).json({ error: 'Creator not found' });
      }
      res.json(creator);
    } catch (error) {
      next(error);
    }
  },

  async getCreatorTokens(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Get creator tokens not yet implemented' });
  },

  async getCreatorHistory(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Get creator history not yet implemented' });
  }
}; 