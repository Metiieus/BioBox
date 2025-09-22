import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { AuthUser } from "@/types/auth";
import { AuthContext } from "@/contexts/AuthContext";

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

const persistAuthUser = (user: AuthUser | null) => {
  if (!isBrowser) return;
  if (user) {
    localStorage.setItem("bioboxsys_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("bioboxsys_user");
  }
};

export function useAuthProvider() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Verifica sessão inicial
  const checkAuthState = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true })); // corrigido

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao verificar sessão:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      if (session?.user) {
        const authUser = await buildAuthUser(session.user);
        persistAuthUser(authUser);
        setAuthState({
          user: authUser,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      const storedUser = isBrowser
        ? localStorage.getItem("bioboxsys_user")
        : null;
      if (storedUser) {
        const user = JSON.parse(storedUser) as AuthUser;
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Erro ao verificar estado de autenticação:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // Escuta mudanças de sessão
  useEffect(() => {
    checkAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        buildAuthUser(session.user).then((authUser) => {
          persistAuthUser(authUser);
          setAuthState({
            user: authUser,
            isAuthenticated: true,
            isLoading: false,
          });
        });
      } else {
        persistAuthUser(null);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuthState]);

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session?.user) {
        const message = error?.message ?? "Credenciais inválidas";
        console.error("Erro ao realizar login:", message);
        throw new Error(message);
      }

      const authUser = await buildAuthUser(data.session.user); // corrigido
      persistAuthUser(authUser);
      setAuthState({
        user: authUser,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Não foi possível realizar o login.");
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    } finally {
      persistAuthUser(null);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  // Exemplo de checagem de permissão
  const checkPermission = (module: string, action: string): boolean => {
    // Aqui você pode implementar regras de permissão baseadas no usuário
    // Exemplo simples:
    if (!authState.user) return false;
    return true;
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthState,
    checkPermission,
  };
}
