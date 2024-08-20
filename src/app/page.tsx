import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import CreateCategory from "@/components/create-category";
import AllPosts from "@/components/home";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-backgroundLogo">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <h1 className="text-7xl">
            Home
          </h1>
        </div>
      </main>
    );
  }
  return (
      <main className="min-h-screen bg-colorLogo">
          <div className="items-center font-mono">
              <h1 className="text-5xl">Semua kategori</h1>
              <CreateCategory />
              <AllPosts />
          </div>
      </main>
  );
}