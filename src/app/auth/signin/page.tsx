"use client"

import { signIn, useSession } from "next-auth/react"
import React from "react"

const LoginPage = () => {
    const { data: session } = useSession()

    if (!session) {
        return (
            <div className="flex flex-col items-center">
                <button onClick={() => signIn("google")}>Sign in with google</button>
                <button onClick={() => signIn("github")}>Sign in with github</button>
            </div>
        )
    }
}

export default LoginPage