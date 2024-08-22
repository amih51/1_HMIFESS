// lib/db.ts
import { PrismaClient } from "@prisma/client";

export const updateUserName = async (email: string, name: string, oldName: string) => {
  const prisma = new PrismaClient();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { email },
        data: { name },
      });

      if (oldName !== name) {
        await tx.user.update({
          where: { email },
          data: { username: name.toLowerCase().replace(/\s+/g, '_') },
        });
      }

      return updatedUser;
    });

    return { success: true, message: 'User name updated successfully', user: result };
  } catch (error) {
    console.error('Error updating user name:', error);
    return { success: false, message: 'Failed to update user name' };
  } finally {
    await prisma.$disconnect();
  }
};