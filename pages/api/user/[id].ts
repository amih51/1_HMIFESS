import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                posts: true,
                comments: true,
                bookmarkedPosts: true,
            },
        });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error('Failed to fetch user:', error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

export default handler;
