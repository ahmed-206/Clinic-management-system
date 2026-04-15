import { useState } from "react";
import { LoadingWrapper } from "../../components/ui/LoadingWrapper";
import { useAuth } from "../../hooks/useAuth";
import { type DayOfWeek, type DoctorAvailability } from "../../types/types";
import { useDoctorSchedule } from "../../hooks/useDoctorSchedule";
import { DAYS } from "../../utils/constants";
import { getLocalDateString } from "../../utils/appointmentLogic";
import Calendar from "react-calendar";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";

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
    <div className="p-6 md:p-8 bg-white rounded-2xl shadow-md max-w-5xl mx-auto border border-gray-100">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
      <h2 className="text-2xl md:text-3xl font-bold text-primary">
        Weekly Availability
      </h2>
      <p className="text-secondary text-sm mt-1">
        Set your working hours and session durations
      </p>
    </div>
       {isSaving && (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
        <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
        <span className="text-xs font-medium text-primary">
          Saving changes...
        </span>
      </div>
    )}
      </div>

      <div className="space-y-4">
        <div className="hidden md:grid grid-cols-5 gap-4 text-sm font-semibold text-secondary border-b pb-3 px-2">
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
               className={`grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 items-center rounded-2xl bg-primary-100 hover:scale-102 shadow-md py-4 px-2 transition-all ${
            !isAvailable ? "opacity-60" : ""
          }`}
            >
              <span className="font-bold md:font-medium text-secondary">{day.name}</span>
              <div className="flex justify-end md:justify-start">
                <input
              type="checkbox"
              className="w-6 h-6 md:w-5 md:h-5 accent-primary cursor-pointer transition-all"
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
            className="w-full border border-primary-200 bg-white text-primary rounded-lg px-2 py-2 text-sm 
            focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none
            disabled:bg-gray-50 disabled:text-gray-400 transition-all"
          />
              {/* End Time */}
          <input
            type="time"
            disabled={!isAvailable}
            value={dayData.end_time || "17:00"}
            onChange={(e) =>
              handleInputChange(day.id, "end_time", e.target.value)
            }
            className="w-full border border-primary-200 bg-white text-primary rounded-lg px-2 py-2 text-sm 
            focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none
            disabled:bg-gray-50 disabled:text-secondary/50 transition-all"
          />
             {/* Duration */}
          <select
            disabled={!isAvailable}
            value={dayData.slot_duration ?? 30}
            onChange={(e) =>
              handleInputChange(day.id, "slot_duration", parseInt(e.target.value))
            }
            className="w-full col-span-2 md:col-span-1 border border-primary-200 bg-white text-primary rounded-lg px-2 py-2 text-sm 
            focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none
            disabled:bg-gray-50 disabled:text-gray-400 transition-all"
          >
            <option value={15}>15 min</option>
            <option value={20}>20 min</option>
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
          </select>
            </div>
          );
        })}
      </div>

      <Button
        onClick={onInternalSave}
        disabled={isSaving}
        className={`mt-8 w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isSaving ? "bg-gray-400" : "bg-primary hover:scale-[1.02] cursor-pointer"}`}
      >
        {isSaving ? "Updating Schedule..." : "Save Weekly Schedule"}
      </Button>
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
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
       <div className="mb-8">
    <h2 className="text-2xl font-bold text-primary tracking-tight">
      Manage Time Off
    </h2>
    <p className="text-secondary text-sm mt-1">Select dates from the calendar to mark your holidays</p>
  </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <Calendar
              onChange={handleDateChange}
              tileClassName={tileClassName}
              minDate={new Date()}
              className="custom-calendar shadow-xl"
            />
          </div>
          <div className="shadow-xl rounded-[20px] p-3">
            <div className="flex items-center justify-between mb-4 px-1 ">
        <h3 className="font-bold text-secondary flex items-center gap-2">
          Selected Holidays
          <span className="bg-primary text-white text-xs py-0.5 px-2 rounded-xl">
            {timeOffData?.length || 0}
          </span>
        </h3>
      </div>
            <LoadingWrapper isLoading={isTimeOffLoading}>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar ">
          {timeOffData?.map((off) => (
            <div
              key={off.id}
              className="group flex justify-between items-center p-4 bg-white border border-primary-100 rounded-2xl transition-all duration-300 hover:border-red-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full group-hover:animate-pulse" />
                <span className="text-secondary font-semibold tracking-wide">
                  {new Date(off.off_date).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  })}
                </span>
              </div>
              <button
                onClick={() => removeTimeOff(off.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white cursor-pointer"
                title="Remove"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
          ))}

          {timeOffData?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm italic">No holidays selected yet.</p>
            </div>
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
