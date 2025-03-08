import { Router } from 'express';
const router = Router();

// TODO: Implement stats routes
router.get('/', (req, res) => {
  res.json({ message: 'Stats routes not yet implemented' });
});

export default router; 