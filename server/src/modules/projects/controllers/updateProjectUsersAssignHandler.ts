import { NextFunction, Request, Response } from 'express';
import clientPrisma from '@/prisma-client';
import AppError from '@/utils/appError';

// PUT /api/projects/users/:projectId
export const updateProjectUsersAssignHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId: id } = req.params;
    const { userIds = [] } = req.body;

    // Usuń wszystkich przypisanych użytkowników
    await clientPrisma.projectOnUser.deleteMany({
      where: { projectId: id },
    });

    // Dodaj nowe przypisania
    await clientPrisma.projectOnUser.createMany({
      data: userIds.map((userId: string) => ({
        projectId: id,
        userId,
      })),
      skipDuplicates: true,
    });

    const project = await clientPrisma.project.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!project) {
      return next(new AppError(404, `Project with id ${id} not found a`));
    }

    const usersIds = project?.users?.map((u) => u.userId) ?? [];

    res.status(200).json({
      ...project,
      users: usersIds,
    });
  } catch (error) {
    next(error);
  }
};
