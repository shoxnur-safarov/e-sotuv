import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[var(--text)]">{label}</label>}
      <input
        className={cn(
          "px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors",
          error && "border-[var(--error)] focus:border-[var(--error)]",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-[var(--error)]">{error}</p>}
    </div>
  );
}