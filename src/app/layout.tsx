import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import BackgroundVideo from "../components/BackgroundVideo";
import MobileWarningDialog from "../components/MobileWarningDialog";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "Myles Harris | Portfolio",
  description: "Personal portfolio website of Myles Harris, showcasing professional work and creative projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}
      >
        <BackgroundVideo />
        <Navbar />
        <MobileWarningDialog />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
