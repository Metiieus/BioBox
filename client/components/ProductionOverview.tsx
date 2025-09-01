import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User, Package } from "lucide-react";

interface ProductionItem {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  progress: number;
  status: "cutting" | "assembly" | "finishing" | "quality" | "completed";
  operator: string;
  estimatedCompletion: string;
  priority: "high" | "medium" | "low";
}

const productionItems: ProductionItem[] = [
  {
    id: "1",
    orderNumber: "#1234",
    customer: "João Silva",
    product: "Cama Queen Luxo",
    progress: 85,
    status: "finishing",
    operator: "Carlos M.",
    estimatedCompletion: "2h",
    priority: "high",
  },
  {
    id: "2",
    orderNumber: "#1235",
    customer: "Maria Santos",
    product: "Cama King Premium",
    progress: 60,
    status: "assembly",
    operator: "Ana L.",
    estimatedCompletion: "4h",
    priority: "medium",
  },
  {
    id: "3",
    orderNumber: "#1236",
    customer: "Pedro Costa",
    product: "Cama Casal Standard",
    progress: 30,
    status: "cutting",
    operator: "José R.",
    estimatedCompletion: "6h",
    priority: "low",
  },
];

const statusColors = {
  cutting: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  assembly: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  finishing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  quality: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  completed: "bg-biobox-green/10 text-biobox-green border-biobox-green/20",
};

const statusLabels = {
  cutting: "Corte",
  assembly: "Montagem",
  finishing: "Acabamento",
  quality: "Qualidade",
  completed: "Concluído",
};

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-orange-500",
  low: "bg-green-500",
};

export default function ProductionOverview() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Visão Geral da Produção
          </CardTitle>
          <Badge variant="outline" className="border-biobox-green text-biobox-green">
            3 em produção
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {productionItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border border-border hover:bg-muted/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {item.orderNumber}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${priorityColors[item.priority]}`}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.product}</p>
                  <p className="text-xs text-muted-foreground">
                    Cliente: {item.customer}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${statusColors[item.status]}`}
                >
                  {statusLabels[item.status]}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progresso</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{item.operator}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Conclusão em {item.estimatedCompletion}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
