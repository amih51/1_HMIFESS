import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const allSubs = await prisma.category.findMany();
        console.log('Fetched categories:', allSubs); // Debugging
        res.json(allSubs);
    } catch (e) {
        console.error('Error fetching categories:', e); // Debugging
        res.status(500).json(e);
    }
};

export default handler;
