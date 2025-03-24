import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Speedtest by AcronWeb",
  description: "Measure your internet connection speed with precision",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="msapplication-TileColor" content="#82f01f" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
