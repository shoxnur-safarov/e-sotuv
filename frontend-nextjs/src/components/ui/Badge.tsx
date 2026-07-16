import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide",
        {
          "bg-green-100 text-green-700": variant === "success",
          "bg-yellow-100 text-yellow-700": variant === "warning",
          "bg-red-100 text-red-700": variant === "error",
          "bg-gray-100 text-gray-700": variant === "default",
        },
        className
      )}
    >
      {children}
    </span>
  );
}