import { Request, Response, NextFunction } from 'express';

/**
 * Utility to handle async route handlers.
 * Wraps async functions and passes errors to the global error handler.
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);
