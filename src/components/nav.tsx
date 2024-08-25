"use client";

import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import DisplayName from "./display-name";
import CreatePostButton from "./create-post-btn";
import Image from 'next/image';

export default function Nav() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div 
      className="fixed flex items-center justify-between md:block top-0 left-0 w-full md:w-64 h-16 md:h-screen border-b-2 md:border-r-2 z-50 shadow-md"
      style={{ backgroundColor: "#549B68" }} 
    >
      <div className="p-6 md:mx-6 md:h-1/5 md:pt-16">
        <div className="logo-wrapper">
          <Link href="/">
            <Image
              src="/hmifess-logo.svg"
              alt="Logo HMIFess"
              width={240}
              height={120}
              className="md:translate-x-0"
            />
          </Link>
        </div>
      </div>
      <div className="md:hidden">
        <CreatePostButton />
      </div>
      <nav
        className="flex flex-col flex-shrink-0 justify-between h-3/4 overflow-y-auto"
        style={{ backgroundColor: "#F7F7F7" }} // Inline style for yellow background
      >
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
          <li className="visible">
            <CreatePostButton />
          </li>
        </ul>
        <div className="pt-2 pr-1 md:pr-0 mx-6">
          <DisplayName />
        </div>
      </nav>
    </div>
  );
}
