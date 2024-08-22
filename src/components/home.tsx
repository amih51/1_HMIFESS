"use client";

import useSWR from 'swr';
import DisplayPost from "./display-post";
import { fetcher } from '@/lib/fetcher';
import LoaderBar from './loader-bar'; 

const AllPosts = () => {
  const { data: posts, error } = useSWR('/api/post/all-post', fetcher);

  if (error) return <div>Failed to load posts.</div>;
  if (!posts) return <LoaderBar />; // Tampilkan loader bar saat loading

  return (
    <DisplayPost posts={posts.reverse()} />
  );
};

export default AllPosts;
