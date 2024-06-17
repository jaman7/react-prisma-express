import { PrismaClient, Prisma, User } from "@prisma/client";
import config from "config";
import redisClient from "../utils/connectRedis";
import { signJwt } from "../utils/jwt";
import clientPrisma from "../prisma-client";

export const excludedFields = ["password", "verified", "verificationCode"];

interface GetAllUsersParams {
  page: number;
  perPage: number;
  sortBy: string;
  sortOrder: Prisma.SortOrder;
  filters: Record<string, any>;
}

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

export const getUserById = async (id: string) => {
  return await clientPrisma.user.findUnique({
    where: { id },
    include: {
      BoardOnUser: true,
    },
  });
};

export const createUpdateUser = async (type: string, id: string, data: any) => {
  const { BoardOnUser, ...userData } = data;
  if (type === "PUT") {
    return await clientPrisma.user.update({
      where: { id },
      data: {
        ...userData,
        BoardOnUser: {
          deleteMany: {}, // delete existing BoardOnUser records
          create: BoardOnUser?.map((relation: any) => ({
            boardId: relation.boardId,
            assignedBy: relation.assignedBy,
          })),
        },
      },
      include: {
        BoardOnUser: true,
      },
    });
  } else if (type === "POST") {
    return await clientPrisma.user.create({
      data: { ...userData },
    });
  }
};

export const getAllUsers = async () => {
  return await clientPrisma.user.findMany({
    include: {
      BoardOnUser: true,
    },
  });
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
