import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  const response: ApiResponse<never> = {
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(response);
}

export function notFoundHandler(req: Request, res: Response) {
  const response: ApiResponse<never> = {
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(response);
}
