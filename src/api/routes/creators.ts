// src/api/routes/creators.ts
import { Router } from 'express';
import { creatorController } from '../controllers/creatorController';

const router = Router();

// Get all creators (with filtering and pagination)
router.get('/', creatorController.getAllCreators);

// Get a specific creator by address
router.get('/:address', creatorController.getCreatorByAddress as any);

// Get creator's tokens
router.get('/:address/tokens', creatorController.getCreatorTokens);

// Get creator's historical rankings
router.get('/:address/history', creatorController.getCreatorHistory);

export default router;
