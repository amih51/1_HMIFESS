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
        <link rel="icon" type="image/png" href="/hmifess-logo-bg.svg" />
      </head>
      <body className="min-h-screen min-w-min bg-backgroundLogo">
        <Providers>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Nav />
            <main className="flex-1 bg-gray-100 pt-16 md:pt-0 md:pl-64">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
