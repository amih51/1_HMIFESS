// app/search/page.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import DisplayPost from "@/components/display-post";
import LoaderBar from "@/components/loader-bar";
import Link from "next/link";
import VoteBtn from "@/components/vote-btn";
import Comments from "@/components/comments";

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const q = searchParams?.get("q") || "";

  // Menggunakan useSWR untuk mengambil data posts
  const { data: posts, error } = useSWR<Post[]>("/api/post/posts", fetcher);

  if (error) return <div>Failed to load posts.</div>;
  if (!posts) return <LoaderBar />;

  const filteredPosts = posts.filter((post) =>
    post.body.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <ul className="">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <li key={post.id} className="border bg-white m-5 p-2 rounded">
            is_anon: {post.isAnon ? "True" : "False"} <br />
            {!post.isAnon && (
              <>
                <img src={post.user.image} alt="profile photo" />
                <Link
                  href={`/profile/${post.user.id}`}
                  className="text-blue-950 text-3xl hover:underline"
                >
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
        ))
      ) : (
        <li>
          <p>No results found.</p>
        </li>
      )}
    </ul>
  );
};

export default SearchResults;
