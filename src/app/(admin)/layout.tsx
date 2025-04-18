"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { AdminProvider } from "@/contexts/admin-context";

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
      <AdminProvider>
        <div className="min-h-screen bg-background text-foreground">
          {/* Admin header, sidebar, etc. can be added here */}
          <main>{children}</main>
        </div>
      </AdminProvider>
    </ThemeProvider>
  );
}
