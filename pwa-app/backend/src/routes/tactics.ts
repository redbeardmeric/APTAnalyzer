import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';
import { ApiResponse, Tactic } from '../types/api';

const router = Router();

/**
 * GET /api/tactics
 * Get all tactics
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const tactics = dataService.getTactics();
    const response: ApiResponse<Tactic[]> = {
      success: true,
      data: tactics,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(response);
  }
});

export default router;
