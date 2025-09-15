import DashboardLayout from "@/components/DashboardLayout";
import ProductionDashboard from "@/components/ProductionDashboard";
import { Button } from "@/components/ui/button";
import { BarChart3, Play, Download, Settings } from "lucide-react";

export default function Production() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Acompanhamento de Produção
            </h1>
            <p className="text-muted-foreground">
              Monitore e controle o processo de fabricação em tempo real
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Relatório
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button className="bg-biobox-green hover:bg-biobox-green-dark">
              <Play className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        <ProductionDashboard />
      </div>
    </DashboardLayout>
  );
}
