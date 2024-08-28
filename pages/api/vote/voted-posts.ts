import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    try {
      const upvotedPosts = await prisma.post.findMany({
        where: {
          votes: {
            some: {
              userId: userId,
              voteType: true
            }
          }
        },
        include: {
          user: true,
          votes: true,
          comments: true,
          category: true
        }
      });

      const downvotedPosts = await prisma.post.findMany({
        where: {
          votes: {
            some: {
              userId: userId,
              voteType: false
            }
          }
        },
        include: {
          user: true,
          votes: true,
          comments: true,
          category: true
        }
      });

      res.status(200).json({ upvotedPosts, downvotedPosts });
    } catch (error) {
      console.error('Error fetching voted posts:', error);
      res.status(500).json({ error: 'Failed to fetch voted posts' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}