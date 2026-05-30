import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, getToken, removeToken } from "@/lib/api";

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  userRole: string | null;
  signInWithPassword: (email: string; password?: string) => Promise<any>;
  signUp: (email: string; password?: string, name?: string, role?: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  userRole: null,
  signInWithPassword: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const loadUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setSession(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await api.getProfile();
      setUser(profile);
      setUserRole(profile.role);
      setSession({ access_token: token });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      removeToken();
      setUser(null);
      setSession(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signInWithPassword = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setUserRole(res.user.role);
      setSession({ access_token: res.token });
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password?: string, name?: string, role = "guest") => {
    setLoading(true);
    try {
      const res = await api.signUp(email, password, name, role);
      setUser(res.user);
      setUserRole(res.user.role);
      setSession({ access_token: res.token });
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    removeToken();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, userRole, signInWithPassword, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
