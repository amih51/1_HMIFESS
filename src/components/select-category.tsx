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
        setCategory([]); 
      }
    } catch (error) {
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
    <div className="flex m-3">
    <select
        name="Category"
        title="Select a category" 
        className="basic-single-select px-3 py-1 text-xs rounded-lg border-2 border-green-700 bg-white shadow-sm mt-2.5 cursor-pointer"
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