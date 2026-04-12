import type { TimeOff, DoctorAvailability, DayOfWeek, AppointmentData } from "../types/types";
import { toLocalISODate } from "./dateTimeFormate";

/**
 * The IANA timezone we normalise all slot-time comparisons to.
 * Using Intl.DateTimeFormat().resolvedOptions().timeZone means we always
 * use the browser's own local timezone — so the slot generator and the
 * booked-appointment key extractor always agree, even on DST transition days.
 */
const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
// DST fix: use toLocalISODate for time-off comparison so that a DB timestamp
// stored as e.g. "2026-10-25T00:00:00+02:00" doesn't flip to the wrong day
// when the browser parses it as UTC.
export const getDayStatus = (date: Date, timeOff: TimeOff[], availability: DoctorAvailability[]) => {
  const dateString = toLocalISODate(date); // local YYYY-MM-DD
  const dayOfWeek = date.getDay();
  // Compare both sides as local dates — handles DST transition midnight edge
  const isHoliday = timeOff?.some(
    (off) => toLocalISODate(off.off_date) === dateString,
  );
  const isWorkDay = availability?.some(a => a.day_of_week === (dayOfWeek as DayOfWeek) && a.is_available);

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
  
  // 1. استخراج دقائق المواعيد المحجوزة لهذا اليوم
  // DST-safe fix: use an explicit timeZone in toLocaleTimeString on BOTH sides
  // (key extraction here AND slot generation below) so the labels always match
  // even when the browser's DST state changes during a session (e.g. 2AM→3AM).
  const bookedMinutesSet = new Set(
    bookedAppointments
      ?.filter(appointment => {
        const appDate = new Date(appointment.appointment_date);
        const appDateString = toLocalISODate(appDate);

        const isSameDay = appDateString === dateString;
        const isNotCancelled = appointment.status !== 'cancelled';

        return isSameDay && isNotCancelled;
      })
      .map(appointment => {
        const d = new Date(appointment.appointment_date);

        // Use LOCAL_TZ so this label always matches the slot generator below
        const timeLabel = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: LOCAL_TZ,
        });

        return timeLabel;
      })
  );

  
  // 2. توليد الساعات وفحص الحجز
  const [startHour, startMinutes] = start_time.split(":").map(Number);
  const [endHour, endMinute] = end_time.split(":").map(Number);
  let currentMinutes = startHour * 60 + startMinutes;
  const endMinutes = endHour * 60 + endMinute;

  while (currentMinutes < endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    // Build a fixed-date reference time and format with the same LOCAL_TZ
    // so this label always matches the booked-key extractor above — DST-safe.
    const refDate = new Date(selectedDate);
    refDate.setHours(h, m, 0, 0);
    const timeLabel = refDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: LOCAL_TZ,
    });

    slots.push({
      time: timeLabel,
      isBooked: bookedMinutesSet.has(timeLabel)
    });

    currentMinutes += slot_duration;
  }
  
  return slots;
};