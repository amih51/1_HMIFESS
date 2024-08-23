import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import LoginPage from "@/app/auth/signin/page";
import CreatePost from "@/components/create-post";
import CategoryPosts from "@/components/category-home";

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
