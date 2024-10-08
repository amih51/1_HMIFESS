import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers";
import Nav from "@/components/nav";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col md:flex-row min-h-screen">
              <Nav />
              <main className="flex-1 bg-gray-100 dark:bg-gray-900 pt-16 md:pt-0 md:pl-64">{children}</main>
              <Toaster />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
