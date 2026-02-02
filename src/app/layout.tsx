import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Assuming these are correct from previous view
import "./globals.css";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SchoolFinder NG - Find the Best Schools in Nigeria",
  description: "Discover top-rated schools in Nigeria. Filter by budget, curriculum, facilities, and more.",
  icons: {
    icon: '/favicon.png', // Keeping original icon path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageTransition>
          {children}
        </PageTransition>
        <Navbar />
      </body>
    </html>
  );
}
