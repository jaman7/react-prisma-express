import { Request, Response, NextFunction } from 'express';
import AppError from '@/utils/appError';
import clientPrisma from '@/prisma-client';

// GET /api/boards/:id
export const getBoardHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const board = await clientPrisma.board.findUnique({
      where: { id },
      include: { columns: true, tasks: true, project: true }, // Możesz dodać inne relacje, np. tasks
    });

    if (!board) {
      return next(new AppError(404, `Board with id ${id} not found`));
    }

    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

// POST /api/boards
export const createBoardHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, projectId } = req.body;

    const project = await clientPrisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return next(new AppError(404, `Project with id ${projectId} not found`));
    }

    const board = await clientPrisma.board.create({
      data: { name, projectId },
    });

    res.status(201).json({ status: 'success', data: board });
  } catch (error) {
    next(error);
  }
};

// PUT /api/boards/:id
export const updateBoardHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const { name } = req.body;

    const board = await clientPrisma.board.update({
      where: { id },
      data: { name },
    });

    res.status(200).json({ status: 'success', data: board });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return next(new AppError(404, `Board with id ${id} not found`));
    }
    next(error);
  }
};

// DELETE /api/boards/:id
export const deleteBoardHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    await clientPrisma.board.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return next(new AppError(404, `Board with id ${id} not found`));
    }
    next(error);
  }
};

// GET /api/boards/dictionary/user/:userId
// export const getBoardsByUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { userId } = req.params;

//     const user = await clientPrisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return next(new AppError(404, `User with id ${userId} not found`));
//     }

//     const boards = await clientPrisma.board.findMany({
//       where: {
//         project: {
//           users: {
//             some: { userId },
//           },
//         },
//       },
//       select: {
//         id: true,
//         name: true,
//         projectId: true,
//       },
//     });

//     // Tworzenie słownika
//     const dictionary = boards.map((board) => ({
//       id: board.id,
//       displayName: board.name,
//       projectId: board.projectId,
//     }));

//     res.status(200).json(dictionary);
//   } catch (error) {
//     next(error);
//   }
// };
