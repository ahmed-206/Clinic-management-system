import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { type LoginFormData, loginSchema } from "../../validation/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export const LoginForm = () => {
  const { login, user, profile } = useAuth();
  const navigate = useNavigate();
useEffect(() => {
  // بمجرد أن يكتمل الـ profile، قم بالتوجيه فوراً
  if (user && profile) {
    if (profile.role === 'doctor') {
      navigate('/doctor');
    } else if (profile.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
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
  const divStyle = "flex flex-col gap-2 items-start";
  const lableStyle = "text-lg font-medium text-gray-700";
  const inputSyle =
    "w-full h-12 rounded-xl border border-gray-400 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all";
  return (
    <div className="min-h-screen bg-backG flex  justify-center font-sans p-4">
      <div className="w-full max-w-120 bg-white rounded-lg p-8 md:p-12 shadow-sm">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-10">
          ClinciSystem
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className={divStyle}>
            <label className={lableStyle} htmlFor="email">
              Email
            </label>
            <input
              className={inputSyle}
              type="text"
              id="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className={divStyle}>
            <label className={lableStyle} htmlFor="password">
              Password
            </label>
            <input
              className={inputSyle}
              type="password"
              id="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <input
              className="w-5 h-5 rounded border-gray-400 accent-primary cursor-pointer"
              type="checkbox"
              id="check"
            />
            <label
              className="text-sm font-medium text-gray-700 cursor-pointer"
              htmlFor="check"
            >
              Remember me
            </label>
          </div>
          <button className="w-full md:w-1/2 mx-auto mt-6 h-14 bg-primary text-white rounded-xl font-bold text-lg  transition-colors shadow-md cursor-pointer">
            Login
          </button>
          <div className="text-center mt-4 text-gray-700 font-medium">
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
  );
};
