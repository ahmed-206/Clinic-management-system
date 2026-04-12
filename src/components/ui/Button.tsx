import type { ButtonHTMLAttributes, ReactNode } from "react";
// افترضنا وجود مكتبة أيقونات مثل lucide-react لشكل التحميل
// import { Loader2 } from "lucide-react"; 

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  // تحديث الأشكال لتطابق الصورة المرجعية
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
  
  // 1. الكلاسات الأساسية (Base Styles)
  // تم ضبط الـ rounded ليكون 8px والخط Bold كما في الصورة
  const baseStyles = "px-4 py-2 rounded-[8px] font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]";

  // 2. أشكال الزراير المختلفة (Variants) بناءً على الصورة المرجعية
  const variants = {
    // مطابق لزرار Primary الأخضر في الصورة
    primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none",
    
    // مطابق لزرار Secondary الرمادي في الصورة
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-300",
    
    // مطابق لزرار Outlined في الصورة
    outline: "bg-white border border-neutral-200 text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 disabled:border-neutral-100 disabled:text-neutral-300",
    
    // زرار الخطر (تم تعديله ليكون أكثر وضوحاً ومتناسقاً مع الباليت)
    danger: "bg-danger text-danger-foreground hover:bg-danger/90 disabled:bg-neutral-200",
    
    // متغير خاص للـ Slots (المواعيد) - تم تحسين الألوان لتناسب الباليت الجديد
    select: isActive 
      ? "bg-primary text-primary-foreground shadow-md scale-105 border border-primary" 
      : "bg-white text-neutral-600 border border-neutral-100 hover:border-primary/30 hover:bg-neutral-50 disabled:bg-neutral-100 disabled:text-neutral-300 disabled:line-through"
  };

  return (
    <button
      disabled={disabled || isLoading}
      // دمج الكلاسات الذكي
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* أيقونة التحميل إذا كانت مفعلة */}
      {isLoading ? (
        // <Loader2 className="w-4 h-4 animate-spin" />
        // بديل مبسط إذا لم تستخدم مكتبة أيقونات:
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : null}
      
      {/* محتوى الزرار (نص أو أيقونة ونص) */}
      {children}
    </button>
  );
};