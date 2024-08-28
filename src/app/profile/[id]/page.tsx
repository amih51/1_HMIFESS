"use client";

import { useState, useTransition } from "react";
import useSWR from 'swr';
import { fetcher } from "@/lib/fetcher";
import DisplayPost from "@/components/display-post";
import LoaderBar from "@/components/loader-bar";
import TabButton from "@/components/tab-button";
import Image from "next/image";

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

const Profile = ({ params }: { params: { id: string } }) => {
    const { data: user, error: userError } = useSWR(
        params.id ? `/api/user/${params.id}` : null,
        fetcher
    );

    const { data: posts, error: postsError } = useSWR(
        params.id ? [`/api/post/posts`, params.id] : null,
        ([url, id]) => postFetcher(url, id)
    );
    const { data: userComments, error: userCommentsError } = useSWR(
        params.id ? `/api/comments/user-comments?userId=${params.id}` : null,
        fetcher
    );
    const { data: userCommentedPosts, error: userCommentedPostsError } = useSWR(
        params.id ? `/api/comments/user-commented-posts?userId=${params.id}` : null,
        fetcher
    );
    const [tab, setTab] = useState('postingan');
    const [isPending, startTransition] = useTransition();
    const handleTabChange = (id: string) => {
        startTransition(() => {
            setTab(id);
        });
    };


    const { data: categories, error: categoriesError } = useSWR('/api/category/all-category', fetcher);

    if (userError) return <div>Failed to load user profile.</div>;
    if (postsError) return <div>Failed to load posts.</div>;
    if (categoriesError) return <div>Failed to load categories.</div>;
    if (userCommentsError) return <div>Failed to load user comments.</div>;
    if (userCommentedPostsError) return <div>Failed to load user commented posts.</div>;
    if (!user || !posts || !categories || !userComments || !userCommentedPosts) return <LoaderBar />;

    const userPost = posts.filter((post: any) => post.user.id === user.id && !post.isAnon);
    const postCount = userPost.length;
    const commentedPostCount = userComments.commentedPostCount;

    const upvotePosts = posts
      .filter((post: any) => 
        Array.isArray(post.votes) && post.votes.some((vote: any) => 
          vote.userId === user.id && vote.voteType)
    );

    const profile_tab = [
        {
            id: "postingan",
            content: <DisplayPost posts={userPost} showComments={false} showPagination={true}/>,
        },
        {
            id: "balasan",
            content: <DisplayPost posts={userCommentedPosts} showComments={false} showPagination={true}/>,
        }
    ];

    return (
        <div className="bg-white">
            <main className="p-7 flex flex-col min-h-screen">
                {/*Upper Part*/}
                <div className='flex flex-row place-items-center'>
                    <div className='font-sans font-bold text-4xl'>
                        Profile
                    </div>
                </div>
                {/*Profile Data*/}
                <div className="flex items-center py-6 bg-white">
                    <Image
                        src={user.image || "/default-avatar.png"}
                        alt="Profile Picture"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full"
                    />
                    <div className="ml-5">
                        <div className="text-2xl font-semibold">
                            {user.name}
                        </div>
                        <p className="text-gray-400 text-sm">Email: {user.email}</p>
                        <div className="flex flex-row text-gray-500">
                            <div><span className="font-semibold text-black">{postCount}</span> menfess</div>
                            <div className="px-6"><span className="font-semibold text-black">{commentedPostCount}</span> komentar</div>
                        </div>
                    </div>
                </div>

                {/*Tab Menu*/}
                <div className="bg-transparent flex flex-row border-b-2">
                    <TabButton
                        selectTab={() => handleTabChange("postingan")}
                        active={tab === "postingan"}>
                        Menfess
                    </TabButton>
                    <TabButton
                        selectTab={() => handleTabChange("balasan")}
                        active={tab === "balasan"}>
                        Balasan
                    </TabButton>
                </div>
                <div className='relative w-auto text-black'>
                    {profile_tab.find((t) => t.id == tab)?.content}
                </div>
            </main>
        </div>
    );
};

export default Profile;
