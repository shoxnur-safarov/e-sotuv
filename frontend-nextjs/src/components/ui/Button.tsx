import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]": variant === "primary",
          "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white": variant === "outline",
          "text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-800": variant === "ghost",
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-5 py-2.5 text-base": size === "md",
          "px-7 py-3.5 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}