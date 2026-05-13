import { useEffect, useState } from "react";
import { AuthContext} from "../context/AuthContext";
import { type UserProfile } from "../types/types";
import supabase from "../supabase";
import type { Session, User } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId).returns<UserProfile>()
      .maybeSingle();
    return data;
  };

  useEffect(() => {
  // دالة واحدة تتعامل مع كل شيء
  const refreshAuth = async (session: Session | null, isInitial: boolean) => {

    // فقط إظهار حالة التحميل في المرة الأولى
    if (isInitial) {
      setLoading(true);
    }

    if (session?.user) {
      const userProfile = await fetchProfile(session.user.id);
      setUser(session.user);
      setProfile(userProfile);
    } else {
      setUser(null);
      setProfile(null);
    }

    if (isInitial) {
      setLoading(false);
      setInitialized(true);
    }
  };

 
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === "TOKEN_REFRESHED") {
        if (session?.user) {
          fetchProfile(session.user.id).then((userProfile) => {
            setUser(session.user);
            setProfile(userProfile);
          });
        }
        return; 
      }

      // INITIAL_SESSION هو الحدث الأول فقط — باقي الأحداث لا تحتاج إعادة تحميل
      const isInitial = event === "INITIAL_SESSION";
      refreshAuth(session, isInitial);
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);
 

  const login = async (email: string, password: string) => {
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
    if (
      error.message.includes('Registration is closed') ||
      error.message.includes('signup') ||
      error.status === 422
    ) {
      throw new Error('This is a demo app — use the demo accounts to log in.');
    }
    throw error;
  }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };
  const ctxValue = {
    user,
    profile,
    loading,
    login,
    signup,
    logout,
  };
  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}


