import type{ ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "danger" | "select";
  isActive?: boolean; // خاص للزراير اللي زي اختيارات الوقت
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
  
  // الكلاسات الأساسية لكل الزراير
  const baseStyles = "px-6 py-3 rounded-[8px] font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]";

  // أشكال الزراير المختلفة
  const variants = {
    primary: "bg-primary text-white shadow-lg hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none",
    outline: "bg-white border-2 border-gray-100 text-gray-600 hover:border-primary/30 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white",
    // متغير خاص للـ Slots (المواعيد)
    select: isActive 
      ? "bg-primary text-white shadow-lg scale-105" 
      : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:line-through"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};