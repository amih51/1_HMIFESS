import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name, email } = req.body;

    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const newCategory = await prisma.category.create({
        data: {
        name,
        displayName: `${name}!`,
        infoBoxText: '', 
        createdBy: { connect: { id: user.id } },
        },
    });

    res.status(201).json(newCategory);
}
