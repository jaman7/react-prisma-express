import clientPrisma from "../prisma-client";

export const getBoardsByUser = async (userId: string, role: string) => {
  if (role === "ADMIN") {
    return await clientPrisma.board.findMany({
      include: {
        BoardOnUser: true,
      },
    });
  } else {
    return await clientPrisma.board.findMany({
      where: {
        BoardOnUser: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        BoardOnUser: true,
      },
    });
  }
};

export const getBoardById = async (id: string) => {
  return await clientPrisma.board.findUnique({
    where: { id },
    include: {
      BoardOnUser: true,
    },
  });
};

export const createUpdateBoard = async (
  type: string,
  id: string,
  data: any
) => {
  const { BoardOnUser, ...boardData } = data;
  if (type === "PUT") {
    return await clientPrisma.board.update({
      where: { id },
      data: {
        ...boardData,
        BoardOnUser: {
          deleteMany: {}, // delete existing BoardOnUser records
          create: BoardOnUser?.map((relation: any) => ({
            boardId: relation.boardId,
            assignedBy: relation.assignedBy,
          })),
        },
      },
      include: {
        BoardOnUser: true,
      },
    });
  } else if (type === "POST") {
    return await clientPrisma.user.create({
      data: { ...boardData },
    });
  }
};
