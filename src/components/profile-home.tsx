"use client"

import useSWR from "swr";
import DisplayPost from "./display-post";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProfilePosts = ({ id }: { id: string }) => {
  const { data: allPosts = [], error } = useSWR('/api/post/posts', fetcher);

  if (error) return <div>Failed to load posts</div>;
  if (!allPosts.length) return <div>Loading...</div>;

    const filteredPosts = allPosts
        .filter((post: any) => post.user.id === id)
        .filter((post: any) => post.isAnon === false);

  return (
    <DisplayPost posts={filteredPosts} />
  );
};

export default ProfilePosts;
