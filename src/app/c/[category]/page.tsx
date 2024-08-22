import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import LoginPage from "@/app/auth/signin/page";
import CreatePost from "@/components/create-post";
import CategoryPosts from "@/components/category-home";
import LoaderBar from "@/components/loader-bar"; // Import LoaderBar

export default async function Page({ params }: { params: { category: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="flex min-h-screen flex-col items-center p-5">
                <p>Belum login</p>
                <LoginPage />
            </div>
        );
    }

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/post/category-post?category=${params.category}`);
    const posts = await res.json();

    if (!posts) {
        return <LoaderBar />; // Tampilkan loader bar saat data belum ada
    }

    return (
        <main className="bg-backgroundLogo">
            <div className="items-center font-mono">
                <h1 className="text-5xl">Category: {params.category}</h1>
                <CreatePost category={params.category} />
                <CategoryPosts category={params.category} />
            </div>
        </main>
    );
}
