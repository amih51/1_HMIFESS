"use client";

import { useSearchParams } from 'next/navigation';
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from 'next/image';

export default function Landing() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      const errorParam = searchParams.get('error');
      if (errorParam) {
        setError(errorParam);
      }
    }
  }, [searchParams]);

  return (
    <main className="flex items-center justify-center h-screen -mt-16 md:mt-0 md:-ml-64 z-10">
      <div className="grid grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1 w-full h-full">
        <div className="relative h-32 md:h-full w-full">
          <Image
            src="hmifess-logo-bg.svg" 
            alt="Logo HMIF" 
            width={128}
            height={128}
            className="absolute w-32 left-10 top-10"
          />
          <Image
            src="landing.svg" 
            alt="Deskripsi Gambar" 
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center bg-white p-8 max-w-full max-h-full overflow-auto">
          <div>
            <h1 className="text-5xl font-bold mb-4">Your Space, Your Voice.</h1>
            <h2 className="text-2xl font-semibold mb-8">HMIFess: Where HMIF Students Connect & Share</h2>
            <p className="text-lg text-gray-600 text-justify">
              Welcome to <span className="font-bold">HMIFess</span>, the exclusive online forum for HMIF students at ITB. Whether you want to share insights, ask questions, or just connect with fellow students, HMIFess is the place to be. Join our community, where your thoughts matter, and every post can spark a conversation.
            </p>
          </div>
          <button onClick={() => signIn("google")} className="rounded-md text-black border-2 border-ijoPrimary py-2 px-4 mt-4 hover:bg-slate-100">
            Sign In with Google
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </main>
  );
}
