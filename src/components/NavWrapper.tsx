// src/components/NavWrapper.tsx
"use client"; // Ini adalah Client Component

import Nav from "./nav";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function NavWrapper() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Menampilkan navbar hanya jika pengguna sudah login dan bukan di landing page
  const shouldShowNav = status === "authenticated" && pathname !== "/";

  return shouldShowNav ? <Nav /> : null;
}
