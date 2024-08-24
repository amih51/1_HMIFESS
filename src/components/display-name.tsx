"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

export default function DisplayName() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!session?.user) {
    return null;
  }

  const imageUrl = session.user.image;
  const email = session.user.email;
  const name = session.user.name;

  return (
    <div className="sgrid grid-cols-[auto_1fr] items-center md:p-4 rounded-3xl hover:bg-gray-100 transition-colors duration-100">
      <button onClick={toggleDropdown} className="flex items-center space-x-4 w-full">
        <img
          className="w-8 h-8 rounded-full"
          src={imageUrl || 'default-profile.png'}
          alt={name || 'warga biasa'}
        />
        <div className="hidden md:flex flex-col text-left overflow-hidden">
          <p className="text-lg font-semibold text-gray-800 truncate">{name}</p>
          <p className="text-gray-600 truncate">{email}</p>
        </div>
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
  );
}
