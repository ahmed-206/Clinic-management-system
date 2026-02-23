// src/pages/Patient/components/BookAppointment.tsx
import { DoctorCard } from "../../features/patient/DoctorCard";
import { useDoctors } from "../../hooks/useDoctors";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { SearchBar } from "../../components/ui/SearchBar";
import { useState, useMemo } from "react";
export const BookAppointmentPage = () => {
  const { data: doctors, isLoading, isError, error } = useDoctors();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");


  const specialties = useMemo(() => {
    if (!doctors) return ["All"];
    const uniqueSpecs = Array.from(
      new Set(doctors.map((doc) => doc.specialty?.trim()).filter(Boolean).map((spec) => spec.charAt(0).toUpperCase() + spec.slice(1).toLowerCase()))
    );
    return ["All", ...uniqueSpecs.sort()];
  }, [doctors]);

  // 3. منطق الفلترة (الاسم + التاب النشط)
  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];
    return doctors.filter((doc) => {
      const matchesName = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const docSpec = doc.specialty?.trim().charAt(0).toUpperCase() + doc.specialty?.trim().slice(1).toLowerCase();
    const matchesTab = selectedSpecialty === "All" || docSpec === selectedSpecialty;
      return matchesName && matchesTab;
    });
  }, [doctors, searchTerm, selectedSpecialty]);
  if (isLoading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-500 font-medium">Fetching our specialists...</p>
    </div>
  );
  if (isError)
    return <div className="text-red-500">حدث خطأ: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* العنوان وشريط البحث العلوي */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-black text-gray-800 mb-2">Book an Appointment</h2>
        <p className="text-gray-500 font-medium">Choose a specialty or search for your doctor.</p>
      </div>

      <div className="mb-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showSpecialtyFilter={false} // أغلقنا الدروب داون هنا
        />
      </div>

{/* نظام الـ Tabs للتخصصات */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 pb-4">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                selectedSpecialty === spec
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {spec === "All" ? "All Specialties" : spec}
            </button>
          ))}
        </div>
      </div>
      {/* الفلتر أو شريط بحث إضافي (كما في الصورة) */}
      <div className="mb-12">
        <p className="mt-4 text-gray-800 font-semibold text-lg italic">
          Find Your Doctors
        </p>
      </div>

     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredDoctors.map((doc) => (
          <DoctorCard
            id={doc.id}
            key={doc.id}
            name={doc.name}
            specialty={doc.specialty || "General"}
            price_per_session={doc.price_per_session}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mt-10">
          <p className="text-gray-500 font-bold">No doctors found in this category.</p>
          <button 
            onClick={() => {setSearchTerm(""); setSelectedSpecialty("All");}}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Show all doctors
          </button>
        </div>
      )}
    </div>
  );
};
