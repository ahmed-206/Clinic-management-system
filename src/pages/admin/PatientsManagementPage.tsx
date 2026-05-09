import { useState, useMemo } from "react";
import { useAdminPatients } from "../../hooks/admin/useAdminPatients";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { LoadingWrapper } from "../../components/ui/LoadingWrapper";
import { useDashboardT, useCommonT } from "../../hooks/useT";
import { SearchInput } from "../../components/ui/searchBar/index";
import { PatientFilters } from "../../components/ui/searchBar/index";

export const PatientsManagementPage = () => {
  const td = useDashboardT();
    const tc = useCommonT();
  const { patientsQuery, toggleStatusMutation } = useAdminPatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPatients = useMemo(() => {
    let result = patientsQuery.data || [];

    // 1. فلترة بالاسم أو الإيميل
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 2. فلترة بالحالة (Active / Banned)
    if (statusFilter !== "all") {
      const isActiveNeeded = statusFilter === "active";
      result = result.filter((p) => p.is_active === isActiveNeeded);
    }

    return result;
  }, [searchTerm, statusFilter, patientsQuery.data]);

  if (patientsQuery.isLoading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 text-center sm:text-left">
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          {td('dashboard.admin.patientsManagement')}
        </h1>
        <span className="bg-primary text-white px-4 py-1 rounded-xl text-xs md:text-sm">
          {td('dashboard.admin.totalPatients')}: {filteredPatients.length}
        </span>
      </div>
    <div className="flex flex-col md:flex-row gap-4 w-full mb-6">
  <SearchInput value={searchTerm} onChange={setSearchTerm} />
  <PatientFilters
    statusFilter={statusFilter}
    onStatusChange={setStatusFilter}
  />
</div>
     

      <LoadingWrapper isLoading={toggleStatusMutation.isPending}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start min-w-[700px]">
              <thead>
                <tr className="bg-primary border-b border-gray-100 text-white">
                  <th className="p-4 font-semibold text-start">{tc('patient')}</th>
                  <th className="p-4 font-semibold text-start">{tc('email')}</th>
                  <th className="p-4 font-semibold text-start">{tc('status')}</th>
                  <th className="p-4 font-semibold text-start">{tc('joinedDate')}</th>
                  <th className="p-4 font-semibold text-start">{tc('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="shadow-sm">
                    <td className="p-4 font-medium text-secondary/90">
                      {patient.name}
                    </td>
                    <td className="p-4 text-secondary/90">{patient.email}</td>
                    <td className="p-4">
                      {/* عرض حالة المريض بشكل بصري */}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          patient.is_active ? " text-primary" : " text-red-600"
                        }`}
                      >
                        {patient.is_active ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td className="p-4 text-secondary/90">
                      {new Date(patient.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: patient.id,
                            currentStatus: patient.is_active,
                          })
                        }
                        disabled={toggleStatusMutation.isPending}
                        className={`text-sm font-semibold transition cursor-pointer ${
                          patient.is_active
                            ? "text-red-500 hover:text-red-700"
                            : "text-primary"
                        }`}
                      >
                        {toggleStatusMutation.isPending
                          ? "Processing..."
                          : patient.is_active
                            ? "Block"
                            : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </LoadingWrapper>
    </div>
  );
};
