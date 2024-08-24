import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import AllPosts from "@/components/home";
import Landing from "@/components/landing-page";
import SelectCategory from "@/components/select-category";
import SearchBar from "@/components/search-bar";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <Landing />
    );
  }
  return (
    <div className="bg-white">
      <main className="p-7 flex flex-col min-h-screen">
      {/*Upper Part*/}
        <div className="flex flex-row place-items-center">
          <div className="font-sans font-bold text-4xl">Beranda</div>
          <SelectCategory/>
        </div>
        <SearchBar />
        <AllPosts />
      </main>
    </div>
  );
}