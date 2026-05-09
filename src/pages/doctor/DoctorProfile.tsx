import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useEffect } from "react";
import { useFormPersist } from "../../hooks/useFormPersist";
import { Button } from "../../components/ui/Button";
import { useDashboardT,useCommonT } from "../../hooks/useT";
import { SpecialtySelect } from "../../features/doctor/SpecialtySelect";

const profileSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون أكثر من 3 أحرف"),
  specialty: z.string().min(1, "التخصص مطلوب"),
  bio: z.string().max(500, "الوصف طويل جداً"),
  price_per_session: z.number().min(0, "السعر لا يمكن أن يكون سالباً"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const DoctorProfilePage = () => {
  const td = useDashboardT();
  const tc = useCommonT();
  const { profile } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      specialty: profile?.specialty || "",
      bio: profile?.bio || "",
      price_per_session: profile?.price_per_session || 0,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;
  const { clearPersistedForm } = useFormPersist("doctor_profile", form);

  useEffect(() => {
    const savedData = sessionStorage.getItem("doctor_profile");
    if (profile && !savedData) {
      reset({
        name: profile.name || "",
        specialty: profile.specialty || "",
        bio: profile.bio || "",
        price_per_session: profile.price_per_session || 0,
      });
    }
  }, [profile, reset]);
  const inputStyle =
    "w-full h-11 rounded-xl border border-secondary/30 bg-white/5 px-4 text-secondary text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200";
  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 rounded-xl ">
      {/* Left Side: Avatar & Basic Info */}
      <aside className="w-full lg:w-1/3 bg-white border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col items-center py-10 lg:pt-16 px-6  rounded-l-xl">
        <div className="relative group">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-200 shadow-xl rounded-full flex items-center justify-center font-bold text-3xl md:text-4x border-4 border-gray-50 text-primary">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          {/* هنا يمكن إضافة زر لرفع الصورة مستقبلاً */}
        </div>
        <h2 className="mt-6 text-xl md:text-2xl font-bold text-secondary">
          {profile?.name}
        </h2>
        <p className="text-secondary/50 font-medium">{profile?.specialty}</p>
      </aside>

      {/* Right Side: Settings Form */}
      <main className="flex-1 p-6 md:p-12 bg-white rounded-xl">
        <form
          onSubmit={handleSubmit((data) =>
            updateProfile(data, { onSuccess: clearPersistedForm }),
          )}
          className="max-w-xl space-y-6"
        >
          <div className="grid grid-cols-1 gap-5 md:gap-6">
            <FormField
              label={td("dashboard.doctor.profileFullName")}
              error={errors.name?.message}
            >
              <input {...register("name")} className={inputStyle} />
            </FormField>

            <FormField
              label={td("dashboard.doctor.medicalSpecialty")}
              error={errors.specialty?.message}
            >
              <SpecialtySelect
                value={form.watch("specialty")}
                onChange={(val) =>
                  form.setValue("specialty", val, { shouldValidate: true })
                }
                error={errors.specialty?.message}
              />
            </FormField>

            <FormField
              label={td("dashboard.doctor.professionalBio")}
              error={errors.bio?.message}
            >
              <textarea
                {...register("bio")}
                rows={4}
                className={`${inputStyle}resize-none`}
              />
            </FormField>

            <FormField
              label={td("dashboard.doctor.sessionPrice")}
              error={errors.price_per_session?.message}
            >
              <input
                type="number"
                {...register("price_per_session", { valueAsNumber: true })}
                className={inputStyle}
              />
            </FormField>
          </div>

          <div className="flex justify-center md:justify-end pt-6">
            <Button
              variant="primary"
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto px-10 py-3 disabled:bg-secondary/50"
            >
              {isPending ? td('dashboard.doctor.savingProfile') : tc('save')}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}
// مكون فرعي صغير (Sub-component) لتقليل تكرار الكود
const FormField = ({ label, error, children }: FormFieldProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-medium text-secondary uppercase tracking-widest">
      {label}
    </label>
    {children}
    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
  </div>
);
