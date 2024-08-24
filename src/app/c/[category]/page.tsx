import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import CreatePost from "@/components/create-post";
import CategoryPosts from "@/components/category-home";
import { redirect } from "next/navigation";
import SelectCategory from "@/components/select-category";
import SearchBar from "@/components/search-bar";

export default async function Page({ params }: { params: { category: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/')
    }

    return (
    <div className="bg-white min-h-screen">
        <main className="bg-white p-7 flex flex-col min-h-screen">
        {/*Upper Part*/}
            <div className="flex flex-row place-items-center">
                <div className="font-sans font-bold text-4xl">category: {params.category}</div>
                <SelectCategory/>
            </div>
            <SearchBar/>

        {/*Content*/}
            <div className="items-center ">
                <CreatePost category={params.category} />
                <SelectCategory />
                <CategoryPosts category={params.category} />
            </div>
        </main>
    </div>
    );
}
