import { NextFunction, Request, Response } from 'express';
import AppError from '@/utils/appError';
import clientPrisma from '@/prisma-client';

// GET /api/projects/dictionary/user/:userId
export const getUserProjectsDictionaryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await clientPrisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(new AppError(404, `User with id ${userId} not found`));
    }

    const projects = await clientPrisma.project.findMany({
      where: {
        users: {
          some: { userId },
        },
      },
      select: { id: true, name: true, isActive: true },
    });

    const dictionary =
      projects?.map((project) => ({
        id: project.id,
        displayName: project.name,
        isActive: project.isActive,
      })) ?? [];

    res.status(200).json(dictionary);
  } catch (error) {
    next(error);
  }
};
