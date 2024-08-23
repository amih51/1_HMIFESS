import { getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import DisplayPost from "@/components/display-post";
import { redirect } from "next/navigation";
import ProfilePosts from "@/components/profile-home";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/')
    }

    return (
        <main className="bg-backgroundLogo">
            <div className="items-center font-mono">
                <h1 className="text-5xl">ID: {params.id}</h1>
                <ProfilePosts id={params.id} />
            </div>
        </main>
    );
}
