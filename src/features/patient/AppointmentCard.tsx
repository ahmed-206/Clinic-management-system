import { format } from "date-fns";
import { useCancelAppointment } from "../../hooks/useCancelAppointment";
import { useNavigate } from "react-router-dom";
import { type AppointmentCardProps } from "../../types/types";
import {
  LuCircleCheck,
  LuCircleX,
  LuCircleAlert,
  LuCalendarClock,
  LuHistory 
} from "react-icons/lu";
import { BiLockAlt } from "react-icons/bi";
import { Button } from "../../components/ui/Button";

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const navigate = useNavigate();
  const { mutate: cancel, isPending } = useCancelAppointment();
  const date = new Date(appointment.appointment_date);

  const isCancelled = appointment.status === "cancelled";
  const isRescheduleNeeded = appointment.status === "reschedule_needed";
  const isExpired = appointment.status === "expired";
  const isCompleted = appointment.status === "completed";
  const isNoShow = appointment.status === "no_show";

  const isFinalStatus = isCancelled || isExpired || isCompleted || isNoShow;
  const now = new Date();
  const hoursLeft = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

  const canEditOrCancel =
    !isFinalStatus && (isRescheduleNeeded || hoursLeft > 24);

  return (
    <div
      className={`relative overflow-hidden rounded-[30px] p-6 mb-5 flex flex-col md:flex-row items-center gap-6 shadow-sm border transition-all ${
        isFinalStatus 
          ? "opacity-75 bg-gray-50/50 border-gray-100" 
          : isRescheduleNeeded 
            ? "bg-orange-50/50 border-orange-100 shadow-orange-100" 
            : "bg-white border-gray-50 hover:shadow-md"
      }`}
    >
      {/* 1. دائرة الحرف */}
      <div className={`w-20 h-20 rounded-full shrink-0 flex items-center justify-center text-white text-3xl font-black shadow-inner transition-colors ${isFinalStatus ? "bg-gray-400" : "bg-linear-to-br from-[#D9CDCD] to-[#B8A8A8]"}`}>
        {appointment.doctor.name.charAt(0).toUpperCase()}
      </div>

      {/* 2. تفاصيل الموعد */}
      <div className="flex-1 text-center md:text-left space-y-1">
        <h3 className={`text-xl font-bold ${isRescheduleNeeded ? "text-orange-700" : isFinalStatus ? "text-gray-500" : "text-gray-700"}`}>
          Dr. {appointment.doctor.name}
        </h3>
        
        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 font-semibold">
          <LuCalendarClock size={18} className={isFinalStatus ? "text-gray-400" : "text-primary"} />
          <span>{format(date, "dd MMM yyyy - hh:mm aa")}</span>
        </div>

        {/* تنبيه إعادة الجدولة */}
        {isRescheduleNeeded && (
          <p className="text-sm text-orange-600 mt-2 font-bold flex items-center justify-center md:justify-start gap-1">
            <LuCircleAlert className="animate-pulse" /> Action Required: Doctor updated schedule
          </p>
        )}

        {/* تنبيه القفل الزمني */}
        {!canEditOrCancel && !isFinalStatus && !isRescheduleNeeded && (
          <div className="flex items-center gap-1 text-[11px] text-red-400 mt-2 font-medium bg-red-50 w-fit px-2 py-0.5 rounded-full mx-auto md:mx-0">
            <BiLockAlt />
            <p>Changes locked (under 24h)</p>
          </div>
        )}
      </div>

      {/* 3. الحالات والأزرار */}
      <div className="flex flex-wrap items-center justify-center gap-3 min-w-fit">
        
        {/* حالة ملغي */}
        {isCancelled && (
          <div className="flex items-center gap-2 text-red-400 font-bold px-5 py-2 bg-red-50/50 rounded-2xl border border-red-100">
            Cancelled <LuCircleX />
          </div>
        )}

        {/* حالة منتهي (Expired) */}
        {isExpired && (
          <div className="flex items-center gap-2 text-gray-400 font-bold px-5 py-2 bg-gray-100 rounded-2xl border border-gray-200">
            Expired <LuHistory />
          </div>
        )}

        {/* حالة مكتمل (Completed) */}
        {isCompleted && (
          <div className="flex items-center gap-2 text-primary font-bold px-5 py-2 bg-primary/5 rounded-2xl border border-primary/10">
            Completed <LuCircleCheck />
          </div>
        )}

        {/* حالة لم يحضر (No Show) */}
        {isNoShow && (
          <div className="flex items-center gap-2 text-orange-700 font-bold px-5 py-2 bg-orange-50 rounded-2xl border border-orange-100">
            No Show <LuCircleAlert />
          </div>
        )}

        {/* حالة يحتاج إعادة جدولة */}
        {isRescheduleNeeded && (
          <Button
            variant="primary"
            onClick={() => navigate(`/dashboard/book/${appointment.doctor_id}?rescheduleId=${appointment.id}`)}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-4 shadow-orange-200"
          >
            Reschedule Now
          </Button>
        )}

        {/* الحالة العادية (Pending / Confirmed) */}
        {!isFinalStatus && !isRescheduleNeeded && (
          <>
            <div className="mr-2">
              {appointment.status === "confirmed" ? (
                <span className="flex items-center gap-1.5 text-sm font-black text-primary bg-primary/10 px-4 py-2 rounded-full">
                  Confirmed <LuCircleCheck />
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-black text-orange-500 bg-orange-50 px-4 py-2 rounded-full">
                  Pending <LuCircleAlert />
                </span>
              )}
            </div>

            {canEditOrCancel && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  isLoading={isPending}
                  onClick={() => cancel(appointment.id)}
                  className="text-red-400 border-red-100 hover:border-red-400 hover:bg-red-50 px-4 py-2 text-sm"
                >
                  Cancel
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate(`/dashboard/book/${appointment.doctor_id}?editId=${appointment.id}`)}
                  className="bg-gray-100 border-transparent hover:bg-white text-gray-400 px-4 py-2 text-sm"
                >
                  Edit
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
