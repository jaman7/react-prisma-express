import { NextFunction, Request, Response } from 'express';
import AppError from '@/utils/appError';
import clientPrisma from '@/prisma-client';

// PUT /api/projects/:id
export const updateProjectHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const project = await clientPrisma.project.update({
      where: { id },
      data: {
        name,
        description,
        isActive,
      },
      include: {
        users: {
          select: { userId: true },
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

    const userIds = project?.users?.map((u) => u.userId) ?? [];

    res.status(200).json({
      ...project,
      users: userIds,
    });
  } catch (error) {
    const { id } = req.params;
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return next(new AppError(404, `Project with id ${id} not found`));
    }
    next(error);
  }
};
