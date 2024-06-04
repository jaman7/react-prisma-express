import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// async function createTask(title, content, status, columnId) {
//   return prisma.task.create({
//     data: {
//       title,
//       content,
//       status,
//       columnId,
//     },
//   });
// }

// async function updateTask(id, title, content, status, columnId) {
//   return prisma.task.update({
//     where: { id },
//     data: { title, content, status, columnId },
//   });
// }

// async function deleteTask(id) {
//   return prisma.task.delete({
//     where: { id },
//   });
// }

export async function dragTask(data: any) {
  return prisma.task.update({
    where: { id: data.id },
    data: {
      ...data,
    },
  });
}

// export async function deleteBoard(id: number) {
//   return prisma.board.delete({
//     where: { id },
//   });
// }

export default { dragTask };
