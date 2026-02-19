import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorActions } from "../../api/admin/doctorActions";
import { useDoctorSearch } from "./useDoctorSearch";
import supabase from "../../supabase";
import type { UserProfile, DoctorCreateInput } from "../../types/types";

export const useAdminDoctors = () => {
  const queryClient = useQueryClient();

  // 1. جلب الدكاترة
  const {
    data: doctors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "doctor")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as unknown as UserProfile[];
    },
  });

  const updateDoctorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserProfile> }) =>
      doctorActions.updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
    },
  });

  // 2. استخدام هوك البحث (Logic داخلي)
  const searchLogic = useDoctorSearch(doctors);

  // 3. التفعيل والتعطيل
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      doctorActions.toggleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
    },
  });

  // 4. التوثيق
  const toggleVerifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      doctorActions.toggleVerification(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
    },
  });

  const createDoctorMutation = useMutation<
    { message: string; userId: string },
    Error,
    DoctorCreateInput
  >({
    mutationFn: (data) => doctorActions.createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
    },
  });

  return {
    // البيانات المفلترة
    doctors: searchLogic.filteredDoctors,
    allSpecialties: searchLogic.allSpecialties,
    isLoading,
    error,

    // دوال البحث
    searchProps: {
      searchTerm: searchLogic.searchTerm,
      setSearchTerm: searchLogic.setSearchTerm,
      specialtyFilter: searchLogic.specialtyFilter,
      setSpecialtyFilter: searchLogic.setSpecialtyFilter,
    },

    // العمليات
    actions: {
      // تحديث بيانات دكتور
      updateDoctor: (id: string, data: Partial<UserProfile>) =>
        updateDoctorMutation.mutate({ id, data }),
      toggleStatus: (id: string, status: boolean) =>
        toggleStatusMutation.mutate({ id, status }),
      toggleVerify: (id: string, status: boolean) =>
        toggleVerifyMutation.mutate({ id, status }),
      isToggling:
        toggleStatusMutation.isPending || toggleVerifyMutation.isPending,
      isUpdating: updateDoctorMutation.isPending,
      // اضافة دكتور جديد
      createDoctor: (data: DoctorCreateInput) =>
        createDoctorMutation.mutate(data),
      isCreating: createDoctorMutation.isPending,
      createError: createDoctorMutation.error,
    },
  };
};
