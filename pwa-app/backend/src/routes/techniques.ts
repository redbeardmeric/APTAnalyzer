import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';
import { ApiResponse, Technique } from '../types/api';

const router = Router();

/**
 * GET /api/techniques
 * Get all techniques, optionally filtered by tactic
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const tacticShortname = req.query.tactic as string | undefined;
    const techniques = dataService.getTechniques(tacticShortname);
    const response: ApiResponse<Technique[]> = {
      success: true,
      data: techniques,
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

/**
 * GET /api/techniques/:id
 * Get a specific technique by ID or external ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const technique = dataService.getTechnique(req.params.id);

    if (!technique) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Technique not found',
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Technique> = {
      success: true,
      data: technique,
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

/**
 * GET /api/techniques/:id/mitigations
 * Get mitigations for a specific technique
 */
router.get('/:id/mitigations', (req: Request, res: Response) => {
  try {
    const technique = dataService.getTechnique(req.params.id);

    if (!technique) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Technique not found',
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    const mitigations = dataService.getTechniqueMitigations(technique.id);
    const response: ApiResponse<typeof mitigations> = {
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
