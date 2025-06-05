import { NextFunction, Request, Response } from 'express';
import clientPrisma from '@/prisma-client';

// POST /api/projects
export const createProjectHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, isActive } = req.body;

    const board = await clientPrisma.board.create({
      data: {},
    });

    const project = await clientPrisma.project.create({
      data: {
        name,
        description,
        isActive,
        boardId: board.id,
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

    res.status(201).json({
      ...project,
      users: userIds,
    });
  } catch (error) {
    next(error);
  }
};
