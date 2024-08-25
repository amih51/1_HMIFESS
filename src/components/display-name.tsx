"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function DisplayName() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!session?.user) {
    return null;
  }

  const imageUrl = session.user.image;
  const email = session.user.email;
  const name = session.user.name;

  return (
    <div className="grid grid-cols-[auto_1fr] items-center md:p-4 rounded-3xl hover:bg-gray-100 transition-colors duration-100">
      <div className="relative">
        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-md shadow-lg z-10"
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="py-1">
              <Link
                href={`/profile`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                href="/api/auth/signout"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </Link>
            </div>
          </div>
        )}
        <button 
          ref={buttonRef}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
          className="flex items-center space-x-4 w-full"
        >
          <Image
            src={imageUrl || 'default-profile.png'}
            alt={name || 'warga biasa'}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <div className="hidden md:flex flex-col text-left overflow-hidden">
            <p className="text-lg font-semibold text-gray-800 truncate">{name}</p>
            <p className="text-sm text-gray-600 truncate">{email}</p>
          </div>
        </button>
      </div>
    </div>
  );
}