"use client"; 

import Nav from "./nav";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function NavWrapper() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const shouldShowNav = status === "authenticated" && pathname !== "/";

  return shouldShowNav ? <Nav /> : null;
}
