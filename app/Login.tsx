"use client"
import { useSession, signIn } from "next-auth/react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";

export default function Login() {
    const { data: session } = useSession();

    const samplePost1 = {
        title: "Sample Post Title",
        body: "This is a sample post body. It can contain a longer text describing the post content.",
        author: "John Doe",
        isAnon: false,
        voteCount: 5,
        comments: [
            { id: "1", body: "Great post!", author: "Jane Smith", isAnon: false },
            { id: "2", body: "I disagree.", author: "Anonymous", isAnon: true },
        ],
        createdAt: Date.now(),
    };
    const samplePost2 = {
        title: "Sample Post Title 2",
        body: "This is another sample post body. It can contain a longer text describing the post content.",
        author: "Jane Smith",
        isAnon: false,
        voteCount: 10, // Adjusted vote count for demonstration
        comments: [
            { id: "1", body: "Great post!", author: "John Doe", isAnon: false },
            { id: "2", body: "I disagree.", author: "Anonymous", isAnon: true },
        ],
        createdAt: Date.now(),
    };

    // Mengurutkan postingan berdasarkan voteCount secara menurun
    const samplePosts = [samplePost1, samplePost2].sort((a, b) => b.voteCount - a.voteCount);

    if (session) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar user={session.user} />
                <div className="container mx-auto px-4 py-8 pt-20">
                    <div className="max-w-2xl mx-auto">
                        {samplePosts.map((post, index) => (
                            <Post key={index} {...post} />
                        ))}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
                <button 
                    onClick={() => signIn('google')} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Sign In with Google
                </button>
            </div>
        );
    }
}
