import { NextFunction, Request, Response } from 'express';
import AppError from '@/utils/appError';
import clientPrisma from '@/prisma-client';

// GET /api/projects/:id
export const getProjectHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await clientPrisma.project.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
        board: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            tasks: true,
            columns: true,
            moveRules: true,
          },
        },
      },
    });

    if (!project) {
      return next(new AppError(404, `Project with id ${id} not found a`));
    }

    const userIds = project?.users?.map((u) => u.userId) ?? [];

    res.status(200).json({
      ...project,
      users: userIds,
    });
  } catch (error) {
    next(error);
  }
};
