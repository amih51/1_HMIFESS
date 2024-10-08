"use client";

import { useState, useEffect, useTransition, Key } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { fetcher } from "@/lib/fetcher";
import DisplayPost from "@/components/display-post";
import LoaderBar from "@/components/loader-bar";
import TabButton from "@/components/tab-button";
import { PencilIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const postFetcher = async (url: string, email: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

  const {
    data: user,
    mutate: mutateUser,
    error: userError,
  } = useSWR(email ? ["/api/user/profile", email] : null, ([url, email]) =>
    postFetcher(url, email)
  );

  const { data: posts, error: postsError } = useSWR(
    email ? ["/api/post/posts", email] : null,
    ([url, email]) => postFetcher(url, email)
  );
  const { data: userComments, error: userCommentsError } = useSWR(
    user?.id ? `/api/comments/user-comments?userId=${user.id}` : null,
    fetcher
  );

  const { data: userCommentedPosts, error: userCommentedPostsError } = useSWR(
    user?.id ? `/api/comments/user-commented-posts?userId=${user.id}` : null,
    fetcher
  );
  const { data: votedPosts, error: votedPostsError } = useSWR(
    user?.id ? `/api/vote/voted-posts?userId=${user.id}` : null,
    fetcher
  );
  const [tab, setTab] = useState("postingan");
  const [isPending, startTransition] = useTransition();
  const handleTabChange = (id: string) => {
    startTransition(() => {
      setTab(id);
    });
  };

  const { data: categories, error: categoriesError } = useSWR(
    "/api/category/all-category",
    fetcher
  );

  const [newName, setNewName] = useState("");

  useEffect(() => {
    console.log("Session:", session);
  }, [session]);

  useEffect(() => {
    if (user) {
      setNewName(user.name || "");
    }
  }, [user]);

  const handleNameChange = async (e: React.FormEvent) => {
    if (!newName.trim()) return;

    try {
      const res = await fetch("/api/user/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: session?.user?.email }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        console.log("Name updated successfully:", updatedUser.name);
        mutateUser(updatedUser, false);
      } else {
        const errorData = await res.json();
        console.error("Failed to update name:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (userError) return <div>Failed to load user profile.</div>;
  if (postsError) return <div>Failed to load posts.</div>;
  if (categoriesError) return <div>Failed to load categories.</div>;
  if (userCommentsError) return <div>Failed to load user comments.</div>;
  if (userCommentedPostsError)
    return <div>Failed to load user commented posts.</div>;
  if (votedPostsError) return <div>Failed to load voted posts.</div>;
  if (!user || !posts || !categories || !userComments || !userCommentedPosts || !votedPosts)
    return <LoaderBar />;

  const userPost = posts.filter((post: any) => post.user.id === user.id);
  const postCount = userPost.length;
  const commentedPostCount = userComments.commentedPostCount;
  const { upvotedPosts, downvotedPosts } = votedPosts;

  const profile_tab = [
    {
      id: "postingan",
      content:
        userPost.length > 0 ? (
          <DisplayPost
            posts={userPost}
            showComments={false}
            showPagination={true}
          />
        ) : (
          <p>No upvoted posts.</p>
        ),
    },
    {
      id: "komentar",
      content:
        userCommentedPosts.length > 0 ? (
          <DisplayPost
            posts={userCommentedPosts}
            showComments={false}
            showPagination={true}
          />
        ) : (
          <p>No comments yet.</p>
        ),
    },
    {
      id: "upvoted",
      content:
        upvotedPosts.length > 0 ? (
          <DisplayPost
            posts={upvotedPosts}
            showComments={false}
            showPagination={true}
          />
        ) : (
          <p>No upvoted posts.</p>
        ),
    },
    {
      id: "downvoted",
      content:
        downvotedPosts.length > 0 ? (
          <DisplayPost
            posts={downvotedPosts}
            showComments={false}
            showPagination={true}
          />
        ) : (
          <p>No downvoted posts.</p>
        ),
    },
  ];

  return (
    <div className="bg-white">
      <main className="p-7 flex flex-col min-h-screen">
        {/*Upper Part*/}
        <div className="flex flex-row place-items-center">
          <div className="font-sans font-bold text-4xl">Profile</div>
        </div>
        {/*Profile Data*/}
        <div className="flex items-center py-6 bg-white">
          <Image
            src={session?.user?.image || "/default-avatar.png"}
            alt="Profile Picture"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full"
          />
          <div className="ml-5">
            <form onSubmit={handleNameChange} className="flex ">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-2xl font-semibold w-96 focus:outline-none "
              />
              <PencilIcon className="w-2 h-2" />
            </form>
            <p className="text-gray-400 text-sm">
              Email: {session?.user?.email}
            </p>
            <div className="flex felx-row text-gray-500">
              <div>
                <span className="font-semibold text-black">{postCount}</span>{" "}
                menfess
              </div>
              <div className="px-6">
                <span className="font-semibold text-black">{commentedPostCount}</span>{" "}
                komentar
              </div>
            </div>
          </div>
        </div>

        {/*Tab Menu*/}
        <div className="bg-transparent flex flex-row border-b-2">
          <TabButton
            selectTab={() => handleTabChange("postingan")}
            active={tab === "postingan"}
          >
            Menfess
          </TabButton>
          <TabButton
            selectTab={() => handleTabChange("komentar")}
            active={tab === "komentar"}
          >
            Komentar
          </TabButton>
          <TabButton
            selectTab={() => handleTabChange("upvoted")}
            active={tab === "upvoted"}
          >
            Upvoted
          </TabButton>
          <TabButton
            selectTab={() => handleTabChange("downvoted")}
            active={tab === "downvoted"}
          >
            Downvoted
          </TabButton>
        </div>
        <div className="relative w-auto text-black">
          {profile_tab.find((t) => t.id == tab)?.content}
        </div>
      </main>
    </div>
  );
};

export default Profile;
