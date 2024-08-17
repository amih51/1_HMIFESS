import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

const handler = async(req:NextApiRequest, res: NextApiResponse) => {
    try {
        const allSubs = await prisma.category.findMany();
        res.json(allSubs);
    }   catch (e) {
        res.json(e);
    }
};

export default handler