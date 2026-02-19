// دالة لتنسيق التاريخ من الحقل المدمج
export const formatDisplayDate = (dateTimeStr: string) => {
  if (!dateTimeStr) return "N/A";
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// دالة لتنسيق الوقت من الحقل المدمج
export const formatDisplayTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return "N/A";
  const date = new Date(dateTimeStr);
  
  // التحقق من أن التاريخ صالح (Valid Date)
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};