import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { AuthUser, AuthState } from '@/types/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  const isBrowser = typeof window !== 'undefined';

  const buildAuthUser = useCallback(async (supabaseUser: SupabaseAuthUser): Promise<AuthUser> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, permissions')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.warn('Falha ao carregar perfil do usuário no Supabase:', error.message);
      }

      const profile = data ?? null;

      return {
        id: profile?.id ?? supabaseUser.id,
        name:
          profile?.name ??
          (supabaseUser.user_metadata?.full_name as string | undefined) ??
          supabaseUser.email ??
          'Usuário',
        email: profile?.email ?? supabaseUser.email ?? '',
        role: (profile?.role ?? 'seller') as AuthUser['role'],
        permissions: Array.isArray(profile?.permissions) ? profile.permissions : []
      };
    } catch (error) {
      console.error('Erro ao montar usuário autenticado:', error);
      return {
        id: supabaseUser.id,
        name:
          (supabaseUser.user_metadata?.full_name as string | undefined) ??
          supabaseUser.email ??
          'Usuário',
        email: supabaseUser.email ?? '',
        role: 'seller',
        permissions: []
      };
    }
  }, []);

  const persistAuthUser = useCallback((user: AuthUser | null) => {
    if (!isBrowser) return;
    if (user) {
      localStorage.setItem('bioboxsys_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bioboxsys_user');
    }
  }, [isBrowser]);

  const checkAuthState = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (session?.user) {
        const authUser = await buildAuthUser(session.user);
        persistAuthUser(authUser);
        setAuthState({
          user: authUser,
          isAuthenticated: true,
          isLoading: false
        });
        return;
      }

      const storedUser = isBrowser ? localStorage.getItem('bioboxsys_user') : null;
      if (storedUser) {
        const user = JSON.parse(storedUser) as AuthUser;
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return;
      }

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Erro ao verificar estado de autenticação:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, [buildAuthUser, isBrowser, persistAuthUser]);

  useEffect(() => {
    void checkAuthState();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const authUser = await buildAuthUser(session.user);
        persistAuthUser(authUser);
        setAuthState({
          user: authUser,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        persistAuthUser(null);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [buildAuthUser, checkAuthState, persistAuthUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        const message = error?.message ?? 'Credenciais inválidas';
        console.error('Erro ao realizar login:', message);
        throw new Error(message);
      }

      const authUser = await buildAuthUser(data.user);
      persistAuthUser(authUser);
      setAuthState({
        user: authUser,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Não foi possível realizar o login.');
    }
  };

  const logout = () => {
    supabase.auth.signOut().catch(error => {
      console.error('Erro ao encerrar sessão:', error);
    });
    persistAuthUser(null);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!authState.user) return false;
    if (authState.user.role === 'admin') return true;

    // Check specific permissions
    const permission = `${module}:${action}`;
    return authState.user.permissions.includes(permission) || authState.user.permissions.includes('all');
  };

  return {
    ...authState,
    login,
    logout,
    hasPermission
  };
};

export { AuthContext };

