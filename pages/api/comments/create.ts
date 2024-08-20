// pages/api/comments/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { body, postId, userId, isAnon } = req.body;

    const comment = await prisma.comment.create({
      data: {
        body,
        postId,
        userId,
        isAnon,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Failed to create comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}