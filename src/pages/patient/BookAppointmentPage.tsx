import { DoctorCard } from "../../features/patient/DoctorCard";
import { useDoctors } from "../../hooks/useDoctors";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useState, useMemo } from "react";
import { useDashboardT,useCommonT } from "../../hooks/useT";
import { SearchInput } from "../../components/ui/searchBar/index";

export const BookAppointmentPage = () => {
   const td = useDashboardT();
   const tc = useCommonT();
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
    return <div className="text-red-500"> {tc('error')}: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in px-4 py-6 md:px-0">
      {/* العنوان وشريط البحث العلوي */}
      <div className="mb-8 md:mb-10 text-center md:text-start">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">{td('dashboard.patient.bookAppointment')}</h2>
        <p className="text-secondary font-medium text-sm md:text-base">{td('dashboard.patient.bookSubTitle')}</p>
      </div>

      <div className="mb-8">
       <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>

{/* نظام الـ Tabs للتخصصات */}
      <div className="mb-8 md:mb-12">
        <div className="flex flex-wrap gap-2 md:gap-3 pb-2">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                selectedSpecialty === spec
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "bg-white text-secondary border border-secondary/20 hover:border-primary hover:text-primary"
              }`}
            >
              {spec === "All" ? td('dashboard.patient.allSpecialties') : spec}
            </button>
          ))}
        </div>
      </div>
  
      <div className="mb-6 md:mb-8">
        <p className="mt-4 text-secondary/80 font-semibold text-lg ">
          {td('dashboard.patient.findDoctors')}
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
          <p className="text-gray-500 font-bold">{td('dashboard.patient.noDoctorsFound')}</p>
          <button 
            onClick={() => {setSearchTerm(""); setSelectedSpecialty("All");}}
            className="mt-4 text-primary font-bold hover:underline"
          >
            {td('dashboard.patient.showAllDoctors')}
          </button>
        </div>
      )}
    </div>
  );
};
