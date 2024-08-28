// pages/api/comments/user-comments.ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (typeof userId !== 'string') {
        return res.status(400).json({ error: 'Invalid user id' });
      }

      const userComments = await prisma.comment.findMany({
        where: { userId },
        select: {
          id: true,
          postId: true,
        },
      });

      const commentCount = userComments.length;
      const commentedPostIds = Array.from(new Set(userComments.map(comment => comment.postId)));

      res.status(200).json({
        commentCount,
        commentedPostCount: commentedPostIds.length,
        commentedPostIds,
      });
    } catch (error) {
      console.error('Failed to fetch user comments:', error);
      res.status(500).json({ error: 'Failed to fetch user comments' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}