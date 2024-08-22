import React from "react";
import Link from "next/link";
import VoteBtn from "./vote-btn";
import Comments from "./comments";
import LoaderBar from "./loader-bar"; // Import LoaderBar

interface Post {
  id: string;
  isAnon: boolean;
  user: {
    id: string;
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
  if (!posts || posts.length === 0) {
    return <LoaderBar />; // Tampilkan loader saat posts masih kosong atau belum ada
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          is_anon: {post.isAnon ? "True" : "False"} <br />
          {!post.isAnon && (
            <>
              <img src={post.user.image} alt="profile photo" />
              <Link href={`/profile/${post.user.id}`} className="text-blue-500 hover:underline">
                user: {post.user.name}
              </Link>
              <br />
            </>
          )}
          category: {post.category.name} <br />
          body: {post.body} <br />
          vote_count: {post.voteCount} <br />
          created_at: {new Date(post.createdAt).toLocaleString()} <br />
          updated_at: {new Date(post.updatedAt).toLocaleString()} <br />
          <VoteBtn postId={post.id} userId={post.user.id} /> <br />
          <Comments postId={post.id} />
          <br />
        </li>
      ))}
    </ul>
  );
};

export default DisplayPost;
