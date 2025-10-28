import { Router } from 'express';
import tacticsRouter from './tactics';
import techniquesRouter from './techniques';
import groupsRouter from './groups';
import softwareRouter from './software';
import mitigationsRouter from './mitigations';
import analysisRouter from './analysis';
import dataSourceRouter from './dataSource';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'RAPTOR API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routers
router.use('/tactics', tacticsRouter);
router.use('/techniques', techniquesRouter);
router.use('/groups', groupsRouter);
router.use('/software', softwareRouter);
router.use('/mitigations', mitigationsRouter);
router.use('/analysis', analysisRouter);
router.use('/data-source', dataSourceRouter);

export default router;
