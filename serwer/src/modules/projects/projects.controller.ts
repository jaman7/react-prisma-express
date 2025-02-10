import { NextFunction, Request, Response } from 'express';
import AppError from '@/utils/appError';
import clientPrisma from '@/prisma-client';

// GET /api/projects
export const getProjectsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sortBy = 'createdAt', sortOrder = 'asc', filterBy, filterValue, page = 0, pageSize = 10 } = req.query;

    const validSortColumns = ['name', 'createdAt', 'updatedAt'];
    const validSortOrder = ['asc', 'desc'];

    console.log('validSortColumns', validSortColumns.includes(sortBy as string));

    if (!validSortColumns.includes(sortBy as string)) {
      res.status(400).json({ error: 'Invalid sort column' });
      return;
    }

    if (!validSortOrder.includes(sortOrder as string)) {
      res.status(400).json({ error: 'Invalid sort order' });
      return;
    }

    const whereClause =
      filterBy && filterValue
        ? {
            [filterBy as string]: {
              contains: filterValue,
              mode: 'insensitive',
            },
          }
        : {};

    const skip = Number(page) * Number(pageSize);
    const take = Number(pageSize);

    const projects = await clientPrisma.project.findMany({
      where: whereClause,
      orderBy: { [sortBy as string]: sortOrder },
      skip,
      take,
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
          },
        },
        boards: {
          select: {
            id: true,
            name: true,
            tasks: {
              select: {
                id: true,
                title: true,
                status: true,
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
          },
        },
      },
    });

    const enrichedProjects = projects?.map((project) => {
      const { boards, users, ...rest } = project || {};
      const allTasks = boards?.[0]?.tasks ?? [];
      const countAll = allTasks?.length ?? 0;
      const countDone = allTasks?.filter((task) => task.status === 'DONE')?.length ?? 0;
      const countNotDone = countAll - countDone;
      const allUsers = users.map((user) => ({ ...user.user }));
      return {
        ...rest,
        users: allUsers,
        countAll,
        countDone,
        countNotDone,
      };
    });

    const totalProjects = await clientPrisma.project.count({
      where: whereClause,
    });

    res.status(200).json({
      data: enrichedProjects,
      pagination: {
        total: totalProjects,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(totalProjects / Number(pageSize)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
export const getProjectHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await clientPrisma.project.findUnique({ where: { id } });

    if (!project) {
      return next(new AppError(404, `Project with id ${id} not found a`));
    }

    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects
export const createProjectHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, isActive } = req.body;

    const project = await clientPrisma.project.create({
      data: { name, description, isActive },
    });

    res.status(201).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id
export const updateProjectHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const project = await clientPrisma.project.update({
      where: { id },
      data: { name, description, isActive },
    });

    res.status(200).json({ status: 'success', data: project });
  } catch (error: any) {
    const { id } = req.params;
    if (error.code === 'P2025') {
      return next(new AppError(404, `Project with id ${id} not found b`));
    }
    next(error);
  }
};

// DELETE /api/projects/:id
export const deleteProjectHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    await clientPrisma.project.delete({ where: { id } });

    res.status(204).send();
  } catch (error: any) {
    const { id } = req.params;
    if (error.code === 'P2025') {
      return next(new AppError(404, `Project with id ${id} not found c`));
    }
    next(error);
  }
};

// GET /api/projects/dictionary
export const getProjectsDictionaryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(res);
  try {
    const projects = await clientPrisma.project.findMany({
      select: {
        id: true,
        name: true,
        boards: {
          select: { id: true }, // Pobieramy tylko ID tablic przypisanych do projektu
        },
      },
    });

    const dictionary = projects.map((project) => ({
      id: project.id,
      displayName: project.name,
      boards: project.boards.map((board) => board.id),
    }));

    res.status(200).json(dictionary);
  } catch (error) {
    next(error);
  }
};

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
      select: { id: true, name: true },
    });

    const dictionary = projects.map((project) => ({
      id: project.id,
      displayName: project.name,
    }));

    res.status(200).json({ status: 'success', data: dictionary });
  } catch (error) {
    next(error);
  }
};
