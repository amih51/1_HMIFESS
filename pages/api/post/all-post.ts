import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

const handler = async(req:NextApiRequest, res: NextApiResponse) => {
    try {
        const allPost = await prisma.post.findMany({
            include: {
                user: true,
                category: true,
              },
        });
        res.status(200).json(allPost);
    }   catch (e) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

export default handler