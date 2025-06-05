import { NextFunction, Request, Response } from 'express';
import AppError from '@/utils/appError';
import clientPrisma from '@/prisma-client';

// GET /api/projects/user/:userId
export const getProjectsUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await clientPrisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(new AppError(404, `User with id ${userId} not found`));
    }

    const projects = await clientPrisma.project.findMany({
      where: {
        isArchive: false,
        users: {
          some: { userId },
        },
      },
      include: {
        users: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                image: true,
                role: true,
              },
            },
            role: true,
            assignedAt: true,
          },
        },
        board: {
          include: {
            columns: true,
            tasks: {
              include: {
                assignedTo: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                    lastName: true,
                  },
                },
              },
            },
            moveRules: true,
          },
        },
      },
    });

    const enrichedProjects =
      projects?.map((project) => {
        const { users, board, ...rest } = project;
        const allTasks = board?.tasks ?? [];
        const countAll = allTasks?.length ?? null;
        const countDone = allTasks?.filter((task) => task.status === 'DONE')?.length ?? null;
        const countNotDone = countAll - countDone;

        const allUsers = users?.map(({ user }) => ({ ...user })) ?? [];

        return {
          ...rest,
          board,
          users: allUsers,
          countAll,
          countDone,
          countNotDone,
        };
      }) ?? [];

    res.status(200).json(enrichedProjects);
  } catch (error) {
    next(error);
  }
};
