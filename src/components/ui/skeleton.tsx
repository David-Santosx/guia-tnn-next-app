import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "rounded" | "circular";
}

export default function Skeleton({ 
  className, 
  variant = "rectangular" 
}: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-gray-200",
        {
          "rounded-md": variant === "rectangular",
          "rounded-full": variant === "circular",
          "rounded-xl": variant === "rounded",
        },
        className
      )}
    />
  );
}