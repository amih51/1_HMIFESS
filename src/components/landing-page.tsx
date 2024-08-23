"use client"  

import { signIn } from "next-auth/react"; 

export default function Landing() {

    return (
      <main className="flex items-center justify-center h-screen">
        <div className="grid grid-cols-2 w-full h-full relative">
            <img 
                src="hmif-logo.svg" 
                alt="Logo HMIF" 
                className="absolute w-16 h-16 left-10 top-10"
            />
            <img 
                src="landing.svg" 
                alt="Deskripsi Gambar" 
                className="w-full h-full object-cover"
            />
          
          <div className="flex items-center justify-center bg-white p-8">
            <div className="p-4">
              <h1 className="text-5xl font-bold mb-4">Your Space, Your Voice.</h1>
              <h2 className="text-2xl font-semibold mb-8">HMIFess: Where HMIF Students Connect & Share</h2>
              <p className="text-lg text-gray-600 text-justify">Welcome to <span className="font-bold">HMIFess</span>, the exclusive online forum for HMIF students at ITB. Whether you want to share insights, ask questions, or just connect with fellow students, HMIFess is the place to be. Join our community, where your thoughts matter, and every post can spark a conversation.</p>
              <button onClick={() => signIn("google")} className="rounded-md text-black border-2 border-blue-400 py-2 px-4 mt-4 hover:bg-slate-100">
                Sign In with Google
              </button>
            </div>
          </div>
        </div>
    </main>
    );
}
