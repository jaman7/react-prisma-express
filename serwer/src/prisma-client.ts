import { PrismaClient } from "@prisma/client";
const clientPrisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

export default clientPrisma;
