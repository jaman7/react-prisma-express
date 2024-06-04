import prisma from "../prisma-client";

export async function getBoards() {
  return prisma.board.findMany({
    include: {
      columns: true,
      tasks: true,
    },
  });
}

export async function createBoard(payload: any) {
  const { columns, ...rest } = payload;
  return prisma.board.create({
    data: {
      ...rest,
      columns: {
        create: [...columns],
      },
    },
  });
}

export async function updateBoard(id: string, payload: any) {
  const { columns, ...rest } = payload || {};
  const currColumns =
    columns
      ?.map((col: { id: string; name: string; position: number }) => ({
        id: col.id,
        name: col.name,
        position: col.position,
      }))
      ?.filter((item: { id: string }) => item.id) ?? [];
  const newColumns =
    columns
      ?.map((col: { id: string; name: string; position: number }) => ({
        name: col.name,
        position: col.position,
      }))
      ?.filter((item: { id: string }) => !item.id) ?? [];
  const columnIds = columns.map((col: any) => col.id).filter(Boolean);
  return prisma.board.update({
    where: {
      id,
    },
    data: {
      ...rest,
      columns: {
        deleteMany: { id: { notIn: columnIds } },
        updateMany: currColumns.map((col: any) => ({
          where: { id: col.id },
          data: col,
        })),
        create: newColumns ?? [],
      },
    },
    include: {
      columns: true,
    },
  });
}

export async function deleteBoard(id: string) {
  return prisma.board.delete({
    where: { id },
  });
}

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});

export default { createBoard, getBoards, updateBoard, deleteBoard };
