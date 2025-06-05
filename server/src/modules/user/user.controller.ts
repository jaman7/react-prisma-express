import { Request, Response, NextFunction } from 'express';
import AppError from '@/utils/appError';
import bcrypt from 'bcryptjs';
import clientPrisma from '@/prisma-client';

// GET /api/users
export const getUsersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const users = await clientPrisma.user.findMany({
      where: whereClause,
      orderBy: { [sortBy as string]: sortOrder },
      skip,
      take,
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        deletedAt: true,
        location: true,
        title: true,
        phone: true,
        activeProjectId: true,
        projects: {
          select: {
            projectId: true,
          },
        },
        tasks: {
          select: {
            id: true,
          },
        },
      },
    });

    const result = users.map((user) => ({
      ...user,
      projects: user.projects.map((p) => p.projectId),
      tasks: user.tasks.map((t) => t.id),
    }));

    console.log(users);

    const totalUsers = await clientPrisma.user.count({ where: whereClause });

    res.status(200).json({
      data: result,
      pagination: {
        total: totalUsers,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(totalUsers / Number(pageSize)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/me
export const getMeHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = res.locals || {};

    if (!user?.id) return next(new AppError(401, 'Unauthorized'));

    const me = await clientPrisma.user.findUnique({
      where: { id: user.id },
      include: {
        projects: {
          select: {
            projectId: true,
            role: true,
            assignedAt: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
        },
        Notification: {
          where: { userId: user.id },
          select: {
            id: true,
            type: true,
            message: true,
            createdAt: true,
            task: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!me) return next(new AppError(404, `User with id ${user.id} not found`));

    const { Notification, ...rest } = me || {};

    res.status(200).json({
      ...rest,
      notification: me.Notification,
      dateSync: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/me
export const updateMeHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedUser = await clientPrisma.user.update({
      where: { id: res.locals.user.id },
      data: req.body,
    });

    res.status(200).json({ status: 'success', data: updatedUser });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/users/me/password
export const changePasswordHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await clientPrisma.user.findUnique({
      where: { id: res.locals.user.id },
    });

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) return next(new AppError(400, 'Incorrect old password'));

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await clientPrisma.user.update({
      where: { id: res.locals.user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// CRUD dla ADMIN

// GET /api/users/:id
export const getUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await clientPrisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) return next(new AppError(404, 'User not found'));

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

// POST /api/users
export const createUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = await clientPrisma.user.create({
      data: { ...req.body, password: hashedPassword },
    });

    res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
export const updateUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedUser = await clientPrisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json({ status: 'success', data: updatedUser });
  } catch (error) {
    if ((error as any).code === 'P2025') return next(new AppError(404, 'User not found'));

    next(error);
  }
};

// DELETE /api/users/:id
export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = res.locals.user;

    if (currentUser.role !== 'ADMIN') return next(new AppError(403, 'Only administrators can delete users'));

    if (currentUser.id === id) return next(new AppError(400, 'You cannot delete yourself'));

    const userToDelete = await clientPrisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) return next(new AppError(404, `User with id ${id} not found`));

    await clientPrisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') return next(new AppError(404, 'User not found'));

    next(error);
  }
};

// PATCH /api/users/me/activeProjectId
export const updateActiveProjectIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = res.locals;
    const { activeProjectId } = req.body;

    console.log('activeProjectId', activeProjectId);

    if (!activeProjectId) {
      return next(new AppError(400, 'activeProjectId is required'));
    }

    const project = await clientPrisma.project.findUnique({
      where: { id: activeProjectId },
    });

    if (!project) {
      return next(new AppError(404, `Project with id ${activeProjectId} not found`));
    }

    const updatedUser = await clientPrisma.user.update({
      where: { id: user.id },
      data: { activeProjectId },
      select: { id: true, activeProjectId: true },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// GET User dictionary /api/users/dictionary
export const getUserDictionaryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await clientPrisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
      },
    });

    const dictionary = users.map((user) => ({
      id: user.id,
      displayName: `${user.name} ${user.lastName || ''}`.trim(),
    }));

    res.status(200).json(dictionary);
  } catch (error) {
    next(error);
  }
};
