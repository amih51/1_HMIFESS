import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        try {
            const { postId, userId } = req.query;

            if (typeof postId !== "string" || typeof userId !== "string") {
                return res.status(400).json({ error: "Invalid parameters" });
            }

            const vote = await prisma.vote.findFirst({
                where: {
                    postId,
                    userId,
                },
            });

            res.status(200).json({
                voteType: vote ? (vote.voteType ? "upvote" : "downvote") : "none",
            });
        } catch (error) {
            console.error("Failed to fetch vote status:", error);
            res.status(500).json({ error: "Failed to fetch vote status" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;
