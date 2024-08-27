"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Sun, User } from "lucide-react";
import LogoutButton from "./auth/signout";

export default function DisplayName() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      setIsDarkMode(savedMode === "dark");
      document.documentElement.classList.toggle("dark", savedMode === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  if (!session?.user) {
    return null;
  }

  const imageUrl = session.user.image;
  const email = session.user.email;
  const name = session.user.name;

  return (
    <div className="relative flex items-center space-x-4 p-4 rounded-3xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100">
      

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild className="bg-transparent focus:bg-transparent">
          <Button className="flex items-center space-x-4 w-full hover:bg-transparent" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Image
              src={imageUrl || 'hmif-logo-p.png'}
              alt={name || 'warga biasa'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden md:flex flex-col text-left overflow-hidden">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-300 truncate">{name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{email}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white dark:bg-gray-900 border dark:border-gray-700">
          <DropdownMenuItem className="group cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Link href={`/profile`} className="flex flex-row -w-full h-full px-4 ">
              <User className="mr-1.5 -ml-1" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme} className="pl-5 group cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            {isDarkMode ? <Sun /> : <Moon />}
            <span className="ml-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="group cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <LogOut className="ml-4 -mr-2"/>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
