import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentLens AI — Intelligent Candidate Discovery",
  description:
    "AI-powered recruitment platform that intelligently ranks candidates using NLP, behavioral signals, and career trajectory analysis.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-white antialiased">{children}</body>
    </html>
  );
}
