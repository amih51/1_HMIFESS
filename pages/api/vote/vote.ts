import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        try {
            const { postId, commentId, userId, voteType } = req.body;

            // Determine if the vote is for a post or a comment
            const voteTarget = postId ? { postId } : { commentId };

            // Check if the user has already voted
            const existingVote = await prisma.vote.findFirst({
                where: {
                    ...voteTarget,
                    userId,
                },
            });

            // Determine if it's a post or a comment and get the current vote count
            let target, newVoteCount;
            if (postId) {
                target = await prisma.post.findUnique({ where: { id: postId } });
            } else if (commentId) {
                target = await prisma.comment.findUnique({ where: { id: commentId } });
            }

            if (!target) {
                return res.status(404).json({ error: "Target not found" });
            }

            if (existingVote) {
                if (existingVote.voteType === voteType) {
                    // Remove vote if the same vote type is clicked again
                    await prisma.vote.delete({
                        where: {
                            id: existingVote.id,
                        },
                    });

                    newVoteCount = target.voteCount - (voteType ? 1 : -1);
                } else {
                    // Update vote type
                    await prisma.vote.update({
                        where: {
                            id: existingVote.id,
                        },
                        data: {
                            voteType,
                        },
                    });

                    newVoteCount = target.voteCount + 2 * (voteType ? 1 : -1);
                }
            } else {
                // Create new vote
                await prisma.vote.create({
                    data: {
                        ...voteTarget,
                        userId,
                        voteType,
                    },
                });

                newVoteCount = target.voteCount + (voteType ? 1 : -1);
            }

            // Update the target's vote count
            if (postId) {
                await prisma.post.update({
                    where: { id: postId },
                    data: { voteCount: newVoteCount },
                });
            } else if (commentId) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: { voteCount: newVoteCount },
                });
            }

            res.status(200).json({ message: "Vote processed successfully" });
        } catch (error) {
            console.error("Failed to process vote:", error);
            res.status(500).json({ error: "Failed to process vote" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;
