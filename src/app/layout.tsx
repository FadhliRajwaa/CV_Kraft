import type { Metadata } from "next";
import type { ReactNode } from "react";
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
  title: "CVKraft — Buat CV ATS-Friendly Gratis",
  description: "Buat CV online dengan mudah. Dapatkan CV ATS friendly gratis menggunakan CV maker Indonesia terbaik untuk tingkatkan peluang kerja Anda.",
  openGraph: {
    title: "CVKraft — Buat CV ATS-Friendly Gratis",
    description: "Buat CV online dengan mudah. Dapatkan CV ATS friendly gratis menggunakan CV maker Indonesia terbaik untuk tingkatkan peluang kerja Anda.",
    url: "https://cvkraft.com",
    siteName: "CVKraft",
    images: [
      {
        url: "https://cvkraft.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CVKraft - Buat CV ATS-Friendly Gratis",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVKraft — Buat CV ATS-Friendly Gratis",
    description: "Buat CV online dengan mudah. Dapatkan CV ATS friendly gratis menggunakan CV maker Indonesia terbaik untuk tingkatkan peluang kerja Anda.",
    images: ["https://cvkraft.com/og-image.jpg"],
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
