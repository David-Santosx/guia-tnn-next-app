import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

export function SidebarSection({ 
  title, 
  children, 
  defaultOpen = true,
  collapsible = false
}: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1">
      <div 
        className={cn(
          "flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 py-2",
          collapsible && "cursor-pointer hover:text-gray-400"
        )}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <span>{title}</span>
        {collapsible && (
          <ChevronDown 
            size={14} 
            className={cn(
              "transition-transform",
              isOpen ? "transform rotate-0" : "transform rotate-180"
            )} 
          />
        )}
      </div>
      
      <div className={cn(
        "space-y-1 transition-all",
        collapsible && !isOpen && "hidden"
      )}>
        {children}
      </div>
    </div>
  );
}