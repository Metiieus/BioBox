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

  // Função de login corrigida
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try Supabase Auth first
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });
      
      if (!authError && authData.user) {
        console.log("✅ Autenticação Supabase bem-sucedida:", authData.user.id);
        
        // Tentar carregar perfil da tabela users com tratamento de erro melhorado
        let profile: User | null = null;
        try {
          console.log("🔍 Buscando perfil do usuário na tabela users...");
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", authData.user.id)
            .single();
          
          if (error) {
            console.warn("⚠️ Erro ao buscar perfil na tabela users:", error.message);
            // Se o erro for de RLS ou usuário não encontrado, continuar sem o perfil
            if (error.code === 'PGRST116' || error.code === '42501' || error.message.includes('row-level security')) {
              console.log("📝 Usuário não encontrado na tabela users ou política RLS bloqueou acesso. Criando perfil básico...");
            } else {
              throw error; // Re-throw outros tipos de erro
            }
          } else {
            profile = data as User;
            console.log("✅ Perfil encontrado:", profile);
          }
        } catch (profileError) {
          console.warn("⚠️ Erro ao carregar perfil do usuário:", profileError);
          // Continuar mesmo sem o perfil da tabela users
        }

        // Criar AuthUser com dados disponíveis
        const authUser: AuthUser = {
          id: authData.user.id,
          name: profile?.name || authData.user.email?.split("@")[0] || "Usuário",
          email: authData.user.email || email,
          role: (profile?.role as any) || "seller", // Default role
          permissions: (profile?.permissions as any) || ["orders:read", "customers:read", "production:view", "products:view", "settings:view"], // Default permissions
        };

        console.log("✅ AuthUser criado:", authUser);
        localStorage.setItem("bioboxsys_user", JSON.stringify(authUser));
        setAuthState({
          user: authUser,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }

      // Fallback demo login usando usuários locais/mock (password === 'password')
      console.log("🔄 Tentando login com usuários mock...");
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
        console.log("✅ Login mock bem-sucedido:", authUser);
        return true;
      }
      
      console.log("❌ Credenciais inválidas");
      return false;
    } catch (error) {
      console.error("❌ Erro no login:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Logout do Supabase Auth
      await supabase.auth.signOut();
    } catch (error) {
      console.warn("Erro ao fazer logout do Supabase:", error);
    }
    
    localStorage.removeItem("bioboxsys_user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Função de checagem de permissão corrigida
  const checkPermission = (module: string, action: string): boolean => {
    console.log(`🔍 Verificando permissão: ${module}:${action}`);
    
    if (!authState.user) {
      console.log("❌ Usuário não autenticado");
      return false;
    }
    
    console.log("👤 Usuário:", authState.user.name, "Role:", authState.user.role);
    console.log("🔑 Permissões:", authState.user.permissions);
    
    // Admins têm acesso total
    if (authState.user.role === "admin") {
      console.log("✅ Admin - acesso liberado");
      return true;
    }

    // Verificar permissão específica no formato module:action
    const specificPermission = `${module}:${action}`;
    if (authState.user.permissions.includes(specificPermission)) {
      console.log(`✅ Permissão específica encontrada: ${specificPermission}`);
      return true;
    }

    // Verificar permissão no formato module-full (compatibilidade com formato antigo)
    const fullPermission = `${module}-full`;
    if (authState.user.permissions.includes(fullPermission)) {
      console.log(`✅ Permissão completa encontrada: ${fullPermission}`);
      return true;
    }

    // Verificar permissão "all"
    if (authState.user.permissions.includes("all")) {
      console.log("✅ Permissão 'all' encontrada");
      return true;
    }

    // Mapeamento de permissões específicas para compatibilidade
    const permissionMap: Record<string, string[]> = {
      "orders:view": ["orders-full", "orders:read", "orders:view"],
      "orders:create": ["orders-full", "orders:create"],
      "orders:edit": ["orders-full", "orders:edit"],
      "orders:delete": ["orders-full", "orders:delete"],
      "customers:view": ["customers-full", "customers:read", "customers:view"],
      "customers:create": ["customers-full", "customers:create"],
      "customers:edit": ["customers-full", "customers:edit"],
      "customers:delete": ["customers-full", "customers:delete"],
      "dashboard:view": ["dashboard:view", "all"],
      "production:view": ["production:view", "production-manage", "all"],
      "products:view": ["products:view", "products-manage", "all"],
      "settings:view": ["settings:view", "settings-manage", "all"]
    };

    const requiredPermission = `${module}:${action}`;
    const allowedPermissions = permissionMap[requiredPermission] || [];
    
    for (const allowedPerm of allowedPermissions) {
      if (authState.user.permissions.includes(allowedPerm)) {
        console.log(`✅ Permissão mapeada encontrada: ${allowedPerm} para ${requiredPermission}`);
        return true;
      }
    }

    console.log(`❌ Permissão negada para ${requiredPermission}`);
    return false;
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthState,
    checkPermission,
    // backward compatibility
    hasPermission: checkPermission,
  };
}

export { AuthContext };
