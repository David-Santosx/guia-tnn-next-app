import { Home, Users, Image } from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Administradores",
    href: "/admin/administradores",
    icon: Users,
  },
  {
    title: "Galeria",
    href: "/admin/galeria",
    icon: Image,
  },
];