"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Login() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                <Navbar user={session.user} />
            </>
        );
    } else {
        return (
            <div className="flex justify-center items-center h-screen">
                <button onClick={() => signIn()} type="button" className="btn btn-primary">
                    Sign In with Google
                </button>
            </div>
        );
    }
}
