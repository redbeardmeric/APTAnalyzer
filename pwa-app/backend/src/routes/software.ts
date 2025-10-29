import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';
import { ApiResponse, Software } from '../types/api';

const router = Router();

/**
 * GET /api/software
 * Get all software (malware and tools)
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const software = dataService.getSoftware();
    const response: ApiResponse<Software[]> = {
      success: true,
      data: software,
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
