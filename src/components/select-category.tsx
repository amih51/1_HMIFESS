"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OptionType = {
  value: string;
  label: string;
};

export default function SelectCategory() {
  const [category, setCategory] = useState<OptionType[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const categoryToOptions = (): OptionType[] => {
    if (!Array.isArray(category) || category.length < 1) return [];

    return category.map((sub: any) => ({
      value: sub.name,
      label: sub.displayName,
    }));
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/category/all-category");
      const data = await res.json();

      if (Array.isArray(data)) {
        setCategory(data);
      } else {
        console.error("Data fetched is not an array", data);
        setCategory([]); 
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategory([]); 
    }
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      router.push(`/c/${selectedValue}`);
    }
  };

  return (
    <div className="flex items-center justify-between h-8">
    <select
        name="Category"
        title="Select a category" 
        className="basic-single-select px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm"
        onChange={handleCategoryChange}
    >
        <option value="">Select Category</option>
        {categoryToOptions().map((option) => (
        <option key={option.value} value={option.value}>
            {option.label}
        </option>
        ))}
    </select>
    </div>
  );
}
