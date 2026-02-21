import { useState } from "react";
import { LoadingWrapper } from "../../components/ui/LoadingWrapper";
import { useAuth } from "../../hooks/useAuth";
import { type DayOfWeek, type DoctorAvailability } from "../../types/types";
import { useDoctorSchedule } from "../../hooks/useDoctorSchedule";
import { DAYS } from "../../utils/constants";
import { getLocalDateString } from "../../utils/appointmentLogic";
import Calendar from "react-calendar";
import { toast } from "sonner";

// عزلها خارج المكون لتقليل الرندر
const transformSchedule = (data: DoctorAvailability[] | undefined) => {
  if (!data) return {};
  return data.reduce<Record<number, Partial<DoctorAvailability>>>(
    (acc, curr) => ({ ...acc, [curr.day_of_week]: curr }),
    {},
  );
};

// جزء الجدول
const ScheduleForm = ({
  initialData,
  onSave,
  isSaving,
  userId,
}: {
  initialData?: DoctorAvailability[];
  onSave: (data: DoctorAvailability[]) => void;
  isSaving: boolean;
  userId?: string;
}) => {
  // الـ State تأخذ قيمتها الابتدائية فقط عند أول رندر للمكون
  const [localSchedule, setLocalSchedule] = useState(() =>
    transformSchedule(initialData),
  );

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
          ...currentDayData,
          doctor_id: userId,
          day_of_week: day,
          [field]: value,
        },
      };
    });
  };
  const onInternalSave = () => {
    if (!userId) return;
    const payload = Object.entries(localSchedule).map(([dayId, item]) => ({
      ...(item.id && { id: item.id }),
      doctor_id: userId,
      day_of_week: parseInt(dayId) as DayOfWeek,
      start_time: item.start_time || "10:00",
      end_time: item.end_time || "17:00",
      slot_duration: item.slot_duration || 30,
      is_available: item.is_available ?? false,
    }));

    const hasAvailability = payload.some((day) => day.is_available);
    if (!hasAvailability) {
      if (!confirm("You haven't selected any available days. Continue?"))
        return;
    }
    onSave(payload as DoctorAvailability[]);
  };
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          My Weekly Availability
        </h2>
        {isSaving && (
          <span className="text-sm text-indigo-600 animate-pulse">
            Saving...
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="hidden md:grid grid-cols-5 gap-4 font-bold text-gray-600 border-b pb-2 text-center">
          <span className="text-left">Day</span>
          <span>Available</span>
          <span>From</span>
          <span>To</span>
          <span>Duration</span>
        </div>

        {DAYS.map((day) => {
          const dayData = localSchedule[day.id] || {};
          const isAvailable = dayData.is_available || false;

          return (
            <div
              key={day.id}
              className={`grid grid-cols-2 md:grid-cols-5 gap-4 items-center py-4 border-b last:border-0 ${!isAvailable ? "bg-gray-50/50" : ""}`}
            >
              <span className="font-semibold text-gray-700">{day.name}</span>
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  className="w-6 h-6 accent-primary cursor-pointer"
                  checked={isAvailable}
                  onChange={(e) =>
                    handleInputChange(day.id, "is_available", e.target.checked)
                  }
                />
              </div>
              <input
                type="time"
                disabled={!isAvailable}
                value={dayData.start_time || "10:00"}
                onChange={(e) =>
                  handleInputChange(day.id, "start_time", e.target.value)
                }
                className="border rounded-md p-2 disabled:bg-gray-100 focus:ring-2 focus:ring-primary outline-none"
              />
              <input
                type="time"
                disabled={!isAvailable}
                value={dayData.end_time || "17:00"}
                onChange={(e) =>
                  handleInputChange(day.id, "end_time", e.target.value)
                }
                className="border rounded-md p-2 disabled:bg-gray-100 focus:ring-2 focus:ring-primary outline-none"
              />
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
                className="border rounded-md p-2 disabled:bg-gray-100 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
          );
        })}
      </div>

      <button
        onClick={onInternalSave}
        disabled={isSaving}
        className={`mt-8 w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isSaving ? "bg-gray-400" : "bg-primary hover:scale-[1.02] cursor-pointer"}`}
      >
        {isSaving ? "Updating Schedule..." : "Save Weekly Schedule"}
      </button>
    </div>
  );
};
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
        toast.error("هذا اليوم مسجل كإجازة بالفعل");
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
      {/* استخدام key هنا هو الحل السحري لمشكلة الـ useEffect */}
      <LoadingWrapper isLoading={isLoading}>
        <ScheduleForm
          key={scheduleData ? "data-loaded" : "still-loading"}
          initialData={scheduleData}
          onSave={saveSchedule}
          isSaving={isSaving}
          userId={user?.id}
        />
      </LoadingWrapper>

      {/* القسم الثاني: إجازات الدكتور (Time Off) */}
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Manage Time Off
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <Calendar
              onChange={handleDateChange}
              tileClassName={tileClassName}
              minDate={new Date()}
              className="rounded-lg border-gray-200 shadow-sm"
            />
          </div>
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
                      className="text-red-400 hover:text-red-600 font-bold cursor-pointer"
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
