import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  variant?: "primary" | "secondary" | "outline" | "danger" | "select";
  isActive?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const Button = ({
  children,
  variant = "primary",
  isActive = false,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "px-4 py-2 rounded-[8px] font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none",

    secondary:
      "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-300",

    outline:
      " text-white hover:border-neutral-300  disabled:border-neutral-100 disabled:text-neutral-300",

    danger:
      "bg-danger text-danger-foreground hover:bg-danger/90 disabled:bg-neutral-200",

    select: isActive
      ? "bg-primary text-primary-foreground shadow-md scale-105 border border-primary"
      : "bg-white text-neutral-600 border border-neutral-100 hover:border-primary/30 hover:bg-neutral-50 disabled:bg-neutral-100 disabled:text-neutral-300 disabled:line-through",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : null}

      {children}
    </button>
  );
};
