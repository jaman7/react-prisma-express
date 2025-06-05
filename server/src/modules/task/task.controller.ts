import { Request, Response, NextFunction } from 'express';
import AppError from '@/utils/appError';
import clientPrisma from '@/prisma-client';
import { ErrorHandler } from '@/utils/errors';
import { redisPublisher } from '@/utils/redis';
import { Task } from '@prisma/client';

// GET /api/tasks
export const getTasksHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, pageSize = 10, columnId, status } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const whereClause: any = {};
    if (columnId) whereClause.columnId = columnId;
    if (status) whereClause.status = status;

    const tasks = await clientPrisma.task.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: { position: 'asc' },
    });

    const totalTasks = await clientPrisma.task.count({ where: whereClause });

    res.status(200).json({
      data: tasks,
      pagination: {
        total: totalTasks,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(totalTasks / Number(pageSize)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
export const getTaskHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await clientPrisma.task.findUnique({
      where: { id },
      include: { assignedTo: true },
    });

    if (!task) {
      return next(new AppError(404, `Task with id ${id} not found`));
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
export const createTaskHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, columnId, position, status } = req.body;

    const column = await clientPrisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });

    if (!column) {
      return next(ErrorHandler.notFound('Column', columnId));
    }

    const task = await clientPrisma.task.create({
      data: {
        title,
        description,
        position,
        status,
        column: { connect: { id: columnId } },
        board: { connect: { id: column.board.id } },
      },
    });

    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    next(ErrorHandler.prismaError(error));
  }
};

// PUT /api/tasks/:id
export const updateTaskHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const { title, description } = req.body;

    const task = await clientPrisma.task.update({
      where: { id },
      data: { title, description },
    });

    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return next(new AppError(404, `Task with id ${id} not found`));
    }
    next(error);
  }
};

// DELETE /api/tasks/:id
export const deleteTaskHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    await clientPrisma.task.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return next(new AppError(404, `Task with id ${id} not found`));
    }
    next(error);
  }
};

// POST /api/tasks/:id/assign
export const assignTaskHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const task = await clientPrisma.task.findUnique({
      where: { id },
      include: { assignedTo: true },
    });
    if (!task) {
      return next(ErrorHandler.notFound('Task', id));
    }

    const updatedTask = await clientPrisma.task.update({
      where: { id },
      data: {
        assignedTo: { connect: { id: userId } },
        history: {
          create: {
            action: 'ASSIGN',
            field: 'assignedTo',
            oldValue: task.assignedTo?.id || null,
            newValue: userId,
          },
        },
      },
    });

    await publishNotification('ASSIGN', userId, id, `You have been assigned to task: ${task.title}`);

    res.status(200).json({ status: 'success', data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/status
export const updateTaskStatusHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, columnId } = req.body;

    const [task, updatedTask]: [Task | null, Task] = await clientPrisma.$transaction([
      clientPrisma.task.findUnique({ where: { id } }),
      clientPrisma.task.update({
        where: { id },
        data: {
          status,
          column: { connect: { id: columnId } },
          history: {
            create: {
              action: 'UPDATE',
              field: 'status',
              oldValue: null,
              newValue: status,
            },
          },
        },
      }),
    ]);

    if (!task) {
      return next(ErrorHandler.notFound('Task', id));
    }

    res.status(200).json({ status: 'success', data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/position
export const updateTaskPositionHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { position } = req.body;

    const task = await clientPrisma.task.findUnique({ where: { id } });

    if (!task) return next(new AppError(404, `Task with id ${id} not found`));

    const updatedTask = await clientPrisma.task.update({
      where: { id },
      data: { position },
    });

    res.status(200).json({ status: 'success', data: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const getTaskHistoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const history = await clientPrisma.taskHistory.findMany({
      where: { taskId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: history });
  } catch (error) {
    next(error);
  }
};

const publishNotification = async (type: string, userId: string, taskId: string, message: string) => {
  const notification = { type, userId, taskId, message, createdAt: new Date() };

  await clientPrisma.notification.create({
    data: {
      type,
      userId,
      taskId,
      message,
    },
  });

  await redisPublisher.publish('notifications', JSON.stringify(notification));
};
