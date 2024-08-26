"use client";

import useSWR from 'swr';
import DisplayPost from "./display-post";
import { fetcher } from '@/lib/fetcher';
import LoaderBar from './loader-bar'; 

const AllPosts = () => {
  const { data: posts, error } = useSWR('/api/post/posts', fetcher);

  if (error) return <div>Failed to load posts.</div>;
  if (!posts) return <LoaderBar />; 

  return (
    <DisplayPost posts={posts} showComments={false} />
  );
};

export default AllPosts;
