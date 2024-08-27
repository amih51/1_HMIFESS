import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        try {
            const { postId, userId, voteType } = req.body;

            // Check if the user has already voted
            const existingVote = await prisma.vote.findFirst({
                where: {
                    postId,
                    userId,
                },
            });

            // Get current vote count
            const post = await prisma.post.findUnique({
                where: {
                    id: postId,
                },
            });

            if (existingVote) {
                if (voteType === null) {
                    // Remove vote if the same vote type is clicked again
                    await prisma.vote.delete({
                        where: {
                            id: existingVote.id,
                        },
                    });

                    if (post) {
                        const newVoteCount = post.voteCount - (existingVote.voteType ? 1 : -1);
                        
                        // Update post's vote count
                        await prisma.post.update({
                            where: {
                                id: postId,
                            },
                            data: {
                                voteCount: newVoteCount,
                            },
                        });
                    }
                } else if (existingVote.voteType !== voteType){
                    // Update vote type
                    await prisma.vote.update({
                        where: {
                            id: existingVote.id,
                        },
                        data: {
                            voteType,
                        },
                    });

                    if (post) {
                        const newVoteCount = post.voteCount + 2 * (voteType ? 1 : -1);
                        
                        // Update post's vote count
                        await prisma.post.update({
                            where: {
                                id: postId,
                            },
                            data: {
                                voteCount: newVoteCount,
                            },
                        });
                    }
                }
            } else if (voteType !== null) {
                // Create new vote
                await prisma.vote.create({
                    data: {
                        postId,
                        userId,
                        voteType,
                    },
                });

                if (post) {
                    const newVoteCount = post.voteCount + (voteType ? 1 : -1);
                    
                    // Update post's vote count
                    await prisma.post.update({
                        where: {
                            id: postId,
                        },
                        data: {
                            voteCount: newVoteCount,
                        },
                    });
                }
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
