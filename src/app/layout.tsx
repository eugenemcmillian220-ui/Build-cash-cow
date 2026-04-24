import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI App Builder - Build Full-Stack Applications with AI",
  description: "Generate, refine, and deploy full-stack applications using the power of AI. Built with Next.js, Supabase, and modern AI technologies.",
  keywords: ["AI", "App Builder", "Next.js", "Supabase", "Code Generation", "No-Code", "Low-Code"],
  authors: [{ name: "AI App Builder" }],
  openGraph: {
    title: "AI App Builder",
    description: "Build full-stack applications with the power of AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}