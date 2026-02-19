import { LuLoaderCircle } from "react-icons/lu";
interface SpinnerProps {
  // هنا نحدد أن الحجم يجب أن يكون واحداً من هذه الثلاثة فقط
  size?: 'sm' | 'md' | 'lg'; 
  fullPage?: boolean;
}

export const LoadingSpinner = ({ size = "md", fullPage = false }: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <LuLoaderCircle className={`${sizeClasses[size]} text-primary animate-spin`} />
      <p className="text-sm font-medium text-gray-500 animate-pulse">
       Loading...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-100 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};