import { useState } from "react";
import supabase from "../../../../supabase";
import { toast } from "sonner";
import {
  LuLockKeyhole,
  
} from "react-icons/lu";
import { Button } from "../../../../components/ui/Button";
import { useDashboardT } from "../../../../hooks/useT";
export const SecuritySettings = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
const td = useDashboardT();

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      // 2. تحديث كلمة المرور في Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success(td('dashboard.admin.passwordSuccess'));
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* قسم تغيير كلمة المرور */}
      <section className="space-y-4">
        <h2 className="text-lg md:text-xl font-bold text-secondary flex items-center gap-2">
          <LuLockKeyhole className="text-primary" size="1.5rem"/>  {td('dashboard.admin.changePassword')}
        </h2>
        <div className="grid grid-cols-1 gap-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              {td('dashboard.admin.newPassword')}
            </label>
            <input
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary/80 mb-1">
              {td('dashboard.admin.confirmPassword')}
            </label>
            <input
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="••••••••"
            />
          </div>
          <Button
           className={`w-full md:w-fit ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-primary text-white hover:scale-105 active:scale-95 cursor-pointer'
            }`}
           disabled={loading}
            onClick={handleUpdatePassword}
          >
            {td('dashboard.admin.updatePassword')}
          </Button>
        </div>
      </section>

      <hr className="border-gray-100" />

      
    </div>
  );
};
