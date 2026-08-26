import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
    "General Knowledge",
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
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#x1F525;</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          id="mathjax-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.MathJax = {
              tex: {
                inlineMath: [["\(", "\)"]],
                displayMath: [["\[", "\]"]],
                processEscapes: true,
                processEnvironments: true,
              },
              options: {
                skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"],
                ignoreHtmlClass: "no-mathjax",
              },
              startup: {
                typeset: false,
                pageReady: () => {
                  return window.MathJax.startup.defaultPageReady();
                },
              },
            };`,
          }}
        />
        <Script
          id="mathjax-script"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
