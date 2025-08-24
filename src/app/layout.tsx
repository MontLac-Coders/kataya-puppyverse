import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { register } from "@/lib/serviceWorker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kataya's Puppyverse - Kataya's Puppy Adventure",
  description: "An educational and entertaining game where Kataya learns, plays, and takes care of her two puppies KK and Hailey.",
  keywords: ["Kataya's", "Kids Game", "Educational Game", "Puppy Care", "Spanish Learning", "Trivia", "Kataya"],
  authors: [{ name: "MontLac-Coders Team" }],
  openGraph: {
    title: "Kataya's Puppyverse - Kataya's Puppy Adventure",
    description: "Educational and entertaining puppy adventure game for kids",
    url: "http://localhost:3000",
    siteName: "Grand Puppyverse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kataya's Puppyverse - Kataya's Puppy Adventure",
    description: "Educational and entertaining puppy adventure game for kids",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kataya's Puppyverse",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Register service worker for offline support
  if (typeof window !== 'undefined') {
    register();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}