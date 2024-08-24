import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import CreatePost from "@/components/create-post";
import CategoryPosts from "@/components/category-home";
import { redirect } from "next/navigation";
import SelectCategory from "@/components/select-category";

export default async function Page({ params }: { params: { category: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/')
    }

    return (
        <main className="bg-colorLogo">
            <div className="items-center font-mono">
                <h1 className="text-5xl">Category: {params.category}</h1>
                <CreatePost category={params.category} />
                <SelectCategory />
                <CategoryPosts category={params.category} />
            </div>
        </main>
    );
}
