"use client";

import React, { Suspense } from "react";
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

  return <DisplayPost posts={filteredPosts} />;
};

const SearchPage: React.FC = () => (
  <Suspense fallback={<LoaderBar />}>
    <SearchResults />
  </Suspense>
);

export default SearchPage;
