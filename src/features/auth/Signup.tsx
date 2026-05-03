import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { type SignupFormData, signupSchema } from "../../validation/authSchema"; 
import { Button } from "../../components/ui/Button";
import { toast } from "sonner";
import { useFormT } from "../../hooks/useT";
import type { FormKeys } from "../../i18n/types";




export const SignupForm = () => {
  const tf = useFormT();
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
    
    navigate('/dashboard')
  } catch (err) {
    
   const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("Signup failed:", errorMessage);
    toast.error(errorMessage);
  }
  };
  

const inputStyle =
    "w-full h-11 rounded-xl border border-secondary/30 bg-white/5 px-4 text-secondary text-sm placeholder:text-secondary/80 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200";

  const labelStyle = "text-md font-medium text-secondary tracking-widest";
 return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 py-20">
      
     

      <div className="relative w-full max-w-sm">
        
        {/* Card */}
        <div className="bg-white/4 border border-white/8 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_20px_rgba(0,0,0,0.4)]">

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-primary tracking-widest mb-2">
              {tf('register.title')}
            </h2>
            
            
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className={labelStyle} htmlFor="name">{tf('register.fullName')}</label>
              <input className={inputStyle} type="text" id="name" placeholder={tf('placeholders.fullName')} {...register("name")} />
              {errors.name && <p className="text-red-400 text-xs mt-0.5">{tf(errors.name.message as FormKeys)}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className={labelStyle} htmlFor="email">{tf('register.email')}</label>
              <input className={inputStyle} type="email" id="email" placeholder={tf('placeholders.email')} {...register("email")} />
              {errors.email && <p className="text-red-400 text-xs mt-0.5">{tf(errors.email.message as  FormKeys) }</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className={labelStyle} htmlFor="password">{tf('register.password')}</label>
              <input className={inputStyle} type="password" id="password" placeholder={tf('placeholders.password')} {...register("password")} />
              {errors.password && <p className="text-red-400 text-xs mt-0.5">{tf(errors.password.message as FormKeys) }</p>}
            </div>

            {/* Terms */}
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-3">
                <input
                  className="mt-0.5 w-4 h-4 rounded border-white/20 accent-primary cursor-pointer shrink-0"
                  type="checkbox"
                  id="check"
                  {...register("terms")}
                />
                <label className="text-sm text-secondary cursor-pointer leading-snug" htmlFor="check">
                  {tf('register.agreeCondition')}
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-xs mt-0.5">{tf(errors.terms.message as FormKeys)}</p>}
            </div>

            {/* Submit */}
            <Button className="w-full h-11 mt-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl shadow-[0_4px_16px_rgba(37,99,235,0.35)] transition-all duration-200">
              {tf('register.submit')}
            </Button>

            {/* Login link */}
            <p className="text-center text-sm text-secondary mt-1">
              {tf('register.haveAccount')}{" "}
              <Link to="/login" className="text-primary hover:text-primary/50 font-medium transition-colors duration-200">
                {tf('register.login')}
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};
