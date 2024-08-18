import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Initialize NextAuth

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: "421954002929-045e2ohc9g1r09kcssoddubu41848299.apps.googleusercontent.com",
            clientSecret: "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",
        })
    ]
})