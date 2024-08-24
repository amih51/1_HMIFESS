import React from "react";
import Link from "next/link";
import VoteBtn from "./vote-btn";
import Comments from "./comments";
import LoaderBar from "./loader-bar"; 
import Image from "next/image";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";

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
}

const DisplayPost: React.FC<DisplayPostProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <LoaderBar />; 
  }

const imageStyle = {
  borderRadius: '50%',
}

  return (
    <ul className=''>
      {posts.map((post) => (
        <li key={post.id} className='border-t-2 border-gray-500 mt-7 py-3 px-5'>
          {/*Username or Anonymous & Profile Image*/}
          <div className="flex flex-row font-bold place-items-center">
            {post.isAnon ? (
              <>
              <Image
                src="/blank-profile.webp" 
                alt="profile_picture"
                width={40}
                height={40}
                style={imageStyle} />
              <div className="flex flex-col">
                <p className="ml-3">Anonymous</p>
                {/*Updated At*/}
                <p className="ml-3 text-[10px] text-gray-400 font-normal">updated on {new Date(post.updatedAt).toLocaleString()} <br /></p>
              </div>
              </>
              ) : 
              (
              <>
              <img src={post.user.image} alt="profile photo" width={40} height={40} style={imageStyle} />
              <Link href={`/profile/${post.user.id}`} className="ml-3 hover:underline">
                {post.user.name}
              </Link>
              </>
              )}
          </div>
          {/*Category*/}
          <div className="mt-2 text-xs bg-yellow-400 px-3 py-1 rounded-full place-items-center text-white inline-block">
            {post.category.name}
          </div>
          {/*Body*/}
          <div className="mt-2">
            {post.body}
          </div>
          {/*Up Vote - Down Vote, Count Vote, & Comment*/}
          <div className="flex flex-row place-items-center">
            <VoteBtn postId={post.id} userId={post.user.id} />
            <button className="ml-5 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full">
              <ChatBubbleOvalLeftIcon className="w-5 h-5"/>
            </button>
          </div>
          {/*Created On*/}
          <p className="text-[10px] mt-0 text-gray-400 font-normal">created {new Date(post.createdAt).toLocaleString()}</p>
          {/*Comments*/}
          <Comments postId={post.id} />
            <br />
        </li>
      ))}
    </ul>
  );
};

export default DisplayPost;
