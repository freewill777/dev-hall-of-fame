// src/api/routes/index.ts
import { Router } from 'express';
import creatorRoutes from './creators';
import tokenRoutes from './tokens';
import statsRoutes from './stats';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Register routes
router.use('/creators', creatorRoutes);
router.use('/tokens', tokenRoutes);
router.use('/stats', statsRoutes);

export default router;
