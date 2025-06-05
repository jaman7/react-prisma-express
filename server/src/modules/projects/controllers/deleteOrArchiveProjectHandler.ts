import { Request, Response, NextFunction } from 'express';
import clientPrisma from '@/prisma-client';
import AppError from '@/utils/appError';

// DELETE /api/projects/:id
export const deleteOrArchiveProjectHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    // policz ile jest zadań powiązanych z projektem
    const taskCount = await clientPrisma.task.count({
      where: {
        board: {
          projectId: id,
        },
      },
    });

    if (taskCount === 0) {
      await clientPrisma.project.delete({
        where: { id },
      });

      res.status(200).json({ status: 'Project deleted', message: `Project ${id} deleted permanently.` });
    } else {
      await clientPrisma.project.update({
        where: { id },
        data: {
          isArchive: true,
          updatedAt: new Date(),
        },
      });

      res.status(200).json({ status: 'Project archived', message: `Project ${id} archived because it contains tasks.` });
    }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return next(new AppError(404, `Project with id ${id} not found.`));
    }
    next(error);
  }
};
