import { createContext } from "react";
import { type AuthContextType } from "../types/types";
// تحديد شكل بيانات المستخدم القادمة من الجدول




export const AuthContext = createContext<AuthContextType | null>(null);