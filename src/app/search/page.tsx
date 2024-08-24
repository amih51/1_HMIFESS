"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import DisplayPost from "@/components/display-post";
import LoaderBar from "@/components/loader-bar";
import SelectCategory from "@/components/select-category";
import SearchBar from "@/components/search-bar";

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
    <div className="bg-white">
      <main className="p-7 flex flex-col min-h-screen">
        {/* Upper Part */}
        <div className="flex flex-row place-items-center">
          <div className="hidden md:block font-sans font-bold text-4xl">
            Result for &quot;{q}&quot;
          </div>
          <SelectCategory />
        </div>
        <SearchBar />

        {filteredPosts.length > 0 ? (
          <DisplayPost posts={filteredPosts} />
        ) : (
          <div className="text-center mt-10">
            <p className="text-gray-500">No results found for &quot;{q}&quot;.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const SearchPage: React.FC = () => (
  <Suspense fallback={<LoaderBar />}>
    <SearchResults />
  </Suspense>
);

export default SearchPage;
