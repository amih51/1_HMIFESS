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
        // Fetch comment count only
        const commentsCount = await prisma.comment.count({
          where: { postId },
        });
  
        if (commentsCount === 0) {
          return res.status(200).json({ count: 0 });
        }
  
        res.status(200).json({ commentsCount : commentsCount });
      } catch (error) {
        console.error('Failed to fetch comment count:', error);
        res.status(500).json({ error: 'Failed to fetch comment count' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }