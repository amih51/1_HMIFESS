import { useState, useEffect } from 'react';
import CreatePostModal from './create-post'; // Make sure to update the import path
import { PencilIcon } from '@heroicons/react/24/outline';

export default function CreatePostButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/all-category");
        const data = await res.json();

        if (Array.isArray(data)) {
          const categoryOptions = data.map((category: any) => ({
            value: category.name,
            label: category.displayName,
          }));
          setCategories(categoryOptions);
        } else {
          console.error("Data fetched is not an array", data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="md:flex mt-0 md:mt-8 items-center text-center px-6 py-2 rounded-3xl bg-green-700 text-white hover:bg-green-900 transition-colors duration-100 overflow-y-auto w-full"
      >
        <PencilIcon className='w-6 h-6 md:mr-3'/>
        <div className='hidden md:block'>Buat Menfess</div>
      </button>

      {isModalOpen && (
        <CreatePostModal
          onClose={handleCloseModal}
          categories={categories}
        />
      )}
    </div>
  );
}
