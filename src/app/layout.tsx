import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers";
import Nav from "@/components/nav";

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
          <div className="flex flex-col md:flex-row min-h-screen">
            <Nav />
            <main className="flex-1 bg-gray-100 p-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
