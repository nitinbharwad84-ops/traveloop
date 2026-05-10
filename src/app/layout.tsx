import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

export const metadata: Metadata = {
  title: "Traveloop | Personalized Travel Planning",
  description: "Plan your next adventure with Traveloop. Personalized itineraries, budget tracking, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthInitializer />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
