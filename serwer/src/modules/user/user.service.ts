import clientPrisma from '@/prisma-client';
import { Prisma, User } from '@prisma/client';

export const excludedFields = ['password', 'verified', 'verificationCode'];

export const createUser = async (input: Prisma.UserUncheckedCreateInput) => {
  return (await clientPrisma.user.create({
    data: input,
  })) as User;
};

export const findUniqueUser = async (where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) => {
  return (await clientPrisma.user.findUnique({
    where,
    select,
  })) as User;
};
