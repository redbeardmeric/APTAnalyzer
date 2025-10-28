import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';
import { ApiResponse, DataSourceInfo } from '../types/api';

const router = Router();

/**
 * GET /api/data-source/info
 * Get information about the current ATT&CK data source
 */
router.get('/info', (req: Request, res: Response) => {
  try {
    const info = dataService.getDataSourceInfo();
    const response: ApiResponse<DataSourceInfo> = {
      success: true,
      data: info,
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
