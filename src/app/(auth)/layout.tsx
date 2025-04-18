"use client";

import { ThemeProvider } from "@/providers/theme-provider";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <div className="min-h-screen bg-gray-900 text-white">
        {children}
      </div>
    </ThemeProvider>
  );
}