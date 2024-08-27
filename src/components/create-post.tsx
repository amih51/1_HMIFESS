"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

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
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Buat Menfess</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Checkbox
                checked={isAnon}
                onCheckedChange={(checked) => setIsAnon(!!checked)}
                id="anon-checkbox"
              />
              <label htmlFor="anon-checkbox" className="ml-2">Anonymous</label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Kirim
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
