import { useAuth } from "../../hooks/useAuth"
import {useForm} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useEffect } from "react";
import { Button } from "../../components/ui/Button";



const profileSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون أكثر من 3 أحرف"),
  specialty: z.string().min(2, "التخصص مطلوب"),
  bio: z.string().max(500, "الوصف طويل جداً"),
  price_per_session: z.number().min(0, "السعر لا يمكن أن يكون سالباً"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const DoctorProfilePage = () => {
    const {profile} = useAuth();
    const {mutate : updateProfile, isPending} = useUpdateProfile();

    const { register, handleSubmit,reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver : zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      specialty: profile?.specialty || "",
      bio: profile?.bio || "",
      price_per_session: profile?.price_per_session || 0,
    },
  });

   useEffect(() => {
    if (profile) {
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
    <div className="flex min-h-[calc(100-64px)] bg-gray-50 rounded-xl ">
      {/* Left Side: Avatar & Basic Info */}
      <aside className="w-1/3 bg-white border-r border-secondary/30 flex flex-col items-center pt-16 px-6  rounded-l-xl">
        <div className="relative group">
          <div className="w-32 h-32 bg-neutral-200 shadow-xl rounded-full flex items-center justify-center font-bold text-4xl border-4 border-gray-50 text-primary">
             {profile?.name?.charAt(0).toUpperCase()}
          </div>
          {/* هنا يمكن إضافة زر لرفع الصورة مستقبلاً */}
        </div>
        <h2 className="mt-6 text-2xl font-bold text-secondary">{profile?.name}</h2>
        <p className="text-secondary/50 font-medium">{profile?.specialty}</p>
      </aside>

      {/* Right Side: Settings Form */}
      <main className="flex-1 p-12 bg-white rounded-xl">
        <form onSubmit={handleSubmit((data) => updateProfile(data))} className="max-w-xl space-y-6">
          <div className="grid grid-cols-1 gap-6">
            
            <FormField label="Full Name" error={errors.name?.message}>
              <input {...register("name")} className={inputStyle} />
            </FormField>

            <FormField label="Medical Specialty" error={errors.specialty?.message}>
              <input {...register("specialty")} className={inputStyle} />
            </FormField>

            <FormField label="Professional Bio" error={errors.bio?.message}>
              <textarea {...register("bio")} rows={4} className={`${inputStyle}resize-none`} />
            </FormField>

            <FormField label="Session Price (EGP)" error={errors.price_per_session?.message}>
              <input type="number" {...register("price_per_session", { valueAsNumber: true })} className={inputStyle} />
            </FormField>

          </div>

          <div className="flex justify-end pt-6">
            <Button
            variant="primary"
              type="submit"
              disabled={isPending}
              className="px-10 py-3 bg-primary font-bold transition-all cursor-pointer disabled:bg-secondary/50"
            >
              {isPending ? "Save..." : "Save"}
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
    <label className="text-xs font-medium text-secondary uppercase tracking-widest">{label}</label>
    {children}
    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
  </div>
);
