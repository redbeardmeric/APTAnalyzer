import { Router, Request, Response } from 'express';
import analysisService from '../services/analysisService';
import { ApiResponse, AnalysisRequest, AnalysisResponse } from '../types/api';
import { z } from 'zod';

const router = Router();

// Validation schema
const analysisRequestSchema = z.object({
  techniques: z.array(z.string()).default([]),
  software: z.array(z.string()).default([]),
  threshold: z.number().min(0).max(100).default(50),
});

/**
 * POST /api/analysis
 * Analyze techniques and software to rank APT groups
 */
router.post('/', (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = analysisRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid request: ' + validationResult.error.message,
        timestamp: new Date().toISOString(),
      };
      return res.status(400).json(response);
    }

    const request: AnalysisRequest = validationResult.data;

    // Perform analysis
    const results = analysisService.analyzeThreats(request);

    const analysisResponse: AnalysisResponse = {
      results,
      totalGroups: results.length,
      inputCount: request.techniques.length + request.software.length,
      timestamp: new Date().toISOString(),
    };

    const response: ApiResponse<AnalysisResponse> = {
      success: true,
      data: analysisResponse,
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
 * POST /api/analysis/count
 * Get count of potential matches without full analysis
 */
router.post('/count', (req: Request, res: Response) => {
  try {
    const validationResult = analysisRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid request: ' + validationResult.error.message,
        timestamp: new Date().toISOString(),
      };
      return res.status(400).json(response);
    }

    const request: AnalysisRequest = validationResult.data;
    const count = analysisService.countPotentialMatches(
      request.techniques,
      request.software,
      request.threshold || 50
    );

    const response: ApiResponse<{ count: number; threshold: number }> = {
      success: true,
      data: { count, threshold: request.threshold || 50 },
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
