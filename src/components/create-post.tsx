"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface CreatePostModalProps {
  onClose: () => void;
  categories: { value: string; label: string }[];
}

export default function CreatePostModal({ onClose, categories = [] }: CreatePostModalProps) {
  const [body, setBody] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { data: session } = useSession();
  const router = useRouter();
  const email = session?.user?.email;
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error("Please select a category before submitting!");
      return;
    }

    const response = await fetch('/api/post/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body, email, isAnon, category: selectedCategory }),
    });

    if (response.ok) {
      router.push(`/c/${selectedCategory}`);
      toast.success("Menfess Anda berhasil terbuat!");
      onClose();
    } else {
      const error = await response.json();
      console.error('Failed to create post', error.message);
      toast.error("Gagal membuat menfess!");
    }
  };

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Buat Menfess</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              className="border w-full bg-gray-100 p-2 rounded"
              placeholder="Tulis menfessmu..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : "Select a category"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari kategori..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.value}
                          onSelect={() => handleCategorySelect(category.value)}
                        >
                          {category.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isAnon}
              onChange={(e) => setIsAnon(e.target.checked)}
              className="mr-2"
            />
            <label>Anonymous</label>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-3xl hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-700 text-white hover:bg-green-900 rounded-3xl"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
