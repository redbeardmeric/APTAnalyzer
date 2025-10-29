import { Router, Request, Response } from 'express';
import dataService from '../services/dataService';
import { ApiResponse, Group } from '../types/api';

const router = Router();

/**
 * GET /api/groups
 * Get all groups
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const groups = dataService.getGroups();
    const response: ApiResponse<Group[]> = {
      success: true,
      data: groups,
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
 * GET /api/groups/:id
 * Get a specific group by ID or external ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const group = dataService.getGroup(req.params.id);

    if (!group) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Group not found',
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Group> = {
      success: true,
      data: group,
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
 * GET /api/groups/:id/techniques
 * Get all techniques used by a specific group
 */
router.get('/:id/techniques', (req: Request, res: Response) => {
  try {
    const group = dataService.getGroup(req.params.id);

    if (!group) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Group not found',
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    const techniques = dataService.getGroupTechniques(group.id);
    const response: ApiResponse<typeof techniques> = {
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
 * GET /api/groups/:id/software
 * Get all software used by a specific group
 */
router.get('/:id/software', (req: Request, res: Response) => {
  try {
    const group = dataService.getGroup(req.params.id);

    if (!group) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Group not found',
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    const software = dataService.getGroupSoftware(group.id);
    const response: ApiResponse<typeof software> = {
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
