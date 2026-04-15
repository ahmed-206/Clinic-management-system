import { useAdminDoctors } from "../../hooks/admin/useAdminDoctors";
import { SearchBar } from "../../components/ui/SearchBar";
import { EditDoctorModal } from "../../features/admin/EditDoctorModal";
import {AddDoctorModal} from "../../features/admin/AddDoctorModal"
import { LuPencil, LuUserRoundCheck, LuUserRoundX, LuBadgeCheck  } from 'react-icons/lu';
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import {LoadingWrapper } from "../../components/ui/LoadingWrapper";
import { Button } from "../../components/ui/Button";
import {type UserProfile } from "../../types/types";
import { useState } from "react";


export const DoctorsMangementPage = () => {
  const { doctors, allSpecialties, isLoading, searchProps, actions } =
    useAdminDoctors();
    const [selectedDoctor, setSelectedDoctor] = useState<UserProfile | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
       <h1 className="text-xl md:text-2xl font-bold text-primary">Doctors Management</h1>
       <Button 
         onClick={() => setIsAddModalOpen(true)}
         
       >
         + Add New Doctor
       </Button>
    </div>
      
      <SearchBar
        searchTerm={searchProps.searchTerm}
        onSearchChange={searchProps.setSearchTerm}
        selectedSpecialty={searchProps.specialtyFilter}
        onSpecialtyChange={searchProps.setSpecialtyFilter}
        specialties={allSpecialties}
      />
      <LoadingWrapper isLoading={actions.isUpdating || actions.isToggling}>
      <div className="bg-white rounded-2xl shadow-sm  overflow-hidden">
      <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
          <thead className="bg-primary text-white text-xs md:text-sm">
            <tr >
              <th className="p-4">Doctor</th>
              <th className="p-4">Specialty</th>
              <th className="p-4">Status</th>
              <th className="p-4">Verified</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id} className="shadow-sm">
               <td className="p-4">
                <div className="font-bold text-secondary">{doc.name}</div>
                <div className="text-xs text-secondary">{doc.email}</div>
              </td>
              <td className="p-4 text-secondary/90">{doc.specialty || 'N/A'}</td>
              <td className="p-4">
                {doc.is_active ? 
                  <span className="text-green-500 flex items-center gap-1"><LuUserRoundCheck /> Active</span> : 
                  <span className="text-red-500 flex items-center gap-1"><LuUserRoundX  /> Inactive</span>
                }
              </td>
              <td className="p-4 text-center">
                <button onClick={() => actions.toggleVerify(doc.id, !!doc.is_verified)}>
                  <LuBadgeCheck className={doc.is_verified ? "text-blue-500" : "text-secondary/70"} size={20} />
                </button>
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-3">
                  <button onClick={() => setSelectedDoctor(doc)} className="bg-tertiary-100 p-2 rounded-[4px] text-white"><LuPencil size={14} /></button>
                  {selectedDoctor && (
        <EditDoctorModal 
          key={selectedDoctor.id}
          doctor={selectedDoctor}
          isOpen={!!selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSave={(id, data) => {
             actions.updateDoctor(id, data);
             setSelectedDoctor(null); // إغلاق بعد النجاح
          }}
          isUpdating={actions.isUpdating} // تأكد من إضافة isUpdating للهوك
        />
      )}
                  <button 
                    onClick={() => actions.toggleStatus(doc.id, !!doc.is_active)}
                    className={doc.is_active ? "text-orange-400 hover:text-orange-600" : "text-green-500 hover:text-green-700"}
                  >
                    {doc.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      </LoadingWrapper>
      <AddDoctorModal 
      isOpen={isAddModalOpen}
      onClose={() => setIsAddModalOpen(false)}
      onAdd={(data) => {
        actions.createDoctor(data);
        setIsAddModalOpen(false);
      }}
      isPending={actions.isCreating}
    />
    </div>
  );
};
