import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavWrapper from "../components/NavWrapper"; // Import NavWrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HMIFess",
  description: "Dibuat untuk pemenuhan tugas SPARTA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </head>
      <body className="min-h-screen bg-backgroundLogo">
        <Providers>
          {/* Menggunakan NavWrapper yang merupakan Client Component */}
          <NavWrapper />
          {children}
        </Providers>
      </body>
    </html>
  );
}
