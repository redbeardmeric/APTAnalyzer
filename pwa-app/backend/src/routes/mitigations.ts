import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';
import { ApiResponse, Mitigation } from '../types/api';

const router = Router();

/**
 * GET /api/mitigations
 * Get all mitigations
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const mitigations = dataService.getMitigations();
    const response: ApiResponse<Mitigation[]> = {
      success: true,
      data: mitigations,
      timestamp: new Date().toISOString(),
    };
    return res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
});

export default router;
