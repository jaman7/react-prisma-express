const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createColumn(name, boardId) {
  return prisma.column.create({
    data: {
      name,
      boardId,
    },
  });
}

async function updateColumn(id, name) {
  return prisma.column.update({
    where: { id },
    data: { name },
  });
}

async function deleteColumn(id) {
  return prisma.column.delete({
    where: { id },
  });
}

module.exports = {
  createColumn,
  updateColumn,
  deleteColumn,
};