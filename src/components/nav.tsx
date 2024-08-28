"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import DisplayName from "./display-name";
import CreatePostButton from "./create-post-btn";
import Image from 'next/image';

export default function Nav() {
  const { data: session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      setIsDarkMode(savedMode === "dark");
      document.documentElement.classList.toggle("dark", savedMode === "dark");
    }
  }, []);

  if (!session?.user) return null;

  const logoSrc = document.documentElement.classList.contains("dark") 
    ? "/hmifess-logo-white.svg" 
    : "/hmifess-logo.svg";

  return (
    <div className="fixed flex items-center justify-between md:block top-0 left-0 w-full md:w-64 h-16 md:h-screen bg-white dark:bg-gray-800 border-b-2 md:border-r-2 border-gray-200 dark:border-gray-600 z-50">
      <div className="flex flex-shrink-0 md:mx-6 md:h-1/5 md:pt-16">
        <Link href="/" className="hidden dark:flex">
          <Image
            src="/hmifess-logo-white.svg"
            alt="Logo HMIFess"
            width={240}
            height={120}
            className="-translate-x-3 md:-translate-x-3"
            />
        </Link>
        <Link href="/" className="flex dark:hidden">
          <Image
            src="/hmifess-logo.svg"
            alt="Logo HMIFess"
            width={240}
            height={120}
            className="-translate-x-3 md:-translate-x-3"
            />
        </Link>
      </div>
      <div className="md:hidden">
        <CreatePostButton />
      </div>
      <nav className="flex flex-shrink-0 flex-col justify-between h-3/4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="hidden md:block md:mx-6">
          <li>
            <Link href="/" className="md:flex items-center px-6 py-2 rounded-3xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-100">
              <HomeIcon className="w-6 h-6 mr-3" />
              Home
            </Link>
          </li>
          <li>
            <Link href="/profile" className="md:flex items-center px-6 py-2 rounded-3xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-100">
              <UserIcon className="w-6 h-6 mr-3" />
              Profile
            </Link>
          </li>
          <li className="visible">
            <CreatePostButton />
          </li>
        </ul>
        <div className="pt-2 pr-1 md:pr-0 mx-6 overflow-hidden">
          <DisplayName />
        </div>
      </nav>
    </div>
  );
}
