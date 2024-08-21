"use client";

import { useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CreatePostProps {
  category: string;
}

const CreatePost = ({ category }: CreatePostProps) => {
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnon, setIsAnon] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.email;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("body", body);
    formData.append("email", email || '');
    formData.append("isAnon", JSON.stringify(isAnon));
    formData.append("category", category);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch('/api/post/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push(`/c/${category}`);
      } else {
        const error = await response.json();
        console.error('Failed to create post', error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="border p-4 rounded-md shadow-md">
        <div className="mb-4">
          <label htmlFor="body" className="block text-lg font-semibold mb-2">Post Content:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post here..."
            className="w-full border p-2 rounded-md"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="file" className="block text-lg font-semibold mb-2">Upload Image/Video:</label>
          <input
            id="file"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isAnon" className="flex items-center">
            <input
              id="isAnon"
              type="checkbox"
              checked={isAnon}
              onChange={(e) => setIsAnon(e.target.checked)}
              className="mr-2"
            />
            Post Anonymously
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
