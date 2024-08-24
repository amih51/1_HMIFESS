"use client";

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import CreateComment from './create-comment';
import { fetcher } from '@/lib/fetcher';
import LoaderBar from './loader-bar';

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
  if (!comments) return <LoaderBar />;

  return (
    <div className='m-8 p-2 border-t-2 border-gray-700 bg-gray-100 rounded-lg'>
      <h3 className='font-bold text-lg ml-5'>Komentar</h3>
      {session && (
        <CreateComment postId={postId} />
      )}
      {comments.map((comment: Comment) => (
        <div key={comment.id} className='bg-white m-4 rounded-xl px-4 py-2'>
          <small className='text-gray-500'>{comment.isAnon ? 'Anonymous' : comment.user.name}</small>
          <p>{comment.body}</p>
        </div>
      ))}
      
    </div>
  );
};

export default Comments;
