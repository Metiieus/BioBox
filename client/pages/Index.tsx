import DashboardLayout from "@/components/DashboardLayout";
import MetricsCards from "@/components/MetricsCards";
import ProductionChart from "@/components/ProductionChart";
import RecentActivity from "@/components/RecentActivity";
import ProductionOverview from "@/components/ProductionOverview";
import { useAuth } from "@/components/AuthProvider";

export default function Index() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bem-vindo ao BioBoxsys, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Sistema de Gerenciamento de Produção 
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Logado como: {user?.role === 'admin' ? 'Administrador' : 'Vendedor'}
          </p>
        </div>

        {/* Metrics Cards */}
        <MetricsCards />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Production Chart */}
          <div className="lg:col-span-1">
            <ProductionChart />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Production Overview */}
        <ProductionOverview />
      </div>
    </DashboardLayout>
  );
}
