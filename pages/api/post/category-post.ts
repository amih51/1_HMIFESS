import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { category } = req.query;
        
        if (typeof category !== 'string') {
            return res.status(400).json({ error: "Invalid category" });
        }

        const categoryPost = await prisma.post.findMany({
            where: {
                category: {
                    name: category,
                }
            },
            include: {
                user: true, 
                category: true, 
            },
        });

        res.status(200).json(categoryPost);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

export default handler;
