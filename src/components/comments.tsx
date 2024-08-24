"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import CreateComment from './create-comment';
import VoteBtn from './vote-btn'; // Import VoteBtn

interface Comment {
  id: string;
  body: string;
  user: {
    id: string;
    name: string;
  };
  isAnon: boolean;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { data: session } = useSession();

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.body}</p>
          <small>{comment.isAnon ? 'Anonymous' : comment.user.name}</small>
          <VoteBtn commentId={comment.id} userId={comment.user.id || ''} />
        </div>
      ))}
      {session && (
        <CreateComment postId={postId} />
      )}
    </div>
  );
};

export default Comments;