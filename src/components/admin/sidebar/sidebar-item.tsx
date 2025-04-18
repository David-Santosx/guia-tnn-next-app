import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  variant?: "default" | "danger";
}

export function SidebarItem({ 
  href, 
  icon: Icon, 
  label, 
  isActive = false,
  variant = "default"
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive 
          ? "bg-gray-800 text-white" 
          : variant === "danger"
            ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}