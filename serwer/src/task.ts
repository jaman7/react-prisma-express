const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTask(title, content, status, columnId) {
  return prisma.task.create({
    data: {
      title,
      content,
      status,
      columnId,
    },
  });
}

async function updateTask(id, title, content, status, columnId) {
  return prisma.task.update({
    where: { id },
    data: { title, content, status, columnId },
  });
}

async function deleteTask(id) {
  return prisma.task.delete({
    where: { id },
  });
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
};