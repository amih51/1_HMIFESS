"use client";
import React from "react";
import Link from "next/link";
import VoteBtn from "./vote-btn";
import LoaderBar from "./loader-bar"; 
import Image from "next/image";
import { ChatBubbleOvalLeftIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
interface Post {
  id: string;
  isAnon: boolean;
  user: {
    id: string;
    image: string;
    name: string;
  };
  category: {
    name: string;
  };
  body: string;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DisplayPostProps {  
  posts: Post[];  
  onBookmark: (postId: string, bookmark: boolean) => Promise<void>;
  isBookmarked: boolean;
}

const DisplayPost: React.FC<DisplayPostProps> = ({ posts, onBookmark, isBookmarked }) => {
  if (!posts || posts.length === 0) {
    return <LoaderBar />; 
  }

  const imageStyle = {
    borderRadius: '50%',
  };
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = async ({ post }: { post: Post }) => {
    try {
      await onBookmark(post.id, !bookmarked);
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };


  return (
    <ul>
      {posts.map((post) => (
        <Link key={post.id} href={`/m/${post.id}`}>
          <li className='border-b-2 border-gray-500 py-3'>
            {/*Username or Anonymous & Profile Image*/}
            <div className="flex flex-row font-bold place-items-center">
              {post.isAnon ? (
                <>
                  <UserCircleIcon className="w-12 h-12 -translate-x-1"/>
                  <div className="flex flex-col">
                    <p className="ml-1">Warga Biasa</p>
                    {/*Updated At*/}
                    <p className="ml-1 text-[10px] text-gray-400 font-normal">{new Date(post.createdAt).toLocaleString()} <br /></p>
                  </div>
                </>
              ) : (
                <>
                  <Link href={`/profile/${post.user.id}`}>
                    <Image src={post.user.image} alt="profile photo" width={40} height={40} style={imageStyle} />
                  </Link>
                  <div className="flex flex-col">
                    <Link href={`/profile/${post.user.id}`} className="ml-3 hover:underline">
                      {post.user.name}
                    </Link>
                    <p className="ml-3 text-[10px] text-gray-400 font-normal">{new Date(post.createdAt).toLocaleString()} <br /></p>
                  </div>
                </>
              )}
            </div>
            {/*Category*/}
            <div className="mt-2 text-xs bg-yellow-400 px-3 py-1 rounded-full place-items-center text-white inline-block">
              {post.category.name}
            </div>
            {/*Body*/}
            <div className="my-2">
              {post.body}
            </div>
            {/*Up Vote - Down Vote, Count Vote, & Comment*/}
            <div className="flex flex-row place-items-center">
              <VoteBtn postId={post.id} userId={post.user.id} />
              <button className="ml-5 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full">
                <ChatBubbleOvalLeftIcon className="w-5 h-5"/>
              </button>
            </div>
            {/*Comments*/}
            {/* <Comments postId={post.id} /> */}
            {/*Bookmark*/}
            <button
              onClick={() => handleBookmark({ post })}
              className="ml-5 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full"
            >
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default DisplayPost;
