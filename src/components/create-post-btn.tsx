import { useState, useEffect } from 'react';
import CreatePostModal from './create-post'; // Make sure to update the import path

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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-3 hidden xl:block ">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>

        Buat Menfess
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
