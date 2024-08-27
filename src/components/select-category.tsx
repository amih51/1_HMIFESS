"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

type OptionType = {
  value: string;
  label: string;
};

export default function SelectCategory() {
  const [category, setCategory] = useState<OptionType[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<OptionType | null>(null);
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/category/all-category");
      const data = await res.json();

      if (Array.isArray(data)) {
        setCategory(
          data.map((sub: any) => ({
            value: sub.name,
            label: sub.displayName,
          }))
        );
      } else {
        setCategory([]);
      }
    } catch (error) {
      setCategory([]);
    }
  };

  const filteredOptions = query === ""
    ? category
    : category.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );

  const handleCategoryChange = (value: string) => {
    const selected = category.find((option) => option.value === value) || null;
    setSelectedCategory(selected);
    setOpen(false);

    if (selected) {
      router.push(`/c/${selected.value}`);
    }
  };

  return (
    <div className="flex m-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedCategory ? selectedCategory.label : "Select Category"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Cari kategori..."
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleCategoryChange}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
