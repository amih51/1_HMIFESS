import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { postId, bookmark } = req.body;
  const userEmail = session.user?.email;

  if (!postId || typeof bookmark !== 'boolean' || !userEmail) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (bookmark) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          bookmarkedPosts: {
            connect: { id: postId },
          },
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          bookmarkedPosts: {
            disconnect: { id: postId },
          },
        },
      });
    }

    res.status(200).json({ message: bookmark ? 'Post bookmarked' : 'Post unbookmarked' });
  } catch (error) {
    console.error('Error bookmarking post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}