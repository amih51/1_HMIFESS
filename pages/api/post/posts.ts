import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const allPosts = await prisma.post.findMany({
            include: {
                user: true, 
                category: true, 
            },
            orderBy: {
                createdAt: 'desc', 
            },
        });

        res.status(200).json(allPosts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

export default handler;
