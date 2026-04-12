/**
 * Converts any ISO timestamp or Date to "YYYY-MM-DD" using the
 * browser's LOCAL timezone — NOT UTC.
 *
 * Why this matters: new Date().toISOString().split("T")[0] gives the UTC
 * date, which is wrong for clinics in UTC+ zones (e.g. UTC+2 Egypt).
 * At 00:30 local time that would still return yesterday's UTC date.
 */
export const toLocalISODate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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