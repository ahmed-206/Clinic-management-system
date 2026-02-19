import {z} from 'zod'


export const signupSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 character" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
    terms: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على الشروط والأحكام للاستمرار"
  })
});

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;