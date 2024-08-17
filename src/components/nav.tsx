"use client";

import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginBtn from "./login-btn";

type OptionType = {
    value: string;
    label: string;
};

export default function Nav() {
    const [category, setCategory] = useState<OptionType[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const categoryToOptions = (): OptionType[] => {
        if (category.length < 1) return [];
        
        return category.map((sub: any) => ({
            value: sub.name,
            label: sub.displayName,
        }));
    };

    const fetchData = async () => {
        const res = await fetch("/api/category/all-category");
        const category = await res.json();
        setCategory(category);
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (selectedValue) {
            router.push(`/c/${selectedValue}`);
        }
    };

    return (
        <SessionProvider>
            <nav className="flex items-end justify-between bg-colorLogo">
                    <Link href="/" className="flex items-center justify-between text-2xl font-bold">
                        <img 
                            src="/hmif-logo.svg" 
                            alt="Logo HMIF" 
                            className="w-8 h-auto"
                        />
                        HMIFess
                    </Link>
                <div className="flex items-center justify-between h-8">
                    <select
                        name="Category"
                        className="basic-single-select"
                        onChange={handleChange}
                    >
                        {categoryToOptions().map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <LoginBtn />
                </div>
            </nav>
        </SessionProvider>
    );
}
