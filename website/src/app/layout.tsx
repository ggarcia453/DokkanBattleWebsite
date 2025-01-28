import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dokkan Battle Team Builder",
  description: "Dokkan Battle Team Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-primary dark:text-white`}
      >
        {/* Top Navbar */}
        <nav className="w-full bg-blue-500 text-white dark:bg-secondary dark:text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h2 className="text-xl font-bold">Dokkan Battle Team Builder</h2>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
