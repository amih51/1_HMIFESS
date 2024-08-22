import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;

        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid post id' });
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId: id,  
            },
            include: {
                user: true,  
            },
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

export default handler;
