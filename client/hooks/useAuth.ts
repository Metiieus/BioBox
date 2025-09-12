import { useState, useEffect, createContext, useContext } from 'react';
import { AuthUser, AuthState } from '@/types/auth';
import { mockUsers } from '@/types/user';

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

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('bioboxsys_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch {
        localStorage.removeItem('bioboxsys_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const user = mockUsers.find(u => u.email === email && u.status === 'active');
    
    if (user && password === 'password') { // Simple password check for demo
      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions.map(p => p.id)
      };

      localStorage.setItem('bioboxsys_user', JSON.stringify(authUser));
      setAuthState({
        user: authUser,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('bioboxsys_user');
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
    return authState.user.permissions.some(permissionId => {
      const permission = mockUsers
        .find(u => u.id === authState.user!.id)
        ?.permissions.find(p => p.id === permissionId);
      
      return permission?.module === module && permission.actions.includes(action as any);
    });
  };

  return {
    ...authState,
    login,
    logout,
    hasPermission
  };
};

export { AuthContext };