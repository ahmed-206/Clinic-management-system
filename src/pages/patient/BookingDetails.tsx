import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Calendar from "react-calendar";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { PriceSummary } from "../../features/patient/PriceSummary";
import "react-calendar/dist/Calendar.css";
import "../../calendar-style.css";
import { ErrorFallback } from "../../components/ui/ErrorBoundary";
import { ErrorBoundary } from "react-error-boundary";
import { useAppointment } from "../../hooks/useAppointment";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useDoctorSchedule } from "../../hooks/useDoctorSchedule";
import {
  combineDateAndTime,
  getLocalDateString,
  getDayStatus,
  buildSlotsWithStatus,
} from "../../utils/appointmentLogic";
import type { DayOfWeek} from "../../types/types";

const BookingDetailsContent = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  
  
  const rescheduleId = searchParams.get("rescheduleId");
  const editId = searchParams.get("editId");
  const activeAppointmentId = rescheduleId || editId;
  const { mutate: createAppointment, isPending: isCreating } = useAppointment();
  const { mutate: updateAppointment, isPending: isUpdating } = useAppointment();

  const { doctorAvailability, isDoctorAvailabilityLoading } =
    useDoctorSchedule(doctorId);

  const [availableSlots, setAvailableSlots] = useState<
    { time: string; isBooked: boolean }[]
  >([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (!selectedDate || !doctorAvailability) return;

    const availability = doctorAvailability.availability || [];
    const bookedAppointments = doctorAvailability.bookedAppointments || [];
    const timeOff = doctorAvailability.timeOff || [];

    const dayOfWeek = selectedDate.getDay() as DayOfWeek;

    setSelectedTime(null);

    const { isHoliday } = getDayStatus(selectedDate, timeOff, availability);
    const dayConfig = availability.find(
      (d) => d.day_of_week === dayOfWeek && d.is_available,
    );

    if (isHoliday || !dayConfig) {
      setAvailableSlots([]);
      return;
    }

    const slots = buildSlotsWithStatus(
      dayConfig,
      bookedAppointments,
      selectedDate,
    );
    setAvailableSlots(slots);
  }, [selectedDate, doctorAvailability]);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && doctorAvailability) {
      const { isHoliday, isWorkDay } = getDayStatus(
        date,
        doctorAvailability.timeOff,
        doctorAvailability.availability,
      );
      // 1. هل اليوم إجازة مسجلة؟

      if (isHoliday) return "holiday-tile";
      if (!isWorkDay) return "not-working-day";
    }
    return null;
  };

  const handleConfirmBooking = () => {
    if (!profile?.is_active) {
    toast.error("عذراً، لا يمكنك الحجز لأن حسابك غير نشط.");
    return;
  }
    // 1. التأكد من وجود البيانات الأساسية
    if (!selectedDate || !selectedTime || !user || !doctorId) {
      toast.error("Please select both date and time");
      return;
    }

    if (!doctorAvailability) {
      toast.error("Doctor schedule is still loading");
      return;
    }
    // 2. تحويل التاريخ المختار لنص "YYYY-MM-DD" للمقارنة الدقيقة
    const { isHoliday, isWorkDay } = getDayStatus(
      selectedDate,
      doctorAvailability.timeOff,
      doctorAvailability.availability,
    );

    // المنع الصارم
    if (isHoliday) {
      toast.error(
        "⚠️ عذراً، هذا اليوم إجازة رسمية للطبيب. برجاء اختيار يوم آخر.",
      );
      return; // سيمنع تنفيذ mutate تماماً
    }

    if (!isWorkDay) {
      toast.error("⚠️ عذراً، الطبيب لا يعمل في هذا اليوم.");
      return;
    }

    // 5. إذا نجح الفحص، يتم الحجز
    const finalDate = combineDateAndTime(selectedDate, selectedTime);

    const handleSuccess = () => {
      toast.success(
        rescheduleId
          ? "Appointment rescheduled successfully!"
          : "Booking Confirmed!",
      );
      setTimeout(() => navigate("/dashboard"), 1500);
    };

    const handleError = (err: unknown) => {
      const message = getErrorMessage(err);
    // 2. فحص الأخطاء الخاصة بقاعدة البيانات (بشكل نظيف وبدون any)
    if (err && typeof err === "object" && "code" in err) {
      const dbError = err as { code: string };
      if (dbError.code === "23505") {
        toast.error("This slot was just taken! Please choose another time.");
        return;
      }
    }

    // 3. عرض أي رسالة خطأ أخرى راجعة من السيرفر أو النظام
    toast.error(message);
    }

    if (activeAppointmentId) {
      updateAppointment(
        {
          id: activeAppointmentId, // نرسل المعرف القديم
          appointment_date: finalDate,
          status: "pending",
        },
        { 
          onSuccess: handleSuccess,
          onError : handleError
         },
        
      );
    } else {
      createAppointment(
        {
          doctor_id: doctorId,
          patient_id: user.id,
          appointment_date: finalDate,
          status: "pending",
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        },
      );
    }
  };

  if (isDoctorAvailabilityLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Schedule...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-8 p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-[#8B7E7E] font-semibold flex items-center gap-2 hover:underline cursor-pointer"
      >
        ← Back to Doctors List
      </button>

      {/* Doctor Header Card */}
      
      <div
        className={`rounded-[30px] p-6 shadow-sm border flex flex-col md:flex-row gap-6 items-center transition-all duration-500 ${
          rescheduleId
            ? "bg-orange-50 border-orange-200"
            : editId
              ? "bg-blue-50 border-blue-200"
              : "bg-white border-gray-100"
        }`}
      >

        
        {/* صورة الطبيب / الأيقونة */}
        <div
          className={`w-24 h-24 rounded-full shrink-0 flex items-center justify-center text-2xl transition-colors ${
            rescheduleId
              ? "bg-orange-200 text-orange-600"
              : editId
                ? "bg-blue-200 text-blue-600"
                : "bg-[#C5B4B4] text-white"
          }`}
        >
          {rescheduleId ? "⚠️" : editId ? "✏️" : "👨‍⚕️"}
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">
            {rescheduleId
              ? "Reschedule Your Appointment"
              : editId
                ? "Modify Your Appointment"
                : "Confirm Appointment"}
          </h2>
          <p className="text-gray-500 text-lg">
            {rescheduleId
              ? "The doctor is unavailable on your original date. Please pick a new slot."
              : editId
                ? "Choose a more suitable time for your visit."
                : `You are booking a new session with Dr. ${doctorAvailability?.doctorName}`}
          </p>
          {doctorAvailability?.doctorBio && (
 
  
    <p className="text-gray-600 leading-relaxed italic">
      "{doctorAvailability.doctorBio}"
    </p>
 
)}
        </div>
       
      </div>
      {/* <div>
        <PriceSummary basePrice={doctorAvailability?.doctorPrice}/>
      </div> */}
 
      {/* Selection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Date Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 ml-2">Select Date</h2>
          <div className="calendar-card shadow-xl rounded-[25px] p-4 bg-white border border-gray-50">
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              tileDisabled={({ date }) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              tileClassName={tileClassName}
              locale="en-US"
              className="custom-calendar"
            />
          </div>
        </div>

        {/* Time Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 ml-2">Select Time</h2>

          {/* الحالة الأولى: وجود مواعيد متاحة */}
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
              {availableSlots.map(({ time, isBooked }) => (
                <button
                  key={time}
                  onClick={() => !isBooked && setSelectedTime(time)}
                  disabled={isBooked}
                  className={`py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    isBooked
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                      : selectedTime === time
                        ? "bg-[#8B7E7E] text-white shadow-lg scale-105"
                        : "bg-white text-gray-600 border hover:bg-gray-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            /* الحالة الثانية: لا توجد مواعيد (إجازة أو يوم غير متاح) */
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-3 animate-fade-in">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                <span className="text-3xl">🗓️</span>
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                {doctorAvailability?.timeOff?.some(
                  (off) =>
                    off.off_date.split("T")[0] ===
                    getLocalDateString(selectedDate!),
                )
                  ? "The doctor is on holiday"
                  : "Not a working day"}
              </h3>

              <p className="text-gray-500 text-sm text-center max-w-62.5">
                {doctorAvailability?.timeOff?.some(
                  (off) =>
                    off.off_date.split("T")[0] ===
                    getLocalDateString(selectedDate!),
                )
                  ? "This day has been marked as a temporary holiday. Please choose another date."
                  : "The doctor does not have scheduled hours for this day of the week."}
              </p>

              <div className="mt-4 px-4 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full border border-red-100 uppercase tracking-wider">
                No Slots Available
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="pt-6 flex justify-center">
        {profile?.is_active ? (<button
          onClick={handleConfirmBooking}
          disabled={
            !selectedDate ||
            !selectedTime ||
            isCreating ||
            isUpdating ||
            availableSlots.length === 0
          }
          className="w-full max-w-md bg-[#8B7E7E] text-white py-5 rounded-lg font-bold text-xl hover:bg-[#6D6161] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-xl active:scale-[0.98]"
        >
          {isCreating || isUpdating
            ? "Processing..."
            : rescheduleId
              ? "Confirm New Time"
              : "Confirm My Appointment"}
        </button>) : <div className="flex justify-center flex-col items-center">
            <h3 className="text-red-800 text-2xl">Your account is suspended.</h3>
            <p>Please call the clinic</p>
          </div>}
      </div>
    </div>
  );
};

export const BookingDetails = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
  >
    <BookingDetailsContent />
  </ErrorBoundary>
);
