"use client"
import { useState } from 'react';
import PostCreator from './post-creator';
import MediaPreview from './media-preview';
import { useSession } from 'next-auth/react';
type MediaType = 'image' | 'video';

interface MediaUrl {
  url: string;
  type: MediaType;
}

interface PostData {
  content: string;
  mediaUrls: MediaUrl[];
}

interface CreatePostRequest {
  body: string;
  mediaUrls: MediaUrl[];
  email: string;
  isAnon: boolean;
  category: string;
}

interface MediaUrl {
  url: string;
  type: 'image' | 'video';
}

interface PostData {
  content: string;
  mediaUrls: MediaUrl[];
}

const CreatePost = () => {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [isAnon, setIsAnon] = useState(false);
  const [category, setCategory] = useState('');
  const { data: session } = useSession();
  const handlePostCreation = (data: PostData) => {
    setPostData(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      return console.error('Session not found');
    }

    const email = session.user?.email;
    if (!email) {
      return console.error('User email not found');
    }
    const response = await fetch('/api/post/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: postData?.content,
        mediaUrls: postData?.mediaUrls,
        email,
        isAnon,
        category,
      }),
    });

    if (response.ok) {
      console.log('Post created successfully');
    } else {
      console.error('Error creating post');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PostCreator onSubmit={handlePostCreation} />
      {postData && <MediaPreview urls={postData.mediaUrls.map((mediaUrl) => mediaUrl.url)} />}
      <label>
        Anonymous:
        <input
          type="checkbox"
          checked={isAnon}
          onChange={(e) => setIsAnon(e.target.checked)}
        />
      </label>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;