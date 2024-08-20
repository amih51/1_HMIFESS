import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, email, isAnon, category } = req.body;

  if (!body || !email || typeof isAnon !== 'boolean' || !category) {
    return res.status(400).json({ message: 'Missing or invalid input' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const categoryData = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!categoryData) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const newPost = await prisma.post.create({
      data: {
        title: '',
        body,
        isAnon,
        category: { connect: { id: categoryData.id } },
        user: { connect: { id: user.id } },
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
}
