import { useEffect, useState } from "react";
import { AuthContext} from "../context/AuthContext";
import { type UserProfile } from "../types/types";
import supabase from "../supabase";
import type { Session, User } from "@supabase/supabase-js";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    console.log("Fetching profile for ID:", userId);
    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId).returns<UserProfile>()
      .maybeSingle();
      console.log("Data returned from DB:", data);
    return data;
  };

  useEffect(() => {
  // دالة واحدة تتعامل مع كل شيء
  const refreshAuth = async (session: Session | null) => {
    
    if (session?.user) {
      setUser(session.user);
      const userProfile = await fetchProfile(session.user.id);
      setProfile(userProfile);
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false); // نضمن توقف التحميل هنا
  };

  // 1. فحص الجلسة الحالية فوراً
  supabase.auth.getSession().then(({ data: { session } }) => {
    refreshAuth(session);
  });

  // 2. الاستماع لأي تغيير (دخول/خروج)
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      refreshAuth(session);
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);
 

  const login = async (email: string, password: string) => {
    const {data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
    const userProfile = await fetchProfile(data.user.id);
    setProfile(userProfile);
    setUser(data.user);
  }
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) throw error;
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

 // useEffect(() => {
  //   // 1. فحص الجلسة عند بداية تشغيل التطبيق
  //   const initializeAuth = async () => {
  //     // const response = await supabase.auth.getSession();
  //     // const session = response.data.session;
  //     // اختصاراا
  //     try {
  //        const {
  //       data: { session },
  //     } = await supabase.auth.getSession();
  //     if (session?.user) {
  //       setUser(session.user);
  //       const userProfile = await fetchProfile(session.user.id);
  //       setProfile(userProfile);
  //     }
  //     } catch (error) {
  //       console.error(error)
  //     }finally{

  //       setLoading(false);
  //     }
     
  //   };
  //   initializeAuth();
  //   // ******************************************************

  //   // 2. مراقبة التغييرات (دخول/خروج)
  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     async (event, session) => {
        
  //       if (session?.user) {
  //         setUser(session.user);
  //         const userProfile = await fetchProfile(session.user.id);
  //         setProfile(userProfile);
  //       } else {
  //         setUser(null);
  //         setProfile(null);
  //       }
  //       setLoading(false);
  //     },
  //   );
  //   // ******************************************************

  //   return () => {
  //     authListener.subscription.unsubscribe();
  //   };
  // }, []);



// useEffect(() => {
//     // هل فيه Session محفوظة في المتصفح؟

//     supabase.auth.getSession().then(({ data }) => {
//       // لو فيه User كان عامل Login قبل كده → يرجعه
//       // ولو مفيش null
//       setUser(data.session?.user ?? null);
//     });

//     // بتعمل ايه؟
//     // Listener
//     // بيراقب أي تغيير في حالة Auth
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user ?? null);
//       }
//     );

//     // Cleanup
//     // لما Component يتشال من الصفحة
//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   useEffect(() => {
//     if (!user) {
//       setProfile(null);
//       setLoading(false);
//       return;
//     }

//     supabase
//       .from("profiles")
//       .select()
//       .eq("id", user.id)
//       .single()
//       .then(({ data }) => {
//         setProfile(data);
//         setLoading(false);
//       });
//   }, [user]);
