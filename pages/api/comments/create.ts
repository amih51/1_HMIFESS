import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { body, email, postId, isAnon } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    
    }
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        post: { connect: { id: post.id } },
        user: { connect: { id: user.id } },
        isAnon,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Failed to create comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}