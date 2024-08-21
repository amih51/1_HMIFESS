"use client";

import useSWR from 'swr';
import DisplayPost from "./display-post";
import { fetcher } from '@/lib/fetcher'; // Pastikan fetcher.ts sudah ada

const AllPosts = () => {
  const { data: posts, error } = useSWR('/api/post/all-post', fetcher);

  if (error) return <div>Failed to load posts.</div>;
  if (!posts) return <div>Loading...</div>;

  return (
    <DisplayPost posts={posts.reverse()} />
  );
};

export default AllPosts;
