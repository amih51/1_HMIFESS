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
    <div className='border'>
      <form onSubmit={handleSubmit}>
        <div >
          <label>Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='border'>
          <button type="submit">Create Category</button>
        </div>
      </form>
    </div>
  );
}
