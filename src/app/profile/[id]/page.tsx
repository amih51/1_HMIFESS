import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import LoginPage from "@/app/auth/signin/page";
import Nav from "@/components/nav";
import DisplayPost from "@/components/display-post";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="flex min-h-screen flex-col items-center p-5">
                <p>Belum login</p>
                <LoginPage />
            </div>
        );
    }

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/post/posts`);
    const allPosts = await res.json();

    const filteredPosts = allPosts
      .filter((post: any) => post.user.id === params.id)
      .filter((post: any) => post.isAnon === false);

    return (
        <main className="bg-backgroundLogo">
            <Nav />
            <div className="items-center font-mono">
                <h1 className="text-5xl">ID: {params.id}</h1>
                <DisplayPost posts={filteredPosts} />
            </div>
        </main>
    );
}
