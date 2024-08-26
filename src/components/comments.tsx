"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import CreateComment from "./create-comment";
import { fetcher } from "@/lib/fetcher";
import LoaderBar from "./loader-bar";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

interface Comment {
  id: string;
  body: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  isAnon: boolean;
  createdAt: string;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { data: comments, error } = useSWR(`/api/comments/${postId}`, fetcher);
  const { data: session } = useSession();

  const imageStyle = {
    borderRadius: "50%",
  };

  if (error) return <div>Failed to load comments.</div>;
  if (!comments) return <LoaderBar />;

  return (
    <div className="pt-6 mt-6 border-t-2 border-gray-700">
      <h3 className="font-bold text-lg">Komentar</h3>
      {session && <CreateComment postId={postId} />}
      {comments.map((comment: Comment) => (
        <div key={comment.id} className="bg-white py-2 border-t-2">
          <div className="flex flex-row font-bold place-items-center">
            {comment.isAnon ? (
              <>
                <UserCircleIcon className="w-12 h-12 -translate-x-1" />
                <div className="flex flex-col">
                  <p className="ml-1">Warga Biasa</p>
                  {/*Updated At*/}
                  <p className="ml-1 text-[10px] text-gray-400 font-normal">
                    {new Date(comment.createdAt).toLocaleString()} <br />
                  </p>
                </div>
              </>
            ) : (
              <>
                <Link href={`/profile/${comment.user.id}`}>
                  <Image
                    src={comment.user.image}
                    alt="profile photo"
                    width={40}
                    height={40}
                    style={imageStyle}
                  />
                </Link>
                <div className="flex flex-col">
                  <Link
                    href={`/profile/${comment.user.id}`}
                    className="ml-3 hover:underline"
                  >
                    {comment.user.name}
                  </Link>
                  <p className="ml-3 text-[10px] text-gray-400 font-normal">
                    {new Date(comment.createdAt).toLocaleString()} <br />
                  </p>
                </div>
              </>
            )}
          </div>
          {/* <small className='text-gray-500'>{comment.isAnon ? 'Anonymous' : comment.user.name}</small> */}
          <p style={{ wordWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal' }}>{comment.body}</p>
        </div>
      ))}
    </div>
  );
};

export default Comments;
