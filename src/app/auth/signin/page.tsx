"use client"

import { signIn, useSession } from "next-auth/react"
import React, { useRef } from "react"

const LoginPage = () => {
    const { data: session } = useSession()
    const userName = useRef("");
    const pass = useRef("");

    const onSubmit =  async () => {
        const result = await signIn("credentials", {
            username: userName.current,
            password: pass.current,
            redirect: true,
            callbackUrl: "/",
        })
    }
    
    if (!session) {
        return (
            <div className="flex min-h-screen flex-col items-center p-5">
                {/* <input 
                    type="text" 
                    onChange={(e) => (userName.current = e.target.value)}
                    placeholder="username"
                    />
                <input 
                    type="password" 
                    onChange={(e) => (pass.current = e.target.value)}
                    placeholder="password"
                    />
                <button onClick={onSubmit}>Submit</button>
                <p>or</p> */}
                <button onClick={() => signIn("google")}>Sign in with google</button>
                <button onClick={() => signIn("github")}>Sign in with github</button>
            </div>
        )
    }
}

export default LoginPage