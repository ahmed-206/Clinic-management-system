import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { type LoginFormData, loginSchema } from "../../validation/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "../../components/ui/Button";

export const LoginForm = () => {
  const { login, user, profile } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    // بمجرد أن يكتمل الـ profile، قم بالتوجيه فوراً
    if (user && profile) {
      if (profile.role === "doctor") {
        navigate("/doctor");
      } else if (profile.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [profile, user, navigate]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
    // navigate("/dashboard");
  };

  const inputStyle =
    "w-full h-11 rounded-xl border border-secondary/30 bg-white/5 px-4 text-secondary text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200";

  const labelStyle =
    "text-xs font-medium text-secondary uppercase tracking-widest";
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 py-20">
      <div className="relative w-full max-w-sm">
        <div className="bg-white/4 border border-white/8 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-primary tracking-widest mb-2">
              Welcome Back
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <label className={labelStyle} htmlFor="email">
                Email
              </label>
              <input
                className={inputStyle}
                type="text"
                id="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelStyle} htmlFor="password">
                Password
              </label>
              <input
                className={inputStyle}
                type="password"
                id="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <input
                className="w-4 h-4 rounded border-secondary accent-primary cursor-pointer"
                type="checkbox"
                id="check"
              />
              <label
                className="text-sm font-medium text-secondary cursor-pointer"
                htmlFor="check"
              >
                Remember me
              </label>
            </div>
            <Button>Login</Button>
            <div className="text-center mt-4 text-secondary font-medium">
              You don't have an account?
              <Link
                to="/signup"
                className="underline cursor-pointer hover:text-primary"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
