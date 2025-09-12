import DashboardLayout from "@/components/DashboardLayout";
import ProductionDashboard from "@/components/ProductionDashboard";
import NewTaskForm from "@/components/NewTaskForm";
import ProductionSettings from "@/components/ProductionSettings";
import ProductionReport from "@/components/ProductionReport";
import { Button } from "@/components/ui/button";
import { BarChart3, Play, Download, Settings } from "lucide-react";
import { useState } from "react";
import { ProductionTask } from "@/types/production";

export default function Production() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [tasks, setTasks] = useState<ProductionTask[]>([]);

  const handleSaveTask = (taskData: Partial<ProductionTask>) => {
    const newTask: ProductionTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date()
    } as ProductionTask;
    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
  };

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
            <Button variant="outline" onClick={() => setShowReport(true)}>
              <Download className="h-4 w-4 mr-2" />
              Relatório
            </Button>
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button 
              className="bg-biobox-green hover:bg-biobox-green-dark"
              onClick={() => setShowTaskForm(true)}
            >
              <Play className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        <ProductionDashboard tasks={tasks} />

        {/* Task Form Modal */}
        {showTaskForm && (
          <NewTaskForm
            onSave={handleSaveTask}
            onCancel={() => setShowTaskForm(false)}
          />
        )}

        {/* Settings Modal */}
        {showSettings && (
          <ProductionSettings
            onClose={() => setShowSettings(false)}
            onSave={(settings) => {
              console.log('Configurações salvas:', settings);
              setShowSettings(false);
            }}
          />
        )}

        {/* Report Modal */}
        {showReport && (
          <ProductionReport
            onClose={() => setShowReport(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
