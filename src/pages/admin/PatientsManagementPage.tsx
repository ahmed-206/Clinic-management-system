import { useState, useMemo } from "react";
import { SearchBar } from "../../components/ui/SearchBar";
import { useAdminPatients } from "../../hooks/admin/useAdminPatients";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import {LoadingWrapper } from "../../components/ui/LoadingWrapper";

export const PatientsManagementPage = () => {
  const { patientsQuery, toggleStatusMutation } = useAdminPatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");


  const filteredPatients = useMemo(() => {
    let result = patientsQuery.data || [];

    // 1. فلترة بالاسم أو الإيميل
    if (searchTerm) {
      result = result.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. فلترة بالحالة (Active / Banned)
    if (statusFilter !== "all") {
      const isActiveNeeded = statusFilter === "active";
      result = result.filter(p => p.is_active === isActiveNeeded);
    }

    return result;
  }, [searchTerm, statusFilter, patientsQuery.data]);

  if (patientsQuery.isLoading) return  <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#333]">Patients Management</h1>
        <span className="bg-primary text-white px-4 py-1 rounded-xl text-sm">
          Total: {filteredPatients.length}
        </span>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showSpecialtyFilter={false}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        showStatusFilter={true}
      />


      <LoadingWrapper isLoading={toggleStatusMutation.isPending}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr  className="bg-primary border-b border-gray-100 text-white">
              <th className="p-4 font-semibold">Patient Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Joined Date</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="shadow-sm"
              >
                <td className="p-4 font-medium text-gray-700">
                  {patient.name}
                </td>
                <td className="p-4 text-gray-600">{patient.email}</td>
                <td className="p-4">
                  {/* عرض حالة المريض بشكل بصري */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      patient.is_active
                        ? " text-primary"
                        : " text-red-600"
                    }`}
                  >
                    {patient.is_active ? "Active" : "Banned"}
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  {new Date(patient.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
      <button 
        onClick={() => toggleStatusMutation.mutate({ 
          id: patient.id, 
          currentStatus: patient.is_active 
        })}
        disabled={toggleStatusMutation.isPending}
        className={`text-sm font-semibold transition cursor-pointer ${
          patient.is_active 
          ? 'text-red-500 hover:text-red-700' 
          : 'text-primary'
        }`}
      >
        {toggleStatusMutation.isPending ? 'Processing...' : (patient.is_active ? 'Block' : 'Unblock')}
      </button>
    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </LoadingWrapper>
    </div>
  );
};
