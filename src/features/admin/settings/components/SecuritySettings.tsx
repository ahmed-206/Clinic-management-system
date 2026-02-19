import { useState } from "react";
import supabase from "../../../../supabase";
import { toast } from "sonner";
import {
  LuLockKeyhole,
  LuClock3
} from "react-icons/lu";
export const SecuritySettings = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


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

      toast.success("Password updated successfully!");
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
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <LuLockKeyhole className="text-primary" size="1.5rem"/>  Change Password
        </h2>
        <div className="grid grid-cols-1 gap-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm New Password
            </label>
            <input
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
           className={`w-fit px-8 py-2.5 rounded-xl font-medium transition-all shadow-sm ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-primary text-white hover:scale-105 active:scale-95 cursor-pointer'
            }`}
           disabled={loading}
            onClick={handleUpdatePassword}
          >
            Update Password
          </button>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* قسم سجل النشاطات - يعطي انطباع احترافي جداً */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <LuClock3 /> Recent Login Activity
        </h2>
        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Device / Browser</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4 font-medium text-gray-700">
                  Chrome on Windows
                </td>
                <td className="px-4 py-4 text-gray-500">Cairo, Egypt</td>
                <td className="px-4 py-4 text-gray-400">Today, 10:24 AM</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-gray-700">
                  Safari on iPhone
                </td>
                <td className="px-4 py-4 text-gray-500">Giza, Egypt</td>
                <td className="px-4 py-4 text-gray-400">Yesterday, 08:15 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
