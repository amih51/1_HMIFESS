import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type VoteType = boolean;

interface VoteRequest {
    postId: string;
    userId: string;
    voteType: VoteType;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { postId, userId, voteType }: VoteRequest = req.body;

        if (!postId || !userId || typeof voteType !== 'boolean') {
            return res.status(400).json({ message: 'Invalid request' });
        }

        try {
            const existingVote = await prisma.vote.findFirst({
                where: { postId, userId },
            });

            if (existingVote) {
                if (existingVote.voteType === voteType) {
                    await prisma.vote.delete({
                        where: { id: existingVote.id },
                    });
                } else {
                    await prisma.vote.update({
                        where: { id: existingVote.id },
                        data: { voteType },
                    });
                }
            } else {
                await prisma.vote.create({
                    data: {
                        postId,
                        userId,
                        voteType,
                    },
                });
            }

            const upvotes = await prisma.vote.count({
                where: { postId, voteType: true },
            });
            const downvotes = await prisma.vote.count({
                where: { postId, voteType: false },
            });

            const voteCount = upvotes - downvotes;

            const voteStatus = existingVote
                ? (existingVote.voteType === voteType ? voteType : "none")
                : voteType;

            res.status(200).json({
                voteCount,
                voteStatus: voteStatus ? (voteType ? "upvoted" : "downvoted") : "none",
            });
        } catch (error) {
            console.error("Error processing vote:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
