import { describe, it, expect } from "vitest";
import {
  getDayStatus,
  getLocalDateString,
  combineDateAndTime,
  buildSlotsWithStatus,
} from "./appointmentLogic";
import { toLocalISODate } from "./dateTimeFormate";
import type {
  TimeOff,
  DoctorAvailability,
  AppointmentData,
} from "../types/types";

describe("getDayStatus logic", () => {
  it("should return isHoliday: true when the date matches a doctor's time off", () => {
    const testDate = new Date("2026-02-23"); //اجازة
    const mockTimeOff: TimeOff[] = [
      { id: "1", doctor_id: "d1", off_date: "2026-02-23" },
    ];
    const mockAvailability: DoctorAvailability[] = [];
    const result = getDayStatus(testDate, mockTimeOff, mockAvailability);
    expect(result.isHoliday).toBe(true);
  });
  it("should return isWorkDay: true when the date is within doctor's working schedule", () => {
    const testDate = new Date("2026-02-23"); // يوم عمل
    const mockTimeOff: TimeOff[] = [];
    const mockAvailability: DoctorAvailability[] = [
      {
        id: "1",
        doctor_id: "d1",
        day_of_week: 1,
        is_available: true,
        start_time: "10:00",
        end_time: "14:00",
        slot_duration: 30,
      },
    ];
    const result = getDayStatus(testDate, mockTimeOff, mockAvailability);
    expect(result.isWorkDay).toBe(true);
  });
});

describe("getLocalDateString", () => {
  it("should format date as YYYY-MM-DD with leading zeros for months and days", () => {
    const testDate = new Date("2026-02-03");
    const result = getLocalDateString(testDate);
    expect(result).toBe("2026-02-03");
  });
  it("should handle months and days greater than 10 correctly", () => {
    const testDate = new Date("2026-12-25");
    const result = getLocalDateString(testDate);
    expect(result).toBe("2026-12-25");
  });
});

describe("combineDateAndTime", () => {
  it("should properly merge a date object with a 12-hour format time string (PM case)", () => {
    const baseDate = new Date("2026-02-03");
    const result = combineDateAndTime(baseDate, "10:30 PM");
    expect(result.getHours()).toBe(22);
    expect(result.getMinutes()).toBe(30);
  });
  it("should properly merge a date object with a 12-hour format time string (AM case)", () => {
    const baseDate = new Date("2026-02-03");
    const result = combineDateAndTime(baseDate, "09:15 AM");
    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(15);
  });
});

describe("buildSlotsWithStatus", () => {
  it("should generate the correct number of slots based on duration", () => {
    const mockDayConfg = {
      id: "1",
      doctor_id: "d1",
      day_of_week: 1,
      is_available: true,
      start_time: "10:00",
      end_time: "11:00",
      slot_duration: 30,
    };
    const mockAppointments: AppointmentData[] = [];
    const testDate = new Date("2026-02-03");
    const result = buildSlotsWithStatus(
      mockDayConfg as DoctorAvailability,
      mockAppointments,
      testDate,
    );

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({ time: "10:00 AM", isBooked: false });
    expect(result[1]).toEqual({ time: "10:30 AM", isBooked: false });
  });

  it("should mark a slot as isBooked: true if a matching confirmed appointment exists", () => {
    const mockDayConfg = {
      start_time: "10:00",
      end_time: "10:30",
      slot_duration: 30,
    } as DoctorAvailability;
    const mockAppointments = [
      {
        id: "app1",
        appointment_date: "2026-02-03T10:00:00",
        status: "confirmed",
      },
    ] as AppointmentData[];
    const testDate = new Date("2026-02-03");
    const result = buildSlotsWithStatus(
      mockDayConfg,
      mockAppointments,
      testDate,
    );
    expect(result[0]).toEqual({ 
        time: "10:00 AM", 
        isBooked: true 
    });
  });

  it("should keep slot as isBooked: false if the matching appointment is cancelled", () => {
    const mockDayConfg = {
      start_time: "10:00",
      end_time: "10:30",
      slot_duration: 30,
    } as DoctorAvailability;
    const mockAppointments = [
      {
        id: "app1",
        appointment_date: "2026-02-03T10:00:00",
        status: "cancelled",
      },
    ] as AppointmentData[];
    const testDate = new Date("2026-02-03");
    const result = buildSlotsWithStatus(mockDayConfg, mockAppointments, testDate);

    expect(result[0].isBooked).toBe(false); // المفروض يرجع متاح تاني
});
});

