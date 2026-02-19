import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../api/doctor/doctorService";
import { appointmentService } from "../api/appointmentService";
import { type DoctorAvailability } from "../types/types";

export const useDoctorSchedule = (doctorId: string | undefined) => {
  const queryClient = useQueryClient();

  // 1. جلب البيانات (Query)
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ["doctorSchedule", doctorId],
    queryFn: () => doctorService.getWeeklyAvailability(doctorId!),
    enabled: !!doctorId,
  });

  // 2. دالة الحفظ (Mutation)
  const updateScheduleMutation = useMutation({
    mutationFn: (newSchedule: DoctorAvailability[]) =>
      doctorService.saveWeeklyAvailability(newSchedule),
    // تحديث الكاش فورًا ليعرف المتصفح أن البيانات تغيرت
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorSchedule", doctorId] });
      alert("Schedule saved!");
    },
    onError: () => alert("Failed to save schedule"),
  });

  //  جلب الإجازات

  const timeOffQuery = useQuery({
    queryKey: ["timeOff", doctorId],
    queryFn: () => doctorService.getTimeOff(doctorId!),
    enabled: !!doctorId,
  });

  // إضافة إجازة

  const addTimeOffMutation = useMutation({
    mutationFn: async (params: { doctor_id: string; off_date: string }) => {
      await doctorService.addTimeOff(params);
      await appointmentService.markAppointmentsForReschedule(
        params.doctor_id,
        params.off_date,
      );
    },
    onSuccess: () => {
      // تحديث كل الاستعلامات المتعلقة بالمواعيد لضمان المزامنة
      queryClient.invalidateQueries({ queryKey: ["timeOff", doctorId] });
      queryClient.invalidateQueries({ queryKey: ["publicSchedule", doctorId] });
      queryClient.invalidateQueries({ queryKey: ["doctorSchedule", doctorId] });
    },
  });

  // حذف إجازة
  const removeTimeOffMutation = useMutation({
    mutationFn: (id: string) => doctorService.removeTimeOff(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["timeOff", doctorId] }),
  });

  const publicDoctorSchedule = useQuery({
    queryKey: ["publicSchedule", doctorId],
    queryFn: async () => {
      // جلب البيانات بشكل منفصل للتأكد
      const [availability, timeOff, bookedAppointments, doctorInfo] =
        await Promise.all([
          doctorService.getWeeklyAvailability(doctorId!),
          doctorService.getTimeOff(doctorId!),
          doctorService.getAllAppointments(doctorId!), // تأكد من وجود هذه الدالة في الـ service
          doctorService.getDoctorBasicInfo(doctorId!),
        ]);

      console.log("Fetched Booked Apps from Service:", bookedAppointments);
      return {
        availability,
        timeOff,
        bookedAppointments,
        doctorName: doctorInfo.name || "Doctor",
        doctorSpecialty: doctorInfo.specialty,
        doctorBio: doctorInfo.bio,
        doctorPrice: doctorInfo?.price_per_session || 0,
      };
    },
    enabled: !!doctorId,
    // إضافة هذه الإعدادات لضمان عدم حدوث كاش للبيانات القديمة
    staleTime: 1000 * 60,
    gcTime: 0,
  });

  return {
    scheduleData,
    isLoading,
    saveSchedule: updateScheduleMutation.mutate,
    isSaving: updateScheduleMutation.isPending,
    timeOffData: timeOffQuery.data,
    isTimeOffLoading: timeOffQuery.isLoading,
    addTimeOff: addTimeOffMutation.mutate,
    removeTimeOff: removeTimeOffMutation.mutate,
    doctorAvailability: publicDoctorSchedule.data,
    isDoctorAvailabilityLoading: publicDoctorSchedule.isLoading,
  };
};
