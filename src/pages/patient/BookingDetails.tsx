import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";
import Calendar from "react-calendar";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import "react-calendar/dist/Calendar.css";
import "../../calendar-style.css";
import { ErrorFallback } from "../../components/ui/ErrorBoundary";
import { ErrorBoundary } from "react-error-boundary";
import { useAppointment } from "../../hooks/useAppointment";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useDoctorSchedule } from "../../hooks/useDoctorSchedule";
import { LuTriangleAlert, LuFilePenLine } from "react-icons/lu";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { PatientSelector } from "../../features/patient/PatientSelector";
import { usePatients } from "../../hooks/patient/usePatients";

import {
  combineDateAndTime,
  getLocalDateString,
  getDayStatus,
  buildSlotsWithStatus,
} from "../../utils/appointmentLogic";
import { LuCalendarX } from "react-icons/lu";
import type { DayOfWeek } from "../../types/types";

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

    const {patients, createPatient, isCreatingPatient} = usePatients();
 
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    full_name: "",
    phone: "",
    gender: "",
    is_self: false,
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const availableSlots = useMemo(() => {
    if (!selectedDate || !doctorAvailability) return [];

    const availability = doctorAvailability.availability || [];
    const bookedAppointments = doctorAvailability.bookedAppointments || [];
    const timeOff = doctorAvailability.timeOff || [];
    const dayOfWeek = selectedDate.getDay() as DayOfWeek;

    const { isHoliday } = getDayStatus(selectedDate, timeOff, availability);
    const dayConfig = availability.find(
      (d) => d.day_of_week === dayOfWeek && d.is_available,
    );

    if (isHoliday || !dayConfig) return [];

    return buildSlotsWithStatus(dayConfig, bookedAppointments, selectedDate);
  }, [selectedDate, doctorAvailability]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedPatientId(null);
    setShowNewPatientForm(false);
    setNewPatient({ full_name: "", phone: "", gender: "", is_self: false });
  };
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

   const handleConfirmBooking = async () => {
    if (!profile?.is_active) {
      toast.error(
        "Sorry, you cannot make a booked because your account is inactive.",
      );
      return;
    }
    // 1. التأكد من وجود البيانات الأساسية
    if (!selectedDate || !selectedTime || !user || !doctorId) {
      toast.error("Please select both date and time");
      return;
    }

     if (!selectedPatientId && !showNewPatientForm) {
      toast.error("Please select who this appointment is for");
      return;
    }
    if (showNewPatientForm && !newPatient.full_name.trim()) {
      toast.error("Please enter the patient's full name");
      return;
    }
    if (showNewPatientForm && !newPatient.phone.trim()) {
      toast.error("Please enter the patient's mobile number");
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
      toast.error("Sorry, the doctor is off today. Please choose another day.");
      return;
    }

    if (!isWorkDay) {
      toast.error("Sorry, the doctor is not working today.");
      return;
    }

    // 5. إذا نجح الفحص، يتم الحجز
    const finalDate = combineDateAndTime(
      selectedDate,
      selectedTime,
    ).toISOString();

    let patientId = selectedPatientId;
    if (showNewPatientForm) {
      try {
         const created = await createPatient({
          booked_by: user.id,
          full_name: newPatient.full_name.trim(),
          phone: newPatient.phone.trim(),
          gender: (newPatient.gender as "male" | "female") || undefined,
          is_self: newPatient.is_self,
        });
        patientId = created.id;
      } catch {
        toast.error("Failed to save patient info. Please try again.");
        return;
      }
    }
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
      // 2. فحص الأخطاء الخاصة بقاعدة البيانات
      if (err && typeof err === "object" && "code" in err) {
        const dbError = err as { code: string };
        if (dbError.code === "23505") {
          toast.error("This slot was just taken! Please choose another time.");
          return;
        }
      }

      // 3. عرض أي رسالة خطأ أخرى راجعة من السيرفر أو النظام
      toast.error(message);
    };

    const appointmentPayload = {
      doctor_id: doctorId,
      patient_id: user.id,
      actual_patient_id: patientId!,
      appointment_date: finalDate,
      status: "pending" as const,
    };

    if (activeAppointmentId) {
      updateAppointment(
        { id: activeAppointmentId, ...appointmentPayload },
        { onSuccess: handleSuccess, onError: handleError },
      );
    } else {
      createAppointment(appointmentPayload, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    }
  };

  if (isDoctorAvailabilityLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6 md:space-y-8 p-2 md:p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-primary font-semibold flex items-center gap-2 hover:underline cursor-pointer text-sm md:text-base"
      >
        ← Back to Doctors List
      </button>

      {/* Doctor Header Card */}

      <div
        className={`rounded-[25px] md:rounded-[30px] p-4 md:p-6 shadow-sm border flex flex-col md:flex-row gap-4 md:gap-6 items-center text-center md:text-left transition-all duration-500 ${
          rescheduleId
            ? "bg-orange-50 border-orange-200"
            : editId
              ? "bg-blue-50 border-blue-200"
              : "bg-white border-gray-100"
        }`}
      >
        {/* صورة الطبيب / الأيقونة */}
        <div
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full shrink-0 flex items-center justify-center text-2xl transition-colors ${
            rescheduleId
              ? "bg-orange-200 text-orange-600"
              : editId
                ? "bg-blue-200 text-blue-600"
                : "bg-neutral-200 text-primary"
          }`}
        >
          {rescheduleId ? (
            <LuTriangleAlert />
          ) : editId ? (
            <LuFilePenLine />
          ) : (
            <FaUserDoctor size={48} />
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            {rescheduleId
              ? "Reschedule Your Appointment"
              : editId
                ? "Modify Your Appointment"
                : "Confirm Appointment"}
          </h2>
          <p className="text-primary-200 text-sm md:text-lg">
            {rescheduleId
              ? "The doctor is unavailable on your original date. Please pick a new slot."
              : editId
                ? "Choose a more suitable time for your visit."
                : `You are booking a new session with Dr. ${doctorAvailability?.doctorName}`}
          </p>
          {doctorAvailability?.doctorBio && (
            <p className="text-secondary leading-relaxed text-xs md:text-sm line-clamp-2 md:line-clamp-none">
              {doctorAvailability.doctorBio}
            </p>
          )}
        </div>
        <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
          <div className="flex justify-between flex-col items-center text-secondary">
            <LiaMoneyBillWaveSolid className="text-primary" size={28} />
            <span>Session Price {doctorAvailability?.doctorPrice} EGP</span>
          </div>
        </div>
      </div>

      {/* Selection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
        {/* Date Section */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-bold text-secondary ">Select Date</h2>
          <div className="calendar-card shadow-xl rounded-[20px] md:rounded-[25px] p-2 md:p-4 bg-white border border-gray-50">
            <Calendar
              onChange={(value) => handleDateChange(value as Date)}
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
          <h2 className="text-lg md:text-xl font-bold text-secondary ml-2">Select Time</h2>

          {/* الحالة الأولى: وجود مواعيد متاحة */}
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
              {availableSlots.map(({ time, isBooked }) => (
                <button
                  key={time}
                  onClick={() => !isBooked && setSelectedTime(time)}
                  disabled={isBooked}
                  className={`py-3 md:py-4 rounded-xl text-xs md:text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300 ${
                    isBooked
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                      : selectedTime === time
                        ? "bg-primary text-white shadow-lg scale-105"
                        : "bg-white text-secondary/80 border border-secondary/30  hover:bg-gray-50"
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
                <LuCalendarX className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-secondary">
                {doctorAvailability?.timeOff?.some(
                  (off) =>
                    off.off_date.split("T")[0] ===
                    getLocalDateString(selectedDate!),
                )
                  ? "The doctor is on holiday"
                  : "Not a working day"}
              </h3>

              <p className="text-secondary/50 text-sm text-center max-w-62.5">
                {doctorAvailability?.timeOff?.some(
                  (off) =>
                    off.off_date.split("T")[0] ===
                    getLocalDateString(selectedDate!),
                )
                  ? "This day has been marked as a temporary holiday. Please choose another date."
                  : "The doctor does not have scheduled hours for this day of the week."}
              </p>

              <div className="mt-4 px-4 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-[8px] border border-red-100 uppercase tracking-wider">
                No Slots Available
              </div>
            </div>
          )}
        </div>
      </div>

   {selectedTime && profile?.is_active && (
        <PatientSelector
    patients={patients}
    selectedPatientId={selectedPatientId}
    showNewPatientForm={showNewPatientForm}
    newPatient={newPatient}
    isCreating={isCreating}
    isUpdating={isUpdating}
    isCreatingPatient={isCreatingPatient}
    rescheduleId={rescheduleId}
    onSelectPatient={(id) => {
      setSelectedPatientId(id);
      setShowNewPatientForm(false);
    }}
    onShowNewForm={() => {
      setShowNewPatientForm(true);
      setSelectedPatientId(null);
    }}
    onNewPatientChange={(field, value) =>
      setNewPatient((p) => ({ ...p, [field]: value }))
    }
    onConfirm={handleConfirmBooking}
  />
      )}

      {/* Account suspended */}
      {!profile?.is_active && (
        <div className="flex justify-center flex-col items-center p-8 bg-red-50 rounded-2xl border border-red-100 mt-6">
          <h3 className="text-red-800 text-2xl font-bold">Your account is suspended.</h3>
          <p className="text-red-600">Please call the clinic to resolve this issue.</p>
        </div>
      )}
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
