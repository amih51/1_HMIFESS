"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface CreateCommentProps {
  postId: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId }) => {
  const [body, setBody] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const { data: session } = useSession();
  const email = session?.user?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    if (!session) return;

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body,
          email,
          postId,
          isAnon,
        }),
      });

      if (response.ok) {
        setBody('');
        setIsAnon(false);
      } else {
        console.error('Failed to create comment');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (!session) return null;

  return (
    <form onSubmit={handleSubmit} className='flex flex-row mt-4 mb-8'>

      {/*Comment Box*/}
      <textarea className='w-full bg-white rounded-xl px-5 py-3 ml-5'
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Tambahkan Komentar"
        required
      />
      {/*Anonymous Checkbox & Tombol Kirim*/}
      <div className='flex flex-col'>
        <div className='ml-3 text-sm flex items-center'>
          <label className='place-content-center order border-black flex items-center mr-5'>
            <input
              type="checkbox"
              checked={isAnon}
              onChange={(e) => setIsAnon(e.target.checked)}
              className='mr-1'
            />
              Anonymous
          </label>
        </div>
        <button type="submit" className='bg-green-700 hover:bg-green-900 m-2 mr-4 px-4 py-2 rounded-full text-white'>Kirim</button>
      </div>
    </form>
  );
};

export default CreateComment;