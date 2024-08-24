// components/SearchBar.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-row font-sans mt-3 p-2 border-2 bg-gray-200 rounded-lg place-items-center">
      <MagnifyingGlassIcon className="w-6 h-6"/>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Pencarian"
        className="h-6 w-full ml-3 text-xs text-slate-700 bg-transparent focus:outline-none"
      />
    </form>
  );
};

export default SearchBar;