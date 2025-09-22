import { ReactNode, createContext, useContext } from "react";
import { useAuthProvider } from "@/hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

// Tipagem do contexto (ajuste conforme seu AuthUser)
interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
  checkPermission: (module: string, action: string) => boolean;
}

// cria o contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// provider em volta da aplicação
export default function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
