// src\app\profile\[id]\page.tsx
"use client";

import { useRouter } from 'next/navigation'; // Gunakan useRouter dari next/navigation
import useSWR from 'swr';
import { fetcher } from '../../../lib/fetcher'; // Menggunakan fetcher yang sudah didefinisikan
import { useEffect, useState } from 'react';
import LoaderBar from '../../../components/loader-bar';

type Post = {
  id: string;
  title: string;
  body: string;
};

type Category = {
  id: string;
  name: string;
  displayName: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  posts: Post[];
  createdCategories: Category[];
  joinedCategories: Category[];
};

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (router.query && router.query.id) {
      setUserId(router.query.id as string);
    }
  }, [router.query]);

  const { data: user, error } = useSWR<User>(userId ? `/api/user/${userId}` : null, fetcher);

  if (!user && !error) return <LoaderBar />; 
  if (error) {
    console.error('Error fetching user data:', error);
    return <div>Error: {error.message}</div>;
  }

  console.log('Fetched user data:', user);

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Profile of {user.name}</h1>
          <p>Email: {user.email}</p>

          <h2 className="text-xl mt-4">Posts</h2>
          <ul className="list-disc pl-5">
            {user.posts.length > 0 ? (
              user.posts.map((post) => (
                <li key={post.id} className="mt-2">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p>{post.body}</p>
                </li>
              ))
            ) : (
              <p>No posts found.</p>
            )}
          </ul>

          <h2 className="text-xl mt-4">Created Categories</h2>
          <ul className="list-disc pl-5">
            {user.createdCategories.length > 0 ? (
              user.createdCategories.map((category) => (
                <li key={category.id} className="mt-2">
                  <h3 className="text-lg font-semibold">{category.displayName}</h3>
                  <p>{category.name}</p>
                </li>
              ))
            ) : (
              <p>No categories created.</p>
            )}
          </ul>

          <h2 className="text-xl mt-4">Joined Categories</h2>
          <ul className="list-disc pl-5">
            {user.joinedCategories.length > 0 ? (
              user.joinedCategories.map((category) => (
                <li key={category.id} className="mt-2">
                  <h3 className="text-lg font-semibold">{category.displayName}</h3>
                  <p>{category.name}</p>
                </li>
              ))
            ) : (
              <p>No categories joined.</p>
            )}
          </ul>
        </>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
}
