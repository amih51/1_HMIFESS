// pages/api/comments/user-commented-posts.ts
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

      const commentedPosts = await prisma.post.findMany({
        where: {
          comments: {
            some: {
              userId: userId
            }
          }
        },
        include: {
          user: true,
          comments: {
            where: {
              userId: userId
            },
            include: {
              user: true
            }
          },
          _count: {
            select: { comments: true }
          },
          category: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json(commentedPosts);
    } catch (error) {
      console.error('Failed to fetch user commented posts:', error);
      res.status(500).json({ error: 'Failed to fetch user commented posts' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}