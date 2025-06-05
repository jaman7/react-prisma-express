import { NextFunction, Request, Response } from 'express';
import clientPrisma from '@/prisma-client';

// GET /api/projects/dictionary
export const getProjectsDictionaryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(res);
  try {
    const projects = await clientPrisma.project.findMany({
      select: {
        id: true,
        name: true,
        board: {
          select: { id: true },
        },
      },
    });

    const dictionary =
      projects?.map((project) => ({
        id: project.id,
        displayName: project.name,
        board: project.board,
      })) ?? [];

    res.status(200).json(dictionary);
  } catch (error) {
    next(error);
  }
};
