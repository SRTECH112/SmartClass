import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartClass - AI-Assisted Slide & Lesson Plan Generator",
  description:
    "Transform your textbook pages into ready-to-teach slides in minutes. Built for Philippine private school teachers.",
  keywords: [
    "lesson planning",
    "PowerPoint generator",
    "teacher tools",
    "Philippines education",
    "DepEd",
    "AI teaching assistant",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        {children}
      </body>
    </html>
  );
}
