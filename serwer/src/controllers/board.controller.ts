import { NextFunction, Request, Response } from "express";
import clientPrisma from "../prisma-client";
import {
  createUpdateBoard,
  getBoardById,
  getBoardsByUser,
} from "../services/board.service";

export const getAllBoardsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = user.id;
    const role = user.role;
    const boards = await getBoardsByUser(userId, role);
    res.status(200).json(boards);
  } catch (err) {
    next(err);
  }
};

export const getBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const board = await getBoardById(id);

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    res.status(200).json(board);
  } catch (err: any) {
    next(err);
  }
};

export const setBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req?.params ?? {};
    const data = req?.body ?? {};
    const board = await createUpdateBoard(req.method, id, data);
    res.status(200).json(board);
  } catch (err: any) {
    next(err);
  }
};

export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await clientPrisma.board.delete({
      where: { id },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    next(err);
  }
};

export const assignUsersToBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boardId } = req.params;
    const { userIds } = req.body;
    const adminId = res.locals.user.id;

    const adminUser = await clientPrisma.user.findUnique({
      where: { id: adminId },
    });
    if (adminUser?.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const board = await clientPrisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    const assignments = userIds.map((userId: string) => ({
      userId,
      boardId,
      assignedBy: adminId,
    }));

    await clientPrisma.boardOnUser.createMany({
      data: assignments,
      skipDuplicates: true,
    });

    res.status(200).json({ message: "Users assigned successfully" });
  } catch (error) {
    next(error);
  }
};
