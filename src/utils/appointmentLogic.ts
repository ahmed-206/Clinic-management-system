import type { TimeOff, DoctorAvailability, DayOfWeek, AppointmentData } from "../types/types";

// دالة تحويل التاريخ لنص YYYY-MM-DD
export const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// دالة تحويل الوقت النصي إلى دقائق (مثال: "10:30 AM" -> 630)
export const combineDateAndTime = (date: Date, timeStr: string) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier?.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (modifier?.toLowerCase() === "am" && hours === 12) hours = 0;

  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

// مراقبة حالة اليوم 
export const getDayStatus = (date: Date, timeOff: TimeOff[], availability: DoctorAvailability[]) => {
  const dateString = getLocalDateString(date); //معرفة تاريخ اليوم 
  const dayOfWeek = date.getDay(); //معرفة اليوم (سبت - احد- ..)
  const isHoliday = timeOff?.some(off => off.off_date.split("T")[0] === dateString); // البحث فى قائمة الاجازات
  const isWorkDay = availability?.some(a => a.day_of_week === (dayOfWeek as DayOfWeek) && a.is_available); // بحث فى ايام عمل الدكتور

  return { isHoliday: !!isHoliday, isWorkDay: !!isWorkDay };
};

export const buildSlotsWithStatus = (
  dayConfig: DoctorAvailability,
  bookedAppointments: AppointmentData[],
  selectedDate: Date
) => {
  const { start_time, end_time, slot_duration } = dayConfig;
  const slots = [];
  const dateString = getLocalDateString(selectedDate);
  
  // 1.  استخراج دقائق المواعيد المحجوزة لهذا اليوم
  const bookedMinutesSet = new Set(
    bookedAppointments
      ?.filter(appointment => {
      const appDate = new Date(appointment.appointment_date);
      const appDateString = getLocalDateString(appDate); // ستنتج 2026-02-12
      
      const isSameDay = appDateString === dateString;
      const isNotCancelled = appointment.status !== 'cancelled';
      
      return isSameDay && isNotCancelled;
      }
       )
      .map(appointment => {
        const d = new Date(appointment.appointment_date);
        
        const timeLabel = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
          
        return timeLabel;
      })
  );

  
  // 2. توليد الساعات وفحص الحجز
  const [startHour, startMinutes] = start_time.split(":").map(Number);
  const [endHour, endMinute] = end_time.split(":").map(Number);
  let currentMinutes = startHour * 60 + startMinutes; // تحويل بداية الشغل لدقائق (مثلاً 10 صباحاً = 600 دقيقة)
  const endMinutes = endHour * 60 + endMinute; // تحويل نهاية الشغل لدقائق

  while (currentMinutes < endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    const timeLabel = new Date(0, 0, 0, h, m).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    slots.push({
      time: timeLabel,
      isBooked: bookedMinutesSet.has(timeLabel)
    });

    currentMinutes += slot_duration;
  }
  
  return slots;
};