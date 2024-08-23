"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
    <div className='bg-white m-5 rounded'>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name</label>
          <input className='bg-gray-300 m-1 rounded'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" className='bg-green-400 rounded m-4'>Create Category</button>
        </div>
      </form>
    </div>
  );
}
