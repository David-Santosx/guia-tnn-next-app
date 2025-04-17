"use client";

import { ThemeProvider } from "@/providers/theme-provider";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Admin header, sidebar, etc. can be added here */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </ThemeProvider>
  );
}
