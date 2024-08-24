"use client";

import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import DisplayName from "./display-name";

export default function Nav() {
  const session = useSession();

  if (!session) return null;

  return (
    <div className="fixed flex items-center justify-between md:block top-0 left-0 w-full md:w-64 h-16 md:h-screen bg-white">
      <div className="p-6 md:h-1/5">
        <Link href="/">
          <h1 className="pl-6 text-2xl font-bold text-black">HMIFess</h1>
        </Link>
      </div>
      <nav className="flex flex-col flex-shrink-0 justify-between h-3/4 overflow-y-auto bg-white">
        <ul className="hidden md:block mx-6">
          <li>
            <Link href="/" className="md:flex items-center px-6 py-2 rounded-3xl text-gray-700 hover:bg-gray-200 transition-colors duration-100">
                <HomeIcon className="w-6 h-6 mr-3" />
                Home
            </Link>
          </li>
          <li>
            <Link href="/profile" className="md:flex items-center px-6 py-2 rounded-3xl text-gray-700 hover:bg-gray-200 transition-colors duration-100">
                <UserIcon className="w-6 h-6 mr-3" />
                Profile
            </Link>
          </li>
        </ul>
        <div className="pt-4 pr-8 md:pr-0 mx-6">
          <DisplayName />
        </div>
      </nav>
    </div>
  );
}
