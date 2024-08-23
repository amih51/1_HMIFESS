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
    <form onSubmit={handleSubmit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment..."
        required
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={isAnon}
            onChange={(e) => setIsAnon(e.target.checked)}
          />
          Post anonymously
        </label>
      </div>
      <button type="submit">Post Comment</button>
    </form>
  );
};

export default CreateComment;