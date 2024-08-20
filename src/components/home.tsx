"use client"

import { useEffect, useState } from "react";
import DisplayPost from "./display-post";

const AllPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/all-post`);
        const data = await res.json();
        setPosts(data.reverse());
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <DisplayPost posts={posts} />
  );
};

export default AllPosts;
