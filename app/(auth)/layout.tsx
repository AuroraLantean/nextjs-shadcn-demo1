import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextThemeProvider } from "@/components/providers/NextThemeProvider";//NOT next-themes!!!
import "../globals.css";
import Topbar from "@/components/shared/Topbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextJs 13 App: Auth",
  description: "A NextJs 13 app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className}`}>
        <NextThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange >
          <Topbar />
          <div className="min-h-screen">
            {children}
          </div>
        </NextThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
