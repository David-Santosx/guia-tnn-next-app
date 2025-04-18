import { Menu } from "lucide-react";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuToggle({ isOpen, onClick }: MobileMenuToggleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-40 p-2 rounded-md bg-gray-800 text-white border border-gray-700 lg:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <Menu size={20} />
    </button>
  );
}