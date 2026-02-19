import { format } from "date-fns";
import { useCancelAppointment } from "../../hooks/useCancelAppointment";
import { useNavigate } from "react-router-dom";
import { type AppointmentCardProps } from "../../types/types";
import { LuCircleCheck, LuCircleX, LuCircleAlert } from "react-icons/lu";

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const navigate = useNavigate();
  const { mutate: cancel, isPending } = useCancelAppointment();
  const date = new Date(appointment.appointment_date);
  const isCancelled = appointment.status === "cancelled";
  const isRescheduleNeeded = appointment.status === "reschedule_needed";

  // --- منطق الحماية الجديد ---
  const now = new Date();
  const hoursLeft = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

  // يمكن التعديل في حالتين:
  // 1. الطبيب طلب إعادة جدولة (حتى لو الموعد بعد ساعة).
  // 2. الموعد عادي (Confirmed) ولسه قدامه أكتر من 24 ساعة.
  const canEditOrCancel =
    isRescheduleNeeded || (hoursLeft > 24 && !isCancelled);
  return (
    <div
      className={`bg-white rounded-[30px] p-6 mb-4 flex items-center gap-6 shadow-sm ${isCancelled ? "opacity-60 bg-gray-100" : "bg-[#F8F1F1]"}`}
    >
      {/* صورة الطبيب (دائرة) */}
      <div className="w-20 h-20 bg-[#D9CDCD] rounded-full shrink-0">
        {appointment.doctor.name.charAt(0).toUpperCase()}
      </div>

      {/* تفاصيل الموعد */}
      <div className="flex-1">
        <h3
          className={`font-medium ${isRescheduleNeeded ? "text-orange-700" : "text-gray-500"}`}
        >
          {appointment.doctor.name}
        </h3>
        <p className="text-gray-500 font-medium">
          {format(date, "dd.MM.yyyy - HH:mm")}
        </p>

        {isRescheduleNeeded && (
          <p className="text-sm text-orange-600 mt-1 font-bold animate-pulse">
            ⚠️ The doctor updated their schedule. Please pick a new time.
          </p>
        )}

        {/* تنبيه بسيط لو الموعد قرب والتعديل اتقفل */}
        {!canEditOrCancel && !isCancelled && !isRescheduleNeeded && (
          <p className="text-[10px] text-red-400 mt-1 italic">
            * Changes locked (less than 24h remaining)
          </p>
        )}
      </div>

      {/* الحالة وأزرار التحكم */}
      <div className="flex items-center gap-4">
        {isCancelled ? (
          <span className="flex items-center gap-1 text-red-500 font-bold px-4 py-2 rounded-lg bg-white">
            This appointment was cancelled
            <LuCircleX />
          </span>
        ) : isRescheduleNeeded ? (
          /* أزرار حالة إعادة الجدولة */
          <button
            onClick={() =>
              navigate(
                `/dashboard/book/${appointment.doctor_id}?rescheduleId=${appointment.id}`,
              )
            }
            className="px-8 py-3 bg-customOrange text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg active:scale-95"
          >
            Reschedule Now
          </button>
        ) : (
          /* الحالة الطبيعية (Confirmed / Pending) */
          <>
            <div >
              {appointment.status === "confirmed" ? (
                <span className="flex items-center gap-1 text-lg font-bold text-primary bg-white/50 px-3 py-1">
                  Confirmed <LuCircleCheck />
                </span>
              ) : (
                <span className="flex items-center gap-1 text-lg font-bold text-customOrange bg-white/50 px-3 py-1">
                    Pending
                  <LuCircleAlert />
                </span>
              )}
            </div>

            {canEditOrCancel && (
              <button
                onClick={() => cancel(appointment.id)}
                className="px-6 py-2 bg-white border border-red-200 rounded-xl font-bold text-red-400 hover:bg-red-50 transition-colors"
                disabled={isPending}
              >
                {isPending ? "..." : "cancel"}
              </button>
            )}

            {canEditOrCancel && (
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/book/${appointment.doctor_id}?editId=${appointment.id}`,
                  )
                }
                className="px-6 py-2 bg-[#D9CDCD] rounded-xl font-bold text-gray-700 hover:bg-[#cbbdbd] transition-colors"
              >
                edit
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
