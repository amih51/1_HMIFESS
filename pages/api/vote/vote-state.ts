import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type VoteStatus = "none" | "upvoted" | "downvoted";

interface VoteRequest {
  postId: string;
  userId: string;
}

interface VoteResponse {
  voteCount: number;
  voteStatus: VoteStatus;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<VoteResponse>) {
  if (req.method === 'GET') {
    const { postId, userId } = req.query as unknown as VoteRequest;

    if (!postId || !userId) {
      return res.status(400).json({ voteCount: 0, voteStatus: "none" });
    }

    try {
      const postVotes = await prisma.vote.findMany({
        where: { postId },
      });

      const voteCount = postVotes.length;

      const userVote = await prisma.vote.findFirst({
        where: { postId, userId },
      });

      const voteStatus: VoteStatus = userVote 
        ? userVote.voteType ? "upvoted" : "downvoted"
        : "none";

      res.status(200).json({
        voteCount,
        voteStatus,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ voteCount: 0, voteStatus: "none" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
