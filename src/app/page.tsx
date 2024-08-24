import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import AllPosts from "@/components/home";
import Landing from "@/components/landing-page";
import SelectCategory from "@/components/select-category";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <Landing />
    );
  }
  return (
    <div className="md:pl-64">
      <main className="min-h-screen bg-colorLogo">
          <div className="items-center font-mono">
              <h1 className="text-5xl">Semua kategori</h1>
              <SelectCategory />
              <AllPosts />
          </div>
      </main>
    </div>
  );
}