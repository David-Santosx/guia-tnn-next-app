"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { AdminProvider } from "@/contexts/admin-context";
import { Sidebar } from "@/components/admin/sidebar/sidebar";
import Link from "next/link"; // Import Link
import { Anchor } from "lucide-react"; // Import an icon

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
        <div className="min-h-screen bg-gray-900 text-white flex relative">
          {" "}
          {/* Added relative positioning */}
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            {/* Back to Site Button */}
            <div className="mb-6">
              <Link
                href="/"
                className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                aria-label="Voltar ao site principal"
              >
                <Anchor className="w-3 h-3" />
                <span>Voltar ao Site</span>
              </Link>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mt-10"></div>
            </div>
            {children}
          </main>
        </div>
      </AdminProvider>
    </ThemeProvider>
  );
}
