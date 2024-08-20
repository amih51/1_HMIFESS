import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid post ID" });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                user: true,
                category: true,
            },
        });

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: "Post not found" });
        }
    } catch (error) {
        console.error('Failed to fetch post:', error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
};

export default handler;
