// pages/api/post/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to process form.' });
    }

    const { body, email, isAnon, category } = fields;
    const file = files.file ? (files.file as formidable.File) : null;

    // Validate input
    if (!body || !email || typeof isAnon !== 'boolean' || !category) {
      return res.status(400).json({ message: 'Missing or invalid input' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toString() },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const categoryData = await prisma.category.findUnique({
        where: { name: category.toString() },
      });

      if (!categoryData) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const newPostData: any = {
        title: '',
        body: body.toString(),
        isAnon,
        category: { connect: { id: categoryData.id } },
        user: { connect: { id: user.id } },
      };

      if (file) {
        // Save file path to the database
        const filePath = path.join('/uploads', path.basename(file.filepath));
        newPostData.fileUrl = filePath;
        // Move the file from temporary to the public uploads directory
        fs.renameSync(file.filepath, path.join(uploadDir, path.basename(file.filepath)));
      }

      const newPost = await prisma.post.create({
        data: newPostData,
      });

      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  });
};

export default handler;
