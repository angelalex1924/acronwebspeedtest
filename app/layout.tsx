import type React from "react";
import "@/app/globals.css";
import { Inter } from 'next/font/google';
import { AuthProvider } from "@/context/auth-context"; // Import the AuthProvider
import InstallPWA from "@/components/InstallPWA"; // Import the PWA install component

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
      <body className={inter.className}>
        <AuthProvider>
          {children} {/* Wrap children with AuthProvider */}
          <InstallPWA /> {/* Add the PWA install banner */}
        </AuthProvider>
      </body>
    </html>
  );
}
