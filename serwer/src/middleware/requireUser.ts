import { NextFunction, Request, Response } from 'express';
import AppError from '@/utils/appError';

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) {
    return next(new AppError(401, 'Session expired or user not authenticated'));
  }
  next();
};
