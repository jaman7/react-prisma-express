import prisma from "../prisma-client";

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUserId(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export default { getUsers };
