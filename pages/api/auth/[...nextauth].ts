import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";
import NextAuthSession from "next-auth";

const prisma = new PrismaClient();
export type User = {
  email: string;
  id: string;
};

export const authOptions = {
  callbacks: {
    /**
     * @param {object} session - The session object
     * @param {User} user - The user object
     * @returns {object} - The modified session object
     */

    signIn({ user }: { user: { email: string } }) {
      const nimAwal = ['196', '135', '182'];
      if (
        !nimAwal.some((awal) => user.email?.startsWith(awal)) ||
        !user.email?.endsWith('@std.stei.itb.ac.id')
      ) {
        return false;
      }
      return true;
    },
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/', 
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
}

export default NextAuth(authOptions);