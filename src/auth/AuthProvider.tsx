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
    setLoading(true); // always mark as loading while we fetch
    if (session?.user) {
      // Fetch profile FIRST, then set user+profile together in one render.
      // If we set user before profile is ready, RequireRole sees
      // user=set/profile=null/loading=false and redirects to /unauthorized.
      const userProfile = await fetchProfile(session.user.id);
      setUser(session.user);
      setProfile(userProfile);
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
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
      refreshAuth(session);
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);
 

  const login = async (email: string, password: string) => {
    // Only trigger the sign-in. onAuthStateChange (SIGNED_IN event)
    // will call refreshAuth which handles setting user, profile, and loading.
    // Having a second fetchProfile here caused a concurrent state race.
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
