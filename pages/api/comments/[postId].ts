import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.query;

  if (typeof postId !== 'string') {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  if (req.method === 'GET') {
    try {
      const comments = await prisma.comment.findMany({
        where: { postId },
        include: { user: true },
        select: {
          id: true,
          body: true,
          isAnon: true,
          reported: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      res.status(200).json(comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } else if (req.method === 'POST') {
    const { body, userId, isAnon } = req.body;

    if (!body || !userId) {
      return res.status(400).json({ error: 'Invalid comment data' });
    }

    try {
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
  } else if (req.method === 'PATCH') {
    const { commentId } = req.query;
    const { reported } = req.body;

    if (typeof commentId !== 'string') {
      return res.status(400).json({ error: 'Invalid comment id' });
    }

    try {
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { reported },
      });

      res.status(200).json(updatedComment);
    } catch (error) {
      console.error('Failed to update comment:', error);
      res.status(500).json({ error: 'Failed to update comment' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await prisma.$disconnect();
}
