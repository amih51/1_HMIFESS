"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import Popup from 'reactjs-popup';


export default function CreateCategory() {
  const [name, setName] = useState('');
  const router = useRouter();
  const { data: session } = useSession()
  const email = session?.user?.email

  const handleSubmit = async (e: React.FormEvent) => {
    const response = await fetch('/api/category/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name,  email}),
    });

    if (response.ok) {
      router.push('/');
    } else {
      console.error('Failed to create category');
    }
  };

  return (
    <div className='bg-white'>
      <Popup trigger=
                {<button className='m-2 mt-4 text-xs rounded-lg bg-green-700 text-white py-1.5 px-3 hover:text-black hover:bg-white hover:border-2 hover:border-green-700 place-content-center'>
                  Create New Category </button>}
                position="right center">
                <form onSubmit={handleSubmit}>
                  <div className='bg-yellow-400 px-2 rounded-lg place-items-center'>
                    <label className='text-xs font-semibold'>New Category Name:</label>
                    <input className='bg-white ml-4 rounded'
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <button type="submit" className='text-xs border border-green-700 hover:bg-green-700 hover:text-white rounded-full m-4 px-2 py-0.5'>Create Category</button>
                  </div>
                </form>
      </Popup>
      
    </div>
  );

  
}
