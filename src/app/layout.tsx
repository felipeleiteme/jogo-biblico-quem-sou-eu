import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quem Sou Eu? - Jogo Bíblico Interativo",
  description: "Descubra personagens bíblicos através de pistas progressivas. Jogo educativo com 100 rodadas e design minimalista elegante.",
  keywords: ["jogo bíblico", "bíblia", "personagens bíblicos", "educação cristã", "quem sou eu", "interativo"],
  authors: [{ name: "Felipe Leite" }],
  openGraph: {
    title: "Quem Sou Eu? - Jogo Bíblico Interativo",
    description: "Descubra personagens bíblicos através de pistas progressivas. Jogo educativo com 100 rodadas.",
    url: "https://github.com/felipeleiteme/jogo-biblico-quem-sou-eu",
    siteName: "Quem Sou Eu? - Jogo Bíblico",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quem Sou Eu? - Jogo Bíblico Interativo",
    description: "Descubra personagens bíblicos através de pistas progressivas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
