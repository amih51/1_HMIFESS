import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !(session.user as any).isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const reportedPosts = await prisma.post.findMany({
        where: { reported: true },
        select: {
          id: true,
          body: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      const reportedComments = await prisma.comment.findMany({
        where: { reported: true },
        select: {
          id: true,
          body: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      const reportedContent = [
        ...reportedPosts.map(post => ({ ...post, type: 'post' as const })),
        ...reportedComments.map(comment => ({ ...comment, type: 'comment' as const })),
      ];

      res.status(200).json(reportedContent);
    } catch (error) {
      console.error('Failed to fetch reported content:', error);
      res.status(500).json({ error: 'Failed to fetch reported content' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}