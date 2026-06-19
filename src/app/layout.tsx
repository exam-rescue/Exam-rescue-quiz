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

export const metadata: Metadata = {
  title: "Exam Rescue — Gamified Quiz App for CBSE, JEE & NEET",
  description:
    "Crush your exams with India's most addictive quiz app! Battle mode, practice questions, leaderboards, and XP system for CBSE Class 11-12, JEE, and NEET preparation.",
  keywords: [
    "Exam Rescue",
    "CBSE",
    "JEE",
    "NEET",
    "quiz",
    "gamified learning",
    "Indian students",
    "Physics",
    "Chemistry",
    "Biology",
    "Maths",
  ],
  authors: [{ name: "Exam Rescue Team" }],
  openGraph: {
    title: "Exam Rescue — Crush Your Exams!",
    description: "The most addictive quiz app for CBSE, JEE & NEET preparation. Battle, learn, and level up!",
    url: "https://examrescue.pages.dev",
    siteName: "Exam Rescue",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exam Rescue — Crush Your Exams!",
    description: "The most addictive quiz app for CBSE, JEE & NEET preparation.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
