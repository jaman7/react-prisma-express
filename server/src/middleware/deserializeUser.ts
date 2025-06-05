import { NextFunction, Request, Response } from 'express';
import AppError from '@/utils/appError';
import tokenService from '@/services/token.service';
import redisClient from '@/utils/connectRedis';
import { omit } from 'lodash';
import { excludedFields, findUniqueUser } from '@/modules/user/user.service';

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      accessToken = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    }
    if (!accessToken) {
      return next(new AppError(401, 'You are not logged in'));
    }
    const decoded = tokenService.verifyJwt<{ sub: string }>(accessToken, 'accessTokenPublicKey');
    if (!decoded) {
      return next(new AppError(401, `Invalid token or user doesn't exist`));
    }
    const session = await redisClient.get(decoded.sub);
    if (!session) {
      return next(new AppError(401, `Invalid token or session has expired`));
    }
    const user = await findUniqueUser({ id: JSON.parse(session).id });
    if (!user) {
      return next(new AppError(401, `Invalid token or session has expired`));
    }
    res.locals.user = omit(user, excludedFields);
    next();
  } catch (err: any) {
    next(err);
  }
};
