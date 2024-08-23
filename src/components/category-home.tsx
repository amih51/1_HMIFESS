"use client"

import useSWR from "swr";
import DisplayPost from "./display-post";
import LoaderBar from "./loader-bar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CategoryPosts = ({ category }: { category: string }) => {
  const { data: allPosts = [], error } = useSWR('/api/post/posts', fetcher);

  if (error) return <div >Failed to load posts</div>;
  if (!allPosts.length) return <LoaderBar />;

  const filteredPosts = category
    ? allPosts.filter((post: any) => post.category.name === category)
    : allPosts;

  return (
    <DisplayPost posts={filteredPosts} />
  );
};

export default CategoryPosts;
