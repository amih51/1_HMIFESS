import React from "react";
import VoteBtn from "./vote-btn";

interface Post {
  id: string;
  isAnon: boolean;
  user: {
    id: any;
    image: string;
    name: string;
  };
  category: {
    name: string;
  };
  body: string;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DisplayPostProps {
  posts: Post[];
}

const DisplayPost: React.FC<DisplayPostProps> = ({ posts }) => {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          is_anon: {post.isAnon ? "True" : "False"} <br />
          {!post.isAnon && (
            <>
              <img src={post.user.image} alt="profile photo" />
              user: {post.user.name} <br />
            </>
          )}
          category: {post.category.name} <br />
          body: {post.body} <br />
          vote_count: {post.voteCount} <br />
          created_at: {new Date(post.createdAt).toLocaleString()} <br />
          updated_at: {new Date(post.updatedAt).toLocaleString()} <br />
          <VoteBtn postId={`${post.id}`} userId={`${post.user.id}`} /> <br />
          <br />
        </li>
      ))}
    </ul>
  );
};

export default DisplayPost;
