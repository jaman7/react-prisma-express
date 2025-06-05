import { NextFunction, Request, Response } from 'express';
import clientPrisma from '@/prisma-client';

// GET /api/projects
export const getProjectsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sortBy = 'createdAt', sortOrder = 'asc', filterBy, filterValue, page = 0, pageSize = 10, isArchive } = req.query;

    const validSortColumns = ['name', 'createdAt', 'updatedAt'];
    const validSortOrder = ['asc', 'desc'];

    if (!validSortColumns.includes(sortBy as string)) {
      res.status(400).json({ error: 'Invalid sort column' });
      return;
    }

    if (!validSortOrder.includes(sortOrder as string)) {
      res.status(400).json({ error: 'Invalid sort order' });
      return;
    }

    const skip = Number(page) * Number(pageSize);
    const take = Number(pageSize);

    // Budujemy warunki filtrowania
    const whereClause: Record<string, unknown> = {};

    if (typeof isArchive === 'string') {
      whereClause.isArchive = isArchive === 'true';
    }

    if (filterBy && filterValue) {
      whereClause[filterBy as string] = {
        contains: filterValue,
        mode: 'insensitive',
      };
    }

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
        board: {
          select: {
            id: true,
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

    const enrichedProjects =
      projects?.map((project) => {
        const { board, users, ...rest } = project || {};
        const allTasks = board?.tasks ?? [];
        const taskCountAll = allTasks?.length ?? 0;
        const taskCountDone = allTasks?.filter((task) => task.status === 'DONE')?.length ?? 0;
        const taskCountNotDone = taskCountAll - taskCountDone;
        const allUsers = users.map((user) => ({ ...user.user }));
        return {
          ...rest,
          users: allUsers,
          taskCountAll,
          taskCountDone,
          taskCountNotDone,
        };
      }) ?? [];

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
