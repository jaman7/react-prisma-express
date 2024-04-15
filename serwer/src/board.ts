import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function createBoard(name: string) {
  return prisma.board.create({
    data: {
      name,
    },
  });
}

export async function getBoards() {
  return prisma.board.findMany();
}

export async function updateBoard(id: any, name?: string) {
  return prisma.board.update({
    where: { id },
    data: { name },
  });
}

export async function deleteBoard(id: any) {
  return prisma.board.delete({
    where: { id },
  });
}

export default { createBoard, getBoards, updateBoard, deleteBoard };
