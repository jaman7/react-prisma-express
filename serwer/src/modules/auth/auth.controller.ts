import crypto from 'crypto';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import config from 'config';
import { createUser, excludedFields, findUniqueUser } from '@/modules/user/user.service';
import AppError from '@/utils/appError';
import redisClient from '@/utils/connectRedis';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { omit } from 'lodash';
import { LoginUserInput } from './auth.schema';
import { RegisterUserInput } from '@/modules/user/user.schema';
import tokenService from '@/services/token.service';

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

const accessTokenCookieOptions = (): any => {
  const offset = config.get<number>('accessTokenExpiresIn') * 60 * 1000;
  const utcDate = new Date(Date.now() + offset);
  return {
    ...cookiesOptions,
    expires: utcDate.toISOString(),
    maxAge: offset,
  };
};

const refreshTokenCookieOptions = (): any => {
  const offset = config.get<number>('refreshTokenExpiresIn') * 60 * 1000;
  const utcDate = new Date(Date.now() + offset);
  return {
    ...cookiesOptions,
    expires: utcDate.toISOString(),
    maxAge: offset,
  };
};

export const registerUserHandler = async (req: Request<{}, {}, RegisterUserInput>, res: Response, next: NextFunction) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const verifyCode = crypto.randomBytes(32).toString('hex');
    const verificationCode = crypto.createHash('sha256').update(verifyCode).digest('hex');
    const user = await createUser({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      verificationCode,
    });
    const newUser = omit(user, excludedFields);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return next(new AppError(409, 'Email already exists, please use another email address'));
    }
    next(err);
  }
};

export const loginUserHandler = async (req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req?.body || {};
    const user = await findUniqueUser({ email: email.toLowerCase() }, { id: true, email: true, verified: true, password: true });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError(400, 'Invalid email or password'));
    }
    const { accessToken, refreshToken } = await tokenService.signTokens(user);
    const data = {
      status: 'success',
      accessToken,
      accessTokenExpiresAt: accessTokenCookieOptions().expires,
      refreshToken,
      refreshTokenExpiresAt: refreshTokenCookieOptions().expires,
    };
    res.status(200).json(data);
  } catch (err: any) {
    next(err);
  }
};

export const refreshAccessTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body || {};

    const message = 'Could not refresh access token';
    if (!refreshToken) {
      return next(new AppError(403, message));
    }

    const decoded = tokenService.verifyJwt<{ sub: string; jti: string }>(refreshToken, 'refreshTokenPublicKey');
    if (!decoded) {
      return next(new AppError(403, message));
    }

    const session = await redisClient.get(decoded.sub);
    if (!session) {
      return next(new AppError(403, message));
    }

    const sessionData = JSON.parse(session);

    // Validate refreshToken ID (jti)
    if (sessionData.refreshTokenId !== decoded.jti) {
      return next(new AppError(403, message));
    }

    // Fetch full user details
    const user = await findUniqueUser({ id: decoded.sub });
    if (!user) {
      return next(new AppError(404, `User with id ${decoded.sub} not found`));
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await tokenService.signTokens(user);

    // Update Redis with new refreshTokenId
    redisClient.set(
      `${decoded.sub}`,
      JSON.stringify({
        ...sessionData,
        refreshTokenId: JSON.parse(Buffer.from(newRefreshToken.split('.')[1], 'base64').toString()).jti,
      }),
      { EX: config.get<number>('redisCacheExpiresIn') * 60 }
    );

    res.status(200).json({
      status: 'success',
      accessToken,
      accessTokenExpiresAt: accessTokenCookieOptions().expires,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: refreshTokenCookieOptions().expires,
    });
  } catch (err: any) {
    next(err);
  }
};

export const logoutUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisClient.del(res.locals.user.id);
    res.status(200).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};
