import { type FallbackProps } from "react-error-boundary";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const message = getErrorMessage(error);

  return (
    <div className="min-h-100 w-full flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[30px] p-8 shadow-xl border border-red-50 text-center space-y-6">
        {/* أيقونة تحذير جمالية */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-3xl">
          ⚠️
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">عذراً، حدث خطأ تقني</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            لقد واجه التطبيق مشكلة غير متوقعة. يمكنك محاولة إعادة تحميل الصفحة أو العودة للرئيسية.
          </p>
        </div>

        {/* عرض الخطأ المترجم بدقة */}
        <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
          <code className="text-xs text-red-600 break-all font-mono">
            {message}
          </code>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
          >
            إعادة المحاولة
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-3 bg-white text-gray-600 rounded-2xl font-semibold border hover:bg-gray-50 transition-colors"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    </div>
  );
};