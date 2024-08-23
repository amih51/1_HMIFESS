"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CreatePostProps {
  category: string;
}

export default function CreatePost({ category }: CreatePostProps) {
  const [body, setBody] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    const response = await fetch('/api/post/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body, email, isAnon, category }),
    });

    if (response.ok) {
      router.push(`/c/${category}`);
    } else {
      const error = await response.json();
      console.error('Failed to create post', error.message);
    }
  };

  return (
    <div className='bg-white p-2 m-5 rounded'> 
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="body">Post:</label>
          <input className='border bg-gray-100 p-2 rounded'
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            />
        </div>
        <div>
          <label htmlFor="isAnon">Anonymous:</label>
          <input
            type="checkbox"
            checked={isAnon}
            onChange={(e) => setIsAnon(e.target.checked)}
          />
        </div>
        <button type="submit" className='bg-green-400 p-1 rounded'>Create Post</button>
      </form>
    </div>
  );
}