// ============================================================
// New tests for timezone / DST fixes
// ============================================================

describe("toLocalISODate", () => {
  it("should return the LOCAL date, not the UTC date, for a UTC timestamp", () => {
    // Simulate a timestamp that is 2026-04-10T23:30:00Z (UTC)
    // In UTC+2 that is 2026-04-11T01:30:00 local => local date is 2026-04-11
    // toISOString().split('T')[0] would wrongly return '2026-04-10'
    const utcDate = new Date("2026-04-10T23:30:00Z");
    const result = toLocalISODate(utcDate);
    // The expected value depends on the test runner's timezone.
    // We just verify it matches what the Date object considers the local date.
    const expected = `${utcDate.getFullYear()}-${String(utcDate.getMonth() + 1).padStart(2, "0")}-${String(utcDate.getDate()).padStart(2, "0")}`;
    expect(result).toBe(expected);
  });

  it("should accept a string and return a YYYY-MM-DD string", () => {
    const result = toLocalISODate("2026-06-15T08:00:00Z");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getDayStatus — DST / timezone edge cases", () => {
  it("should correctly identify a holiday when off_date has a timezone offset", () => {
    // off_date stored as ISO with offset (e.g. midnight UTC+2)
    const testDate = new Date("2026-10-25"); // local date
    const mockTimeOff: TimeOff[] = [
      // This is midnight local time stored with UTC offset
      { id: "1", doctor_id: "d1", off_date: "2026-10-25T00:00:00+02:00" },
    ];
    const result = getDayStatus(testDate, mockTimeOff, []);
    // toLocalISODate on both sides should match correctly
    expect(result.isHoliday).toBe(true);
  });

  it("should NOT incorrectly mark adjacent day as holiday due to UTC conversion", () => {
    // Build a timestamp that is exactly midnight local time today
    // and verify its local date string matches today's date.
    const now = new Date();
    // Create a Date for the start of today in local time
    const localMidnightToday = new Date(
      now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0
    );
    const expectedLocalDate = toLocalISODate(localMidnightToday);

    const mockTimeOff: TimeOff[] = [
      { id: "1", doctor_id: "d1", off_date: localMidnightToday.toISOString() },
    ];

    const result = getDayStatus(localMidnightToday, mockTimeOff, []);
    // toLocalISODate must agree on both sides — no off-by-one day
    expect(result.isHoliday).toBe(true);
    expect(toLocalISODate(localMidnightToday)).toBe(expectedLocalDate);
  });
});

describe("buildSlotsWithStatus — timezone-aware booking detection", () => {
  it("should have consistent slot label and booked flag (no DST key mismatch)", () => {
    // This test verifies that the slot generator and the booked-key extractor
    // both use the same timeZone, so a booked appointment always matches its slot.
    // We build the appointment datetime from the selected date so it is always
    // locally correct regardless of what timezone the test runner is in.
    const testDate = new Date("2026-06-15");
    // 09:00 local time on testDate
    const localAppDate = new Date(testDate);
    localAppDate.setHours(9, 0, 0, 0);

    const mockDayConfig = {
      start_time: "09:00",
      end_time: "09:30",
      slot_duration: 30,
    } as DoctorAvailability;

    const mockAppointments = [
      {
        id: "app1",
        appointment_date: localAppDate.toISOString(), // store as UTC
        status: "confirmed",
      },
    ] as AppointmentData[];

    const result = buildSlotsWithStatus(mockDayConfig, mockAppointments, testDate);

    expect(result.length).toBe(1);
    // The slot at 09:00 local must be detected as booked
    expect(result[0].isBooked).toBe(true);
  });
});
