import { NextFunction, Request, Response } from "express";
import {
  createUpdateUser,
  getAllUsers,
  getUserById,
} from "../services/user.service";
import clientPrisma from "../prisma-client";

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = res?.locals || {};
    res.status(200).json({ ...user, dateSync: new Date() } || {});
  } catch (err: any) {
    next(err);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const content = await getAllUsers();
    res.status(200).json(content);
  } catch (err: any) {
    console.error("Error fetching users:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

export const setUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req?.params ?? {};
    const data = req?.body ?? {};
    console.log(id, data);
    const user = await createUpdateUser(req.method, id, data);
    res.status(200).json(user);
  } catch (err: any) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await clientPrisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    next(err);
  }
};
