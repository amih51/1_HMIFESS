"use client";

import { useState, useEffect, Key } from "react";
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { fetcher } from "@/lib/fetcher";
import Nav from "@/components/nav";
import DisplayPost from "@/components/display-post";

const postFetcher = async (url: string, email: string) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  
    return response.json();
};

const Profile = () => {
    const { data: session } = useSession();
    const email = session?.user?.email;

    const { data: user, mutate: mutateUser, error: userError } = useSWR(
        email ? ['/api/user/profile', email] : null,
        ([url, email]) => postFetcher(url, email)
    );

    const { data: posts, error: postsError } = useSWR(
        email ? ['/api/post/posts', email] : null,
        ([url, email]) => postFetcher(url, email)
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
            mutateUser(updatedUser, false); 
          } else {
            const errorData = await res.json();
            console.error('Failed to update name:', errorData.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    if (userError) return <div>Failed to load user profile.</div>;
    if (postsError) return <div>Failed to load posts.</div>;
    if (categoriesError) return <div>Failed to load categories.</div>;
    if (!user || !posts || !categories) return <div>Loading...</div>;

    const filteredPosts = posts
      .filter((post: any) => post.user.id === user.id)

    
    return (
        <main>
        <Nav />
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
                <DisplayPost posts={filteredPosts} />
            </div>
        </div>
        </main>
    );
};

export default Profile;
