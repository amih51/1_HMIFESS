import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import CreateCategory from "@/components/create-category";
import AllPosts from "@/components/home";
import Landing from "@/components/landing-page";
import Nav from "@/components/nav";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <Landing />
    );
  }
  return (
    <div>
      <Nav />
      <main className="min-h-screen bg-colorLogo">
          <div className="items-center font-mono">
              <h1 className="text-5xl">Semua kategori</h1>
              <CreateCategory />
              <AllPosts />
          </div>
      </main>
    </div>
  );
}