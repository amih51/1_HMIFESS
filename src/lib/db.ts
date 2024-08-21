// lib/db.ts
import { PrismaClient } from "@prisma/client";

export const updateUserName = async (userId: string, name: string) => {
  const prisma = new PrismaClient();
  return prisma.user.update({
    where: { id: userId },
    data: { name },
  });
};
