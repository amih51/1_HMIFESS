import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { postId } = req.query;

      if (typeof postId !== 'string') {
        return res.status(400).json({ error: 'Invalid post id' });
      }

      const comments = await prisma.comment.findMany({
        where: {
          postId: postId,
        },
        include: {
          user: true,
        },
      });

      res.status(200).json(comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } else if (req.method === 'POST') {
    try {
      const { postId } = req.query;
      const { body, userId, isAnon } = req.body;

      if (typeof postId !== 'string') {
        return res.status(400).json({ error: 'Invalid post id' });
      }

      const newComment = await prisma.comment.create({
        data: {
          body,
          userId,
          postId,
          isAnon,
        },
      });

      res.status(201).json(newComment);
    } catch (error) {
      console.error('Failed to create comment:', error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}