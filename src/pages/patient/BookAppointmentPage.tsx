// src/pages/Patient/components/BookAppointment.tsx
import { DoctorCard } from "../../features/patient/DoctorCard";
import { useDoctors } from "../../hooks/useDoctors";
export const BookAppointmentPage = () => {
  const { data: doctors, isLoading, isError, error } = useDoctors();
  // بيانات تجريبية لمحاكاة الصورة

  if (isLoading)
    return <div className="p-10 text-center">جاري تحميل قائمة الأطباء...</div>;
  if (isError)
    return <div className="text-red-500">حدث خطأ: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* العنوان وشريط البحث العلوي */}
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Doctors List</h2>
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search Doctor"
            className="w-full px-6 py-2 border border-gray-400 rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-[#8B7E7E]"
          />
        </div>
      </div>

      {/* الفلتر أو شريط بحث إضافي (كما في الصورة) */}
      <div className="mb-12">
        <p className="mt-4 text-gray-800 font-semibold text-lg italic">
          Find Your Doctors
        </p>
      </div>

      {/* شبكة الأطباء - Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {doctors?.map((doc) => (
          <DoctorCard
            id={doc.id}
            key={doc.id}
            name={doc.name}
            specialty={doc.specialty || "General"}
            price_per_session={doc.price_per_session}
          />
        ))}
        {doctors?.length === 0 && (
          <p className="text-gray-500">لا يوجد أطباء متاحون حالياً.</p>
        )}
      </div>
    </div>
  );
};
