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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Pedidos Ativos"
        value={24}
        subtitle="3 urgentes"
        icon={Calendar}
        trend="up"
        trendValue="+12% vs mês anterior"
        color="blue"
      />
      <MetricCard
        title="Em Produção"
        value={8}
        subtitle="Camas sendo fabricadas"
        icon={Package}
        trend="neutral"
        trendValue="2 atrasadas"
        color="orange"
      />
      <MetricCard
        title="Prontas p/ Entrega"
        value={15}
        subtitle="Aguardando transporte"
        icon={CheckCircle}
        trend="up"
        trendValue="+5 hoje"
        color="green"
      />
      <MetricCard
        title="Faturamento Mês"
        value="R$ 142.500"
        subtitle="Meta: R$ 180.000"
        icon={DollarSign}
        trend="up"
        trendValue="79% da meta"
        color="green"
      />
    </div>
  );
}
