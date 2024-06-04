import { NextFunction, Request, Response } from "express";

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(res);
  try {
    res
      .status(200)
      .status(200)
      .json(res?.locals?.user || {});
  } catch (err: any) {
    next(err);
  }
};
