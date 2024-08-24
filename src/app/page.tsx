import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import AllPosts from "@/components/home";
import Landing from "@/components/landing-page";
import SelectCategory from "@/components/select-category";
import CreateCategory from "@/components/create-category";

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
          <div className="mr-1 ml-4 px-3 py-1 text-xs rounded-lg border-2 border-yellow-500 place-content-center mt-2">semua kategori</div>
          {/*Select Category*/}
          <div><SelectCategory/></div>
          <div><CreateCategory/></div>
        </div>
      {/*Search Bar*/}
        <button className="flex flex-row font-sans mt-3 p-2 border-2 bg-gray-200 rounded-lg place-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div className="ml-3 text-xs text-slate-700">Pencarian</div>
        </button>
      
          <AllPosts />
      </main>
    </div>
  );
}