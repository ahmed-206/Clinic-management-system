import {z} from 'zod'
import type { FormKeys } from '../i18n/types';

const msg = (key: FormKeys) => key;
export const signupSchema = z.object({
  name: z.string().min(3,msg('errors.invalidName') ),
  email: z.string().email(msg('errors.invalidEmail')),
  password: z
    .string()
    .min(6,msg('errors.invalidPassword')),
    terms: z.boolean().refine(val => val === true,
   msg('errors.agreeCondition')
  )
});

export const loginSchema = z.object({
  email: z.string().email(msg('errors.invalidEmail')),
  password: z.string().min(1, msg('errors.required')),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;