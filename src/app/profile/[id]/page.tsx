import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import DisplayPost from "@/components/display-post";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/')
    }

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/post/posts`);
    const allPosts = await res.json();

    const filteredPosts = allPosts
      .filter((post: any) => post.user.id === params.id)
      .filter((post: any) => post.isAnon === false);

    return (
        <main className="bg-backgroundLogo">
            <div className="items-center font-mono">
                <h1 className="text-5xl">ID: {params.id}</h1>
                <DisplayPost posts={filteredPosts} />
            </div>
        </main>
    );
}
