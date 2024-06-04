import crypto from "crypto";
import { CookieOptions, NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { LoginUserInput, RegisterUserInput } from "../schemas/user.schema";
import {
  createUser,
  excludedFields,
  findUniqueUser,
  signTokens,
} from "../services/user.service";
import { Prisma } from "@prisma/client";
import config from "config";
import AppError from "../utils/appError";
import redisClient from "../utils/connectRedis";
import { signJwt, verifyJwt } from "../utils/jwt";
import { omit } from "lodash";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const accessTokenCookieOptions = (): any => {
  const offset = config.get<number>("accessTokenExpiresIn") * 60 * 1000;
  const utcDate = new Date(Date.now() + offset);
  return {
    ...cookiesOptions,
    expires: utcDate.toISOString(),
    maxAge: offset,
  };
};

const refreshTokenCookieOptions = (): any => {
  const offset = config.get<number>("refreshTokenExpiresIn") * 60 * 1000;
  const utcDate = new Date(Date.now() + offset);
  return {
    ...cookiesOptions,
    expires: utcDate.toISOString(),
    maxAge: offset,
  };
};

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const verifyCode = crypto.randomBytes(32).toString("hex");
    const verificationCode = crypto
      .createHash("sha256")
      .update(verifyCode)
      .digest("hex");

    const user = await createUser({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      verificationCode,
    });

    const newUser = omit(user, excludedFields);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          status: "fail",
          message: "Email already exist, please use another email address",
        });
      }
    }
    next(err);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await findUniqueUser(
      { email: email.toLowerCase() },
      { id: true, email: true, verified: true, password: true }
    );
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError(400, "Invalid email or password"));
    }
    const { accessToken, refreshToken } = await signTokens(user);
    res.status(200).json({
      status: "success",
      accessToken,
      accessTokenExpiresAt: accessTokenCookieOptions().expires,
      refreshToken,
      refreshTokenExpiresAt: refreshTokenCookieOptions().expires,
    });
  } catch (err: any) {
    next(err);
  }
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    const message = "Could not refresh access token";
    if (!refreshToken) {
      return next(new AppError(403, message));
    }

    const decoded = verifyJwt<{ sub: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );
    if (!decoded) {
      return next(new AppError(403, message));
    }

    const session = await redisClient.get(decoded.sub);
    if (!session) {
      return next(new AppError(403, message));
    }

    const user = await findUniqueUser({ id: JSON.parse(session).id });
    if (!user) {
      return next(new AppError(403, message));
    }

    const { accessToken: accessTokenRes, refreshToken: refreshTokenRes } =
      await signTokens(user);
    res.status(200).json({
      status: "success",
      accessToken: accessTokenRes,
      accessTokenExpiresAt: accessTokenCookieOptions().expires,
      refreshToken: refreshTokenRes,
      refreshTokenExpiresAt: refreshTokenCookieOptions().expires,
    });
  } catch (err: any) {
    next(err);
  }
};

export const logoutUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(res);
  try {
    await redisClient.del(res.locals.user.id);
    res.status(200).json({
      status: "success",
    });
  } catch (err: any) {
    next(err);
  }
};
