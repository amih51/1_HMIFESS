"use client";

import { useState, useEffect, useTransition, Key } from "react";
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { fetcher } from "@/lib/fetcher";
import DisplayPost from "@/components/display-post";
import LoaderBar from "@/components/loader-bar";
import TabButton from "@/components/tab-button";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";

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

    const [tab, setTab] = useState('postingan');
    const [isPending, startTransition] = useTransition();
    const handleTabChange = (id: string) => {
      startTransition(() => {
        setTab(id)
      });
    };

    const { data: categories, error: categoriesError } = useSWR('/api/category/all-category', fetcher);

    const [newName, setNewName] = useState('');

    useEffect(() => {
        console.log('Session:', session);
    }, [session]);
    
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
    if (!user || !posts || !categories) return <LoaderBar />;

    const filteredPosts = posts
      .filter((post: any) => post.user.id === user.id)

    const profile_tab =
      [
        {id: "postingan",
        content: <DisplayPost posts={filteredPosts}/>,
      },
      {
        id: "balasan",
        content: "balasan di sini"
      },
      {
        id: "riwayat",
        content: "riwayat di sini"
      }
    ]
    
    return (
        <main>
    {/*Profile Home Page*/}
        <div className="container mx-auto p-6">
          {/*Upper Part*/}
            <div className='flex flex-row place-items-center'>
              <div className='ml-5'>
                <button className='p-2 bg-green-800 rounded-md hover:bg-opacity-70 '> 
                  <ArrowLeftIcon className='h-5 w-5 text-white'/>
                </button>
              </div>
              <div className='ml-6 font-extrabold text-4xl text-black'>
                Profile
              </div>
            </div>
          {/*Profile Data*/}
              <div className="flex items-center m-3 ml-5 p-6 bg-white rounded-3xl">
                <img
                    src={session?.user?.image || "/default-avatar.png"}
                    alt="Profile Picture"
                    className="w-20 h-20 rounded-full mr-4"
                    />
                <div className="ml-5">
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <ul className="text-gray-700">
                      <li>Email: {session?.user?.email}</li>
                    </ul>

              {/*Update Profile*/}
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
                            className="bg-yellow-500 text-black text-sm px-3 py-2 rounded-md"
                            >
                            Update Name
                        </button>
                    </div>
                </div>
            </div>

    {/*Tab Menu*/}  
          <div className="m-3 ml-5 bg-green-800 rounded-2xl flex flex-row place-content-evenly">
            <TabButton
              selectTab={()=> handleTabChange("postingan")}
              active={tab === "postingan"}>
              Postingan
            </TabButton>
            <TabButton
              selectTab={()=> handleTabChange("balasan")}
              active={tab === "balasan"}>
              Balasan
            </TabButton>
            <TabButton
              selectTab={()=> handleTabChange("riwayat")}
              active={tab === "riwayat"}>
              Riwayat
            </TabButton>
          </div>
          <div className='relative mt-5 ml-5 m-3 w-auto text-black'>
            {profile_tab.find((t) => t.id == tab)?.content}
          </div>
        </div>
        </main>
    );
};

export default Profile;