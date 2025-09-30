import { useState, useEffect, createContext, useContext } from "react";
import { AuthUser, AuthState } from "@/types/auth";
import { useSupabase, User } from "./useSupabase";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const isBrowser = typeof window !== "undefined";

const buildAuthUser = async (user: any): Promise<AuthUser> => {
  return {
    id: user.id,
    email: user.email,
    // adicione outros campos que precisar
  };
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function useAuthProvider() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const { getUsers } = useSupabase();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    // Check for stored auth
    const storedUser = localStorage.getItem("bioboxsys_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem("bioboxsys_user");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try Supabase Auth first
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });
      if (!authError && authData.user) {
        // Load profile from users table
        let profile: User | null = null;
        try {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", authData.user.id)
            .single();
          profile = data as any;
        } catch {}

        const authUser: AuthUser = {
          id: authData.user.id,
          name:
            profile?.name || authData.user.email?.split("@")[0] || "Usuário",
          email: authData.user.email || email,
          role: (profile?.role as any) || "seller",
          permissions: (profile?.permissions as any) || [],
        };

        localStorage.setItem("bioboxsys_user", JSON.stringify(authUser));
        setAuthState({
          user: authUser,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }

      // Fallback demo login using local/mock users (password === 'password')
      const users = await getUsers();
      const user = users.find((u) => u.email === email);
      if (user && password === "password") {
        const authUser: AuthUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as any,
          permissions: user.permissions,
        };
        localStorage.setItem("bioboxsys_user", JSON.stringify(authUser));
        setAuthState({
          user: authUser,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("bioboxsys_user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Exemplo de checagem de permissão
  const checkPermission = (module: string, action: string): boolean => {
    // Aqui você pode implementar regras de permissão baseadas no usuário
    // Exemplo simples:
    if (!authState.user) return false;
    if (authState.user.role === "admin") return true;

    // Check specific permissions
    const permission = `${module}:${action}`;
    return (
      authState.user.permissions.includes(permission) ||
      authState.user.permissions.includes("all")
    );
  };

  return {
    ...authState,
    login,
    logout,
    checkPermission,
    // backward compatibility
    hasPermission: checkPermission,
  };
}

export { AuthContext };
