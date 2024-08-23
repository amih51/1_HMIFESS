import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import type { Account, User } from "next-auth";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/', 
    error: '/',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }: { account: Account | null, user: User | AdapterUser }) {
      const nimAwal = ['196', '135', '182'];
      if (
        nimAwal.some((awal) => user.email?.startsWith(awal)) &&
        user.email?.endsWith('@std.stei.itb.ac.id')
      ) { return true; }      
      return false; 
    },
    async redirect() {
      return ('/');
    },
  },
};

export default NextAuth(authOptions);
