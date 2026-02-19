import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../api/admin/adminServic";

export const useAdminDashboard = () => {
  // 1. هوك لجلب الإحصائيات الرئيسية والـ Charts والـ Top Doctors
  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getDashboardStats(),
    // تحديث البيانات تلقائياً كل 5 دقائق
    refetchInterval: 1000 * 60 * 5,
    // إعادة المحاولة مرتين فقط في حالة الفشل
    retry: 2,
  });

  // 2. هوك منفصل لجلب آخر النشاطات (Activity Feed)
  // فصلناهم عشان لو النشاطات اتحدثت أسرع ميعملش رندر لكل الإحصائيات
  const activityQuery = useQuery({
    queryKey: ["admin-activity"],
    queryFn: () => adminService.getRecentActivity(),
    refetchInterval: 1000 * 60 * 2, // تحديث كل دقيقتين للنشاطات
  });

  return {
    // البيانات الإحصائية
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    statsError: statsQuery.error,

    // النشاطات الأخيرة
    activities: activityQuery.data,
    isActivityLoading: activityQuery.isLoading,

    // دالة لتحديث البيانات يدوياً (مثلاً عند الضغط على زر Refresh)
    refreshData: () => {
      statsQuery.refetch();
      activityQuery.refetch();
    },
  };
};
