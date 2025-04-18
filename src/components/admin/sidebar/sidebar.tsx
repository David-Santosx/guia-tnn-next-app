"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  X,
  Home,
  Calendar,
  Store,
  FileText,
  LogOut,
  ImageIcon,
  Crown,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { SidebarSection } from "./sidebar-section";
import { MobileMenuToggle } from "./mobile-menu-toggle";
import { useAdmin } from "@/contexts/admin-context";
import Image from "next/image";

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { admin } = useAdmin();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle
        isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo and Close Button (Mobile) */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/brand/guia-tnn-logo.svg"
              width={120}
              height={40}
              alt="Guia TNN"
              className="bg-white px-2 py-1 rounded-sm"
            />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-gray-400 rounded-md hover:bg-gray-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-semibold">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {admin?.name || "Administrador"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {admin?.email || "admin@guiatnn.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-13rem)]">
          <SidebarSection title="Geral">
            <SidebarItem
              href="/admin"
              icon={Home}
              label="Dashboard"
              isActive={pathname === "/admin"}
            />
            <SidebarItem
              href="/admin/eventos"
              icon={Calendar}
              label="Eventos"
              isActive={pathname.startsWith("/admin/eventos")}
            />
            <SidebarItem
              href="/admin/comercios"
              icon={Store}
              label="Comércios"
              isActive={pathname.startsWith("/admin/comercios")}
            />
          </SidebarSection>

          <SidebarSection title="Conteúdo">
            <SidebarItem
              href="/admin/paginas"
              icon={FileText}
              label="Páginas"
              isActive={pathname.startsWith("/admin/paginas")}
            />
            <SidebarItem
              href="/admin/galeria"
              icon={ImageIcon}
              label="Galeria"
              isActive={pathname.startsWith("/admin/galeria")}
            />
          </SidebarSection>

          <SidebarSection title="Sistema">
            <SidebarItem
              href="/admin/administradores"
              icon={Crown}
              label="Administradores"
              isActive={pathname.startsWith("/admin/administradores")}
            />
            {/* Updated Logout Item */}
            <SidebarItem
              href="/api/auth/logout"
              icon={LogOut}
              label="Sair"
              variant="danger"
            />
          </SidebarSection>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
