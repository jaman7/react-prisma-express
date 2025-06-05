import { Request, Response, NextFunction } from 'express';

export const validateQueryParams = (req: Request, res: Response, next: NextFunction): void => {
  const { page, pageSize } = req.query;

  if (page && isNaN(Number(page))) {
    res.status(400).json({ error: 'Page must be a valid number' });
    return;
  }

  if (pageSize && isNaN(Number(pageSize))) {
    res.status(400).json({ error: 'Page size must be a valid number' });
    return;
  }

  next(); // Jeśli wszystko jest poprawne, przejdź dalej
};
