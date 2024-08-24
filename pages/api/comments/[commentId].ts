// pages/api/comments/[commentId].ts

import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { commentId } = req.query;

      if (typeof commentId !== 'string') {
        return res.status(400).json({ error: 'Invalid comment id' });
      }

      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
        include: {
          user: true,
        },
      });

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.status(200).json({
        ...comment,
        voteCount: comment.voteCount,
      });
    } catch (error) {
      console.error('Failed to fetch comment:', error);
      res.status(500).json({ error: 'Failed to fetch comment' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}