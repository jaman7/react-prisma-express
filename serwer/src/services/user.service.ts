import { PrismaClient, Prisma, User } from "@prisma/client";
import config from "config";
import redisClient from "../utils/connectRedis";
import { signJwt } from "../utils/jwt";
import clientPrisma from "../prisma-client";

export const excludedFields = ["password", "verified", "verificationCode"];

export const createUser = async (input: Prisma.UserCreateInput) => {
  return (await clientPrisma.user.create({
    data: input,
  })) as User;
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return (await clientPrisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const signTokens = async (user: Prisma.UserCreateInput) => {
  // 1. Create Session
  redisClient.set(`${user.id}`, JSON.stringify(user), {
    EX: config.get<number>("redisCacheExpiresIn") * 60,
  });

  // 2. Create Access and Refresh tokens
  const accessToken = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  const refreshToken = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
  });

  return { accessToken, refreshToken };
};
