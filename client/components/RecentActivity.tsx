import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  Truck,
  User,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "production" | "delivery" | "order" | "alert";
  title: string;
  description: string;
  time: string;
  status: "completed" | "in-progress" | "pending" | "urgent";
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "production",
    title: "Cama Queen Luxo #1234",
    description: "Produção finalizada - Pronta para acabamento",
    time: "5 min atrás",
    status: "completed",
  },
  {
    id: "2",
    type: "order",
    title: "Novo Pedido #5678",
    description: "Cliente: João Silva - 2x Cama King Premium",
    time: "12 min atrás",
    status: "pending",
  },
  {
    id: "3",
    type: "alert",
    title: "Estoque Baixo",
    description: "Espuma D33 - Apenas 15 unidades restantes",
    time: "25 min atrás",
    status: "urgent",
  },
  {
    id: "4",
    type: "delivery",
    title: "Entrega Programada",
    description: "Rota Centro - 8 camas para entrega",
    time: "45 min atrás",
    status: "in-progress",
  },
  {
    id: "5",
    type: "production",
    title: "Linha de Produção A",
    description: "Iniciada fabricação Cama Casal Standard #9876",
    time: "1h atrás",
    status: "in-progress",
  },
  {
    id: "6",
    type: "order",
    title: "Pedido Atualizado #3456",
    description: "Cliente solicitou alteração na cor da cabeceira",
    time: "2h atrás",
    status: "pending",
  },
];

const iconMap = {
  production: Package,
  delivery: Truck,
  order: User,
  alert: AlertTriangle,
};

const statusColors = {
  completed: "bg-biobox-green/10 text-biobox-green border-biobox-green/20",
  "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabels = {
  completed: "Concluído",
  "in-progress": "Em Andamento",
  pending: "Pendente",
  urgent: "Urgente",
};

export default function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = iconMap[activity.type];
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/5 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-muted/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusColors[activity.status]}`}
                      >
                        {statusLabels[activity.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
