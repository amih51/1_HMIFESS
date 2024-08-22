// src\app\profile\page.tsx
"use client";

import { useState, useEffect, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useSession } from 'next-auth/react';

const Profile = () => {
    const { data: session } = useSession();
    const { data: user, mutate: mutateUser } = useSWR('/api/user/profile', fetcher);
    const { data: posts, error: postsError } = useSWR(
        session?.user?.email ? '/api/post/all-post' : null,
        fetcher
    );
    const { data: categories, error: categoriesError } = useSWR('/api/category/all-category', fetcher);

    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (user) {
            setNewName(user.name || '');
        }
    }, [user]);

    const handleNameChange = async () => {
        if (!newName.trim()) return;
      
        try {
          const res = await fetch('/api/user/update-name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName , email: session?.user?.email }),
          });
      
          if (res.ok) {
            const updatedUser = await res.json();
            console.log('Name updated successfully:', updatedUser.name);
            mutateUser(updatedUser, false); // Update local data without revalidation
          } else {
            const errorData = await res.json();
            console.error('Failed to update name:', errorData.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    if (postsError) return <div>Failed to load posts.</div>;
    if (categoriesError) return <div>Failed to load categories.</div>;
    if (!user || !posts || !categories) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div className="flex items-center mb-6">
                <img
                    src={session?.user?.image || "/default-avatar.png"}
                    alt="Profile Picture"
                    className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                    <p className="text-xl font-semibold">Nickname: {user.name}</p>
                    <p className="text-md text-gray-700">Email: {session?.user?.email}</p>
                    <div className="mt-4 flex items-center">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter new name"
                            className="border p-2 rounded-md mr-2"
                        />
                        <button
                            onClick={handleNameChange}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Update Name
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Your Posts</h2>
                <ul className="space-y-2">
                    {posts.filter((post: { user: { email: string | null | undefined; }; }) => post.user.email === session?.user?.email).map((post: { id: Key | null | undefined; category: { name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }; title: any; body: any; }) => (
                        <li key={post.id} className="border p-4 rounded-md shadow-md">
                            <div className="mb-2 font-semibold">{post.category.name}</div>
                            <div>{post.title || post.body}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Profile;