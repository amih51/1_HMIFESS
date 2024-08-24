"use client"

import SelectCategory from "@/components/select-category";
import SearchBar from "@/components/search-bar";
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

export default function Page({ params }: { params: { category: string } }) {
    const { data: posts, error } = useSWR<Post[]>("/api/post/posts", fetcher);

    if (error) return <div>Failed to load posts.</div>;
    if (!posts) return <LoaderBar />;

    const filteredPosts = posts.filter((post) => post.category.name === params.category);

    return (
        <div className="bg-white min-h-screen">
            <main className="bg-white p-7 flex flex-col min-h-screen">
                {/* Upper Part */}
                <div className="flex flex-row place-items-center">
                    <div className="font-sans font-bold text-4xl">Category: {params.category}</div>
                    <SelectCategory />
                </div>
                <SearchBar />

                {/* Content */}
                {filteredPosts.length > 0 ? (
                    <div className="pt-6">
                        <DisplayPost posts={filteredPosts} />
                    </div>
                ) : (
                    <div className="text-center mt-10">
                        <p className="text-gray-500">No posts found for category &quot{params.category}&quot.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
