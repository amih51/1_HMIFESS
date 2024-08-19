import { useState } from 'react';
import { FiArrowUp, FiArrowDown, FiMessageSquare } from 'react-icons/fi';

interface PostProps {
  title: string;
  body: string;
  author: string;
  isAnon: boolean;
  voteCount: number;
  comments: Array<{ id: string; body: string; author: string; isAnon: boolean }>;
  createdAt: number;
}

export default function Post({ title, body, author, isAnon, voteCount, comments, createdAt }: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [localVoteCount, setLocalVoteCount] = useState(voteCount);

  const handleVote = (type: 'up' | 'down') => {
    setLocalVoteCount(prev => type === 'up' ? prev + 1 : prev - 1);
    // TODO:Here you would typically make an API call to update the vote in the backend
    // For this example, we'll just update the local state
    // You can replace this with your own logic to update the vote in the backend
    // For example, you can make an API request to update the vote in the backend
    // and then update the local state with the new vote count
    const url = process.env.DATABASE_URL;
    fetch(`${url}/posts/${title}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voteCount: localVoteCount }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));

    console.log('Vote updated successfully');

  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-2">{body}</p>
      <p className="text-sm text-gray-500 mb-2">Posted by: {isAnon ? 'Anonymous' : author}</p>
      <p className="text-sm text-gray-500 mb-2">Created at: {new Date(createdAt).toLocaleString()}</p>
      <div className="flex items-center space-x-4">
        <button onClick={() => handleVote('up')} className="text-gray-500 hover:text-blue-500">
          <FiArrowUp />
        </button>
        <span>{localVoteCount}</span>
        <button onClick={() => handleVote('down')} className="text-gray-500 hover:text-red-500">
          <FiArrowDown />
        </button>
        <button onClick={() => setShowComments(!showComments)} className="text-gray-500 hover:text-green-500">
          <FiMessageSquare />
          <span className="ml-1">{comments.length}</span>
        </button>
      </div>
      {showComments && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Comments:</h3>
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-100 p-2 rounded mb-2">
              <p>{comment.body}</p>
              <p className="text-xs text-gray-500">By: {comment.isAnon ? 'Anonymous' : comment.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

