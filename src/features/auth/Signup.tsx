import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { type SignupFormData, signupSchema } from "../../validation/authSchema"; 




export const SignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: SignupFormData) => {
   try {

    await signup(data.name, data.email, data.password);
    console.log("Success! Check your email for verification.");
    navigate('/dashboard')
  } catch (err: any) {
    
    console.error("Signup failed:", err.message);
    alert(err.message); 
  }
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
            <label className={lableStyle} htmlFor="name">
              Name
            </label>
            <input className={inputSyle} type="text" id="name" {...register("name")}/>
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className={divStyle}>
            <label className={lableStyle} htmlFor="email">
              Email
            </label>
            <input className={inputSyle} type="text" id="email" {...register("email")}/>
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
          <div className={divStyle}>
            <label className={lableStyle} htmlFor="password">
              Password
            </label>
            <input className={inputSyle} type="password" id="password" {...register("password")}/>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <input
              className="w-5 h-5 rounded border-gray-400 accent-primary cursor-pointer"
              type="checkbox"
              id="check"
              {...register("terms")}
            />
            <label
              className="text-sm font-medium text-gray-700 cursor-pointer"
              htmlFor="check"
            >
              I agree to the terms and conditions
            </label>
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}
          </div>
          <button className="w-full md:w-1/2 mx-auto mt-6 h-14 bg-primary text-white rounded-xl font-bold text-lg  transition-colors shadow-md cursor-pointer">
            Sign up
          </button>
          <div className="text-center mt-4 text-gray-700 font-medium">
            Have an account?
            <Link
              to="/login"
              className="underline cursor-pointer hover:text-primary"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
