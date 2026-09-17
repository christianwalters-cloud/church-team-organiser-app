import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Utils/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    // 🔧 Removed separate getSession.then to let onAuthStateChange handle initial mounting cleanly.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false); // 🚀 Safely marks initial session analysis complete

      if (event === "PASSWORD_RECOVERY") {
        setShowResetModal(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  // 🔧 Extracted and structured the parameters cleanly to ensure meta-data options pass down intact
  const signUp = async (email, password, options = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: options.options || options // Supports passing options object directly or nested
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    signUp,
    logout,
    loading,
    showResetModal,
    setShowResetModal
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
