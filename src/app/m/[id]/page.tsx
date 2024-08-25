"use client"

import LoaderBar from "@/components/loader-bar";
import DisplayPost from "@/components/display-post";
import useSWR from "swr";

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


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page({ params }: { params: { id: string } }) {
    const { data: posts, error } = useSWR<Post[]>("/api/post/posts", fetcher);

    if (error) return <div>Failed to load posts.</div>;
    if (!posts) return <LoaderBar />;

    const filteredPosts = posts.filter((post) => post.id === params.id);

    return (
        <main className="bg-white min-h-screen">
            <div className="bg-white p-7 flex flex-col min-h-screen">
                {/* Content */}
                {filteredPosts.length > 0 ? (
                    <div className="pt-6">
                        <DisplayPost posts={filteredPosts} />
                    </div>
                ) : (
                    <div className="text-center mt-10">
                        <p className="text-gray-500">No posts found for id &quot{params.id}&quot.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
