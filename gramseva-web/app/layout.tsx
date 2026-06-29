import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GramSeva - ग्राम सेवा",
  description: "Digital services for rural India - सरकारी योजनाएं, कृषि, शिक्षा, स्वास्थ्य और अधिक",
  manifest: "/manifest.json",
  verification: {
    google: "c6fcd102c1c4cce9",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${geistSans.variable} h-full`}>
      <body className="h-full" style={{ backgroundColor: '#F5F5F5' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
