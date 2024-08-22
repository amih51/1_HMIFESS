// components/category-home.tsx
"use client"

import { useEffect, useState } from "react";
import DisplayPost from "./display-post";

const CategoryPosts = ({ category }: { category: string }) => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/category-post?category=${category}`);
        const data = await res.json();
        setPosts(data.reverse());
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, [category]);

  return (
    <DisplayPost posts={posts} />
  );
};

export default CategoryPosts;
