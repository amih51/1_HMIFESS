// app/search/page.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import DisplayPost from "@/components/display-post";
import LoaderBar from "@/components/loader-bar";

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
          <DisplayPost posts={filteredPosts} />
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
