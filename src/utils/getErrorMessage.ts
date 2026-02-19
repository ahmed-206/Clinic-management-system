
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  
  // فحص كائنات الخطأ غير القياسية (مثل استجابات السيرفر)
  if (error && typeof error === "object" && "message" in error) {
    return String((error as Record<string, unknown>).message);
  }
  
  return "حدث خطأ غير متوقع في النظام";
};