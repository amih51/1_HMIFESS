"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginBtn from "./login-btn";

type OptionType = {
  value: string;
  label: string;
};

export default function Nav() {
  const [category, setCategory] = useState<OptionType[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  useEffect(() => {
    fetchData();
  }, []);

  const categoryToOptions = (): OptionType[] => {
    if (!Array.isArray(category) || category.length < 1) return [];

    return category.map((sub: any) => ({
      value: sub.name,
      label: sub.displayName,
    }));
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/category/all-category");
      const data = await res.json();

      if (Array.isArray(data)) {
        setCategory(data);
      } else {
        console.error("Data fetched is not an array", data);
        setCategory([]); 
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategory([]); 
    }
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      router.push(`/c/${selectedValue}`);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <SessionProvider>
      <nav className="flex items-center justify-between bg-green-900 p-4">
        <Link href="/" className="flex items-center text-2xl font-bold">
          <img
            src="/hmif-logo.svg"
            alt="Logo HMIF"
            className="w-8 h-auto mr-2"
          />
          HMIFess
        </Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-between h-8">
            <select
              name="Category"
              title="Select a category" 
              className="basic-single-select px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm"
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              {categoryToOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {session?.user ? (
            <div className="relative inline-block text-left">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={toggleDropdown}
              >
                <img
                  src={session.user.image || "/default-profile.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white">{session.user.name}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <Link
                    href={`/profile`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <LoginBtn />
          )}
        </div>
      </nav>
    </SessionProvider>
  );
}
