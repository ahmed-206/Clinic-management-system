import { useState, useEffect } from "react";

import { LoadingWrapper } from "../../components/ui/LoadingWrapper";

import { useAuth } from "../../hooks/useAuth";

import { type DayOfWeek, type DoctorAvailability } from "../../types/types";

import { useDoctorSchedule } from "../../hooks/useDoctorSchedule";

import { DAYS } from "../../utils/constants";

import { getLocalDateString } from "../../utils/appointmentLogic";

import Calendar from "react-calendar";

const DoctorSchedulePage = () => {
  const { user } = useAuth();

  const {
    scheduleData,

    isLoading,

    isSaving,

    saveSchedule,

    addTimeOff,

    isTimeOffLoading,

    removeTimeOff,

    timeOffData,
  } = useDoctorSchedule(user?.id);

  const [localSchedule, setLocalSchedule] = useState<
    Record<number, Partial<DoctorAvailability>>
  >({});

  useEffect(() => {
    if (scheduleData) {
      const map = scheduleData.reduce<Record<number, DoctorAvailability>>(
        (acc, curr) => ({ ...acc, [curr.day_of_week]: curr }),

        {},
      );

      setLocalSchedule(map);
    }
  }, [scheduleData]);

  // دالة حفظ الجدول

  const handlSave = () => {
    if (!user?.id) return;

    // نحول الـ Record إلى مصفوفة ونقوم بتنظيف البيانات

    const payload: DoctorAvailability[] = Object.values(localSchedule).map(
      (item) => {
        // بناء كائن جديد يطابق نوع DoctorAvailability تماماً

        const scheduleItem: DoctorAvailability = {
          // نستخدم الـ id القادم من السيرفر إذا وجد، وإلا نتركه undefined (وليس null)

          // الـ Optional Chaining هنا يحمينا

          ...(item.id && { id: item.id }),

          doctor_id: user.id,

          day_of_week: item.day_of_week as DayOfWeek,

          start_time: item.start_time || "10:00",

          end_time: item.end_time || "17:00",

          slot_duration: item.slot_duration || 30,

          is_available: item.is_available ?? false,
        };

        return scheduleItem;
      },
    );

    // التأكد من وجود يوم واحد على الأقل متاح (منطق اختياري)

    const hasAvailability = payload.some((day) => day.is_available);

    if (!hasAvailability) {
      const confirmDisable = confirm(
        "You haven't selected any available days. This will hide your schedule from patients. Continue?",
      );

      if (!confirmDisable) return;
    }

    saveSchedule(payload);
  };

  // دالة تغير المواعيد

  const handleInputChange = (
    day: DayOfWeek,

    field: keyof DoctorAvailability,

    value: string | number | boolean,
  ) => {
    setLocalSchedule((prev) => {
      const currentDayData = prev[day] || {};

      return {
        ...prev,

        [day]: {
          doctor_id: user?.id,

          day_of_week: day,

          // قيم افتراضية تظهر فقط إذا لم تكن موجودة مسبقاً

          start_time: currentDayData.start_time || "10:00",

          end_time: currentDayData.end_time || "17:00",

          slot_duration: currentDayData.slot_duration || 30,

          ...currentDayData,

          [field]: value,
        },
      };
    });
  };

  const handleDateChange = (
    value: Date | null | [Date | null, Date | null],
  ) => {
    if (value instanceof Date) {
      const dateString = getLocalDateString(value);

      const isAlreadyOff = timeOffData?.some(
        (off) => off.off_date === dateString,
      );

      if (!isAlreadyOff) {
        addTimeOff({
          doctor_id: user?.id as string,

          off_date: dateString,
        });
      } else {
        alert("هذا اليوم مسجل كإجازة بالفعل");
      }
    }
  };

  const tileClassName = ({
    date,

    view,
  }: {
    date: Date;

    view: string;
  }): string | null => {
    if (view === "month") {
      const year = date.getFullYear();

      const month = String(date.getMonth() + 1).padStart(2, "0");

      const day = String(date.getDate()).padStart(2, "0");

      const dateString = `${year}-${month}-${day}`;

      if (timeOffData?.some((off) => off.off_date === dateString)) {
        return "holiday-tile";
      }
    }

    return null;
  };

  return (
    <div className="space-y-10">
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            My Weekly Availability
          </h2>

          {/* إشارة بصرية إذا كان هناك تحميل خلفي للبيانات */}

          {isSaving && (
            <span className="text-sm text-indigo-600 animate-pulse">
              Saving changes...
            </span>
          )}
        </div>

        <LoadingWrapper isLoading={isLoading}>
          <div className="space-y-4">
            {/* العناوين - جعلتها مخفية في الشاشات الصغيرة لتجربة مستخدم أفضل */}

            <div className="hidden md:grid grid-cols-5 gap-4 font-bold text-gray-600 border-b pb-2 text-center">
              <span className="text-left">Day</span>

              <span>Available</span>

              <span>From</span>

              <span>To</span>

              <span>Duration (min)</span>
            </div>

            {DAYS.map((day) => {
              // استخراج بيانات اليوم الحالي من المسودة المحلية لسهولة القراءة

              const dayData = localSchedule[day.id] || {};

              const isAvailable = dayData.is_available || false;

              return (
                <div
                  key={day.id}
                  className={`grid grid-cols-2 md:grid-cols-5 gap-4 items-center py-4 border-b last:border-0 transition-colors ${!isAvailable ? "bg-gray-50/50" : ""}`}
                >
                  <span className="font-semibold text-gray-700">
                    {day.name}
                  </span>

                  {/* Checkbox للتوافر */}

                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      className="w-6 h-6 accent-primary cursor-pointer"
                      checked={isAvailable}
                      onChange={(e) =>
                        handleInputChange(
                          day.id,

                          "is_available",

                          e.target.checked,
                        )
                      }
                    />
                  </div>

                  {/* وقت البداية */}

                  <div className="flex flex-col md:block">
                    <span className="text-xs text-gray-400 md:hidden">
                      From:
                    </span>

                    <input
                      type="time"
                      disabled={!isAvailable}
                      value={dayData.start_time || "10:00"}
                      onChange={(e) =>
                        handleInputChange(day.id, "start_time", e.target.value)
                      }
                      className="w-full border rounded-md p-2 disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  {/* وقت النهاية */}

                  <div className="flex flex-col md:block">
                    <span className="text-xs text-gray-400 md:hidden">To:</span>

                    <input
                      type="time"
                      disabled={!isAvailable}
                      value={dayData.end_time || "17:00"}
                      onChange={(e) =>
                        handleInputChange(day.id, "end_time", e.target.value)
                      }
                      className="w-full border rounded-md p-2 disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  {/* مدة الكشف */}

                  <div className="flex flex-col md:block">
                    <span className="text-xs text-gray-400 md:hidden">
                      Slot Duration:
                    </span>

                    <select
                      disabled={!isAvailable}
                      value={dayData.slot_duration || 30}
                      onChange={(e) =>
                        handleInputChange(
                          day.id,

                          "slot_duration",

                          parseInt(e.target.value),
                        )
                      }
                      className="w-full border rounded-md p-2 disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value={15}>15 min</option>

                      <option value={30}>30 min</option>

                      <option value={45}>45 min</option>

                      <option value={60}>1 hour</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handlSave} // الدالة التي تستدعي mutate من الـ Hook
            disabled={isSaving || isLoading}
            className={`mt-8 w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
              isSaving
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-primary hover:scale-105 hover:shadow-indigo-200 cursor-pointer"
            }`}
          >
            {isSaving ? (
              <div className="flex justify-center items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating Schedule...
              </div>
            ) : (
              "Save Weekly Schedule"
            )}
          </button>
        </LoadingWrapper>
      </div>

      {/* القسم الثاني: إجازات الدكتور (Time Off) */}

      <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Manage Time Off
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* التقويم */}

          <div className="flex justify-center">
            <Calendar
              onChange={handleDateChange}
              tileClassName={tileClassName}
              minDate={new Date()}
              className="rounded-lg border-gray-200 shadow-sm"
            />
          </div>

          {/* قائمة الإجازات */}

          <div>
            <h3 className="font-bold mb-4 text-gray-600">Selected Holidays</h3>

            <LoadingWrapper isLoading={isTimeOffLoading}>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {timeOffData?.map((off) => (
                  <div
                    key={off.id}
                    className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100"
                  >
                    <span className="text-red-700 font-medium">
                      {new Date(off.off_date).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => removeTimeOff(off.id)}
                      className="text-red-400 hover:text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {timeOffData?.length === 0 && (
                  <p className="text-gray-400 italic">No holidays selected.</p>
                )}
              </div>
            </LoadingWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedulePage;
