"use client";

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import CreateComment from './create-comment';
import { fetcher } from '@/lib/fetcher'; // Pastikan fetcher.ts sudah ada

interface Comment {
  id: string;
  body: string;
  user: {
    name: string;
  };
  isAnon: boolean;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { data: comments, error } = useSWR(`/api/comments/${postId}`, fetcher);
  const { data: session } = useSession();

  if (error) return <div>Failed to load comments.</div>;
  if (!comments) return <div>Loading...</div>;

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment: Comment) => (
        <div key={comment.id}>
          <p>{comment.body}</p>
          <small>{comment.isAnon ? 'Anonymous' : comment.user.name}</small>
        </div>
      ))}
      {session && (
        <CreateComment postId={postId} />
      )}
    </div>
  );
};

export default Comments;
