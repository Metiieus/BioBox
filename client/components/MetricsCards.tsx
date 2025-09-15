import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Calendar,
  Truck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
} from "lucide-react";
import { mockOrders } from "@/types/order";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "green" | "blue" | "orange" | "red";
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "green",
}: MetricCardProps) {
  const colorClasses = {
    green: "bg-biobox-green/10 text-biobox-green",
    blue: "bg-blue-500/10 text-blue-500",
    orange: "bg-orange-500/10 text-orange-500",
    red: "bg-red-500/10 text-red-500",
  };

  return (
    <Card className="bg-card border-border hover:bg-card/80 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center mt-2 space-x-1">
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-biobox-green" />
                ) : trend === "down" ? (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                ) : null}
                <span
                  className={`text-xs font-medium ${
                    trend === "up"
                      ? "text-biobox-green"
                      : trend === "down"
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div
            className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MetricsCards() {
  // Calculate real metrics from actual data
  const activeOrders = mockOrders.filter(order => 
    ['pending', 'confirmed', 'in_production', 'quality_check'].includes(order.status)
  ).length;
  
  const inProductionOrders = mockOrders.filter(order => 
    order.status === 'in_production'
  ).length;
  
  const readyOrders = mockOrders.filter(order => 
    order.status === 'ready'
  ).length;
  
  // Calculate total revenue from all active orders (not cancelled)
  const monthlyRevenue = mockOrders
<<<<<<< HEAD
    .filter(order => {
      const orderMonth = order.createdAt.getMonth();
      const currentMonth = new Date().getMonth();
      return orderMonth === currentMonth && 
             ['delivered', 'ready'].includes(order.status);
    })
=======
    .filter(order => order.status !== 'cancelled')
>>>>>>> f802f5c3f6f6dd0e1acc775b23090fd4d28bbdcf
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  const monthlyTarget = 50000;
  const revenuePercentage = Math.round((monthlyRevenue / monthlyTarget) * 100);
  
  // Calcular receita total confirmada (pedidos entregues + prontos)
  const confirmedRevenue = mockOrders
    .filter(order => ['delivered', 'ready'].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Calcular receita em produção (valor já liberado dos fragmentos)
  const productionRevenue = mockOrders
    .filter(order => order.isFragmented && order.fragments)
    .reduce((sum, order) => {
      const releasedValue = order.fragments!
        .filter(f => f.status === 'completed')
        .reduce((fSum, f) => fSum + f.value, 0);
      return sum + releasedValue;
    }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Pedidos Ativos"
        value={activeOrders}
        subtitle={`${mockOrders.filter(o => o.priority === 'urgent').length} urgentes`}
        icon={Calendar}
        trend="up"
        trendValue={`${activeOrders > 3 ? '+' : ''}${Math.round(((activeOrders - 3) / 3) * 100)}% vs mês anterior`}
        color="blue"
      />
      <MetricCard
        title="Em Produção"
        value={inProductionOrders}
        subtitle="Camas sendo fabricadas"
        icon={Package}
        trend="neutral"
        trendValue={`${mockOrders.filter(o => o.status === 'in_production' && new Date() > (o.deliveryDate || new Date())).length} atrasadas`}
        color="orange"
      />
      <MetricCard
        title="Prontas p/ Entrega"
        value={readyOrders}
        subtitle="Aguardando transporte"
        icon={CheckCircle}
        trend="up"
        trendValue={`+${readyOrders} hoje`}
        color="green"
      />
      <MetricCard
<<<<<<< HEAD
        title="Receita Confirmada"
        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(confirmedRevenue)}
        subtitle={`Meta: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyTarget)}`}
        icon={DollarSign}
        trend="up"
        trendValue={`${Math.round((confirmedRevenue / monthlyTarget) * 100)}% da meta`}
=======
        title="Receita Total"
        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyRevenue)}
        subtitle={`Meta Mensal: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyTarget)}`}
        icon={DollarSign}
        trend="up"
        trendValue={`${revenuePercentage}% da meta mensal`}
>>>>>>> f802f5c3f6f6dd0e1acc775b23090fd4d28bbdcf
        color="green"
      />
    </div>
  );
}
