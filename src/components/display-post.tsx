import React, { useState, useEffect } from "react";
import Link from "next/link";
import VoteBtn from "./vote-btn";
import LoaderBar from "./loader-bar";
import Image from "next/image";
import {
  ChatBubbleOvalLeftIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Comments from "./comments";
import { useMediaQuery } from "react-responsive";

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
  Comments?: Comment[];
}

interface DisplayPostProps {
  posts: Post[];
  showComments?: boolean;
}

const DisplayPost: React.FC<DisplayPostProps> = ({
  posts,
  showComments = false,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });

  // Set items per page based on screen size
  const itemsPerPage = isMobile ? 5 : isTablet ? 10 : 15;
  const [currentPage, setCurrentPage] = useState(1);

  if (!posts || posts.length === 0) {
    return <LoaderBar />;
  }

  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts: { [key: string]: number } = {};
      for (const post of posts) {
        const response = await fetch(`/api/comments/count/${post.id}`);
        const { commentsCount } = await response.json();
        counts[post.id] = commentsCount || 0;
      }
      setCommentCounts(counts);
    };

    fetchCommentCounts();
  }, [posts]);

  const imageStyle = {
    borderRadius: "50%",
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = renderPageNumbers();

  return (
    <>
      <ul>
        {currentPosts.map((post) => (
          <li key={post.id} className="border-b-2 border-gray-500 py-3">
            <Link href={`/m/${post.id}`}>
              {/*Username or Anonymous & Profile Image*/}
              <div className="flex flex-row font-bold place-items-center">
                {post.isAnon ? (
                  <>
                    <UserCircleIcon className="w-12 h-12 -translate-x-1" />
                    <div className="flex flex-col">
                      <p className="ml-1">Warga Biasa</p>
                      {/*Updated At*/}
                      <p className="ml-1 text-[10px] text-gray-400 font-normal">
                        {new Date(post.createdAt).toLocaleString()} <br />
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href={`/profile/${post.user.id}`}>
                      <Image
                        src={post.user.image}
                        alt="profile photo"
                        width={40}
                        height={40}
                        style={imageStyle}
                      />
                    </Link>
                    <div className="flex flex-col">
                      <Link
                        href={`/profile/${post.user.id}`}
                        className="ml-3 hover:underline"
                      >
                        {post.user.name}
                      </Link>
                      <p className="ml-3 text-[10px] text-gray-400 font-normal">
                        {new Date(post.createdAt).toLocaleString()} <br />
                      </p>
                    </div>
                  </>
                )}
              </div>
              {/*Category*/}
              <div className="mt-2 text-xs bg-yellow-400 px-3 py-1 rounded-full place-items-center text-white inline-block">
                {post.category.name}
              </div>
              {/*Body*/}
              <div className="my-2">{post.body}</div>
            </Link>
            {/*Up Vote - Down Vote, Count Vote, & Comment*/}
            <div className="flex flex-row place-items-center">
              <VoteBtn postId={post.id} userId={post.user.id} />
              <button className="ml-5 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full flex items-center">
                <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                <span className="ml-1">{commentCounts[post.id] ?? 0}</span>
              </button>
            </div>
            {/*Comments*/}
            {showComments && <Comments postId={post.id} />}
          </li>
        ))}
      </ul>

      {/* Pagination component */}
      <div className="flex grid-cols-3 justify-between space-x-2 mt-6 mb-10">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="bg-green-100 text-green-800 px-3 py-1 rounded-md"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="flex gap-2">
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`px-3 py-1 rounded-md ${
                num === currentPage ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="bg-green-100 text-green-800 px-3 py-1 rounded-md"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default DisplayPost;