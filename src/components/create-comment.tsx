"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface CreateCommentProps {
  postId: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId }) => {
  const [body, setBody] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const { data: session } = useSession();
  const email = session?.user?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault
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
    <form onSubmit={handleSubmit} className='flex flex-row my-4 h-18'>
      <Image 
        src={session.user?.image || 'hmif-logo-p.png'} 
        alt='Profile Photo' 
        width={32}
        height={32}
        className="w-8 h-8 rounded-full"
      />
      {/*Comment Box*/}
      <input 
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Tambahkan Komentar"
        required
        className='w-full bg-gray-100 rounded-xl px-5 py-3 ml-5 focus:outline-none'
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