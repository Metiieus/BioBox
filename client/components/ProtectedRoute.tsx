import { ReactNode, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Permission } from "@/types/user";

const moduleRoutes: Array<{
  module: Permission["module"];
  path: string;
  label: string;
}> = [
  { module: "dashboard", path: "/", label: "Dashboard" },
  { module: "orders", path: "/orders", label: "Pedidos" },
  { module: "customers", path: "/customers", label: "Clientes" },
  { module: "production", path: "/production", label: "Produção" },
  { module: "products", path: "/products", label: "Produtos" },
  { module: "settings", path: "/settings", label: "Configurações" },
];

interface ProtectedRouteProps {
  children: ReactNode;
  module: string;
  action: string;
}

export default function ProtectedRoute({ children, module, action }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission, user, logout } = useAuth();

  const accessibleRoute = useMemo(() => {
    if (!user) {
      return null;
    }

    return (
      moduleRoutes.find((route) => hasPermission(route.module, "view")) ?? null
    );
  }, [hasPermission, user]);

  const deniedModule = moduleRoutes.find((route) => route.module === module);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-biobox-green mx-auto mb-4">
            <span className="text-lg font-bold text-biobox-dark">BB</span>
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(module, action)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Acesso Negado</h1>
          <p className="text-muted-foreground mb-4">
            Você não tem permissão para acessar
            {" "}
            {deniedModule ? deniedModule.label : "esta área"}.
          </p>
          {accessibleRoute ? (
            <Link
              to={accessibleRoute.path}
              className="inline-flex items-center justify-center rounded-lg bg-biobox-green px-4 py-2 text-sm font-medium text-biobox-dark transition-colors hover:bg-biobox-green-dark"
            >
              Ir para {accessibleRoute.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Encerrar sessão
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}