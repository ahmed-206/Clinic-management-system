import { describe, it, expect } from "vitest";
import {
  getDayStatus,
  getLocalDateString,
  combineDateAndTime,
  buildSlotsWithStatus,
} from "./appointmentLogic";
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
