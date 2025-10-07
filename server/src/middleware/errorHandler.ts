import type { Request, Response, NextFunction } from 'express';
import { ApiError, isApiError } from '../utils/ApiError.js';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (isApiError(err)) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  if (err instanceof Error && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const statusCode = err instanceof Error && (err as any).statusCode ? (err as any).statusCode : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  return res.status(statusCode).json({ message });
};

export const asyncHandler = <T extends (req: Request, res: Response, next: NextFunction) => Promise<any>>(fn: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};


