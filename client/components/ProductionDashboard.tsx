import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Activity,
  Users,
  Package,
  TrendingUp,
  Wrench
} from "lucide-react";
import { 
  ProductionTask, 
  ProductionLine, 
  Operator,
  productionStages,
  statusColors,
  statusLabels,
  priorityColors,
  operatorStatusColors,
  operatorStatusLabels
} from "@/types/production";
import { mockOrders } from "@/types/order";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProductionDashboardProps {
  tasks?: ProductionTask[];
  lines?: ProductionLine[];
  operators?: Operator[];
}

export default function ProductionDashboard({ 
  tasks,
  lines,
  operators
}: ProductionDashboardProps) {
  // Generate real production data from orders
  const generateRealProductionTasks = (): ProductionTask[] => {
    if (tasks && tasks.length > 0) return tasks;
    
    return mockOrders
      .filter(order => ['confirmed', 'in_production', 'quality_check'].includes(order.status))
      .map(order => ({
        id: `task-${order.id}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        productName: order.products[0]?.productName || 'Produto',
        customerId: order.customerId,
        customerName: order.customerName,
        stage: order.status === 'confirmed' ? 'cutting' : 
               order.status === 'in_production' ? 'assembly' : 'quality_control',
        stageOrder: order.status === 'confirmed' ? 2 : 
                   order.status === 'in_production' ? 3 : 6,
        status: order.status === 'confirmed' ? 'pending' as const :
                order.status === 'in_production' ? 'in_progress' as const : 'in_progress' as const,
        priority: order.priority,
        assignedOperator: order.assignedOperator,
        startTime: order.status === 'in_production' ? new Date(Date.now() - 2 * 60 * 60 * 1000) : undefined,
        estimatedCompletionTime: order.deliveryDate,
        progress: order.productionProgress,
        notes: order.notes
      }));
  };

  const generateRealProductionLines = (): ProductionLine[] => {
    const activeOrders = mockOrders.filter(o => o.status === 'in_production');
    return [
      {
        id: '1',
        name: 'Linha A - Camas Premium',
        status: activeOrders.length > 0 ? 'active' as const : 'inactive' as const,
        currentOrder: activeOrders[0]?.orderNumber,
        operatorId: '1',
        operatorName: activeOrders[0]?.assignedOperator || 'Disponível',
        efficiency: 95,
        dailyTarget: 3,
        dailyProduced: Math.floor(Math.random() * 3) + 1,
        lastUpdate: new Date()
      },
      {
        id: '2',
        name: 'Linha B - Camas Standard',
        status: activeOrders.length > 1 ? 'active' as const : 'inactive' as const,
        currentOrder: activeOrders[1]?.orderNumber,
        operatorId: '2',
        operatorName: activeOrders[1]?.assignedOperator || 'Disponível',
        efficiency: 92,
        dailyTarget: 4,
        dailyProduced: Math.floor(Math.random() * 4) + 1,
        lastUpdate: new Date()
      },
      {
        id: '3',
        name: 'Linha C - Acabamento',
        status: 'maintenance' as const,
        efficiency: 0,
        dailyTarget: 5,
        dailyProduced: 0,
        lastUpdate: new Date()
      }
    ];
  };

  const generateRealOperators = (): Operator[] => {
    return [
      {
        id: '1',
        name: 'Carlos Mendes',
        skills: ['cutting', 'carpentry', 'assembly'],
        experience: 8,
        efficiency: 95,
        currentTask: tasks?.find(t => t.assignedOperator === 'Carlos Mendes')?.id,
        status: tasks?.some(t => t.assignedOperator === 'Carlos Mendes' && t.status === 'in_progress') 
          ? 'busy' as const : 'available' as const,
        shift: 'morning' as const
      },
      {
        id: '2',
        name: 'Ana Lima',
        skills: ['upholstery', 'sewing', 'finishing'],
        experience: 6,
        efficiency: 92,
        currentTask: tasks?.find(t => t.assignedOperator === 'Ana Lima')?.id,
        status: tasks?.some(t => t.assignedOperator === 'Ana Lima' && t.status === 'in_progress') 
          ? 'busy' as const : 'available' as const,
        shift: 'morning' as const
      },
      {
        id: '3',
        name: 'José Roberto',
        skills: ['design', 'measurement', 'quality_control'],
        experience: 12,
        efficiency: 98,
        status: 'available' as const,
        shift: 'morning' as const
      },
      {
        id: '4',
        name: 'Maria Silva',
        skills: ['cutting', 'material_handling', 'packaging'],
        experience: 4,
        efficiency: 88,
        status: 'break' as const,
        shift: 'morning' as const
      },
      {
        id: '5',
        name: 'Pedro Santos',
        skills: ['carpentry', 'assembly', 'finishing'],
        experience: 10,
        efficiency: 94,
        currentTask: tasks?.find(t => t.assignedOperator === 'Pedro Santos')?.id,
        status: tasks?.some(t => t.assignedOperator === 'Pedro Santos' && t.status === 'in_progress') 
          ? 'busy' as const : 'available' as const,
        shift: 'afternoon' as const
      }
    ];
  };

  // Use real data or provided data
  const realTasks = tasks || generateRealProductionTasks();
  const realLines = lines || generateRealProductionLines();
  const realOperators = operators || generateRealOperators();

  const [selectedTask, setSelectedTask] = useState<ProductionTask | null>(null);
  const [taskUpdates, setTaskUpdates] = useState<Record<string, Partial<ProductionTask>>>({});

  const handleUpdateTask = (taskId: string, updates: Partial<ProductionTask>) => {
    setTaskUpdates(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates }
    }));
  };

  const handleStartTask = (taskId: string) => {
    handleUpdateTask(taskId, {
      status: 'in_progress',
      startTime: new Date()
    });
  };

  const handleCompleteTask = (taskId: string) => {
    handleUpdateTask(taskId, {
      status: 'completed',
      progress: 100,
      actualCompletionTime: new Date()
    });
  };

  const getTaskWithUpdates = (task: ProductionTask) => {
    return { ...task, ...taskUpdates[task.id] };
  };

  // Statistics
  const activeTasks = realTasks.filter(t => t.status === 'in_progress').length;
  const completedToday = realTasks.filter(t => 
    t.status === 'completed' && 
    t.actualCompletionTime && 
    new Date(t.actualCompletionTime).toDateString() === new Date().toDateString()
  ).length;
  const blockedTasks = realTasks.filter(t => t.status === 'blocked').length;
  const availableOperators = realOperators.filter(o => o.status === 'available').length;

  const overallEfficiency = realLines.reduce((sum, line) => sum + line.efficiency, 0) / realLines.length;

  const TaskCard = ({ task }: { task: ProductionTask }) => {
    const updatedTask = getTaskWithUpdates(task);
    const stage = productionStages.find(s => s.id === task.stage);
    const timeRemaining = updatedTask.estimatedCompletionTime 
      ? Math.max(0, Math.floor((updatedTask.estimatedCompletionTime.getTime() - Date.now()) / (1000 * 60)))
      : null;

    return (
      <Card 
        className={cn(
          "bg-card border-border hover:bg-muted/5 transition-colors cursor-pointer",
          selectedTask?.id === updatedTask.id && "ring-2 ring-biobox-green"
        )}
        onClick={() => setSelectedTask(updatedTask)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div
                className={cn("w-2 h-2 rounded-full", priorityColors[updatedTask.priority])}
              />
              <span className="font-medium text-sm">{updatedTask.orderNumber}</span>
            </div>
            <Badge 
              variant="outline" 
              className={cn("text-xs", statusColors[updatedTask.status])}
            >
              {statusLabels[updatedTask.status]}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">{updatedTask.productName}</p>
              <p className="text-xs text-muted-foreground">{updatedTask.customerName}</p>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Package className="h-3 w-3 mr-1" />
              <span>{stage?.name}</span>
            </div>
            
            {updatedTask.assignedOperator && (
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="h-3 w-3 mr-1" />
                <span>{updatedTask.assignedOperator}</span>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Progresso</span>
                <span>{updatedTask.progress}%</span>
              </div>
              <Progress value={updatedTask.progress} className="h-2" />
            </div>
            
            {timeRemaining !== null && updatedTask.status === 'in_progress' && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {timeRemaining > 0 
                    ? `${timeRemaining} min restantes`
                    : "Atrasado"
                  }
                </span>
              </div>
            )}
            
            {updatedTask.issues && updatedTask.issues.length > 0 && (
              <div className="flex items-center text-xs text-red-500">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span>{updatedTask.issues.length} problema(s)</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              {updatedTask.status === 'pending' && (
                <Button
                  size="sm"
                  className="flex-1 bg-biobox-green hover:bg-biobox-green-dark"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartTask(updatedTask.id);
                  }}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Iniciar
                </Button>
              )}
              {updatedTask.status === 'in_progress' && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompleteTask(updatedTask.id);
                  }}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Concluir
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LineCard = ({ line }: { line: ProductionLine }) => (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium">{line.name}</h4>
            {line.currentOrder && (
              <p className="text-sm text-muted-foreground">
                Pedido: {line.currentOrder}
              </p>
            )}
          </div>
          <Badge 
            variant="outline"
            className={cn(
              "text-xs",
              line.status === 'active' 
                ? "bg-biobox-green/10 text-biobox-green border-biobox-green/20"
                : line.status === 'maintenance'
                ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                : "bg-red-500/10 text-red-500 border-red-500/20"
            )}
          >
            {line.status === 'active' ? 'Ativa' : 
             line.status === 'maintenance' ? 'Manutenção' : 'Inativa'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          {line.operatorName && (
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{line.operatorName}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Eficiência</p>
              <p className="font-medium">{line.efficiency}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Produzido Hoje</p>
              <p className="font-medium">{line.dailyProduced}/{line.dailyTarget}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Meta Diária</span>
              <span>{Math.round((line.dailyProduced / line.dailyTarget) * 100)}%</span>
            </div>
            <Progress value={(line.dailyProduced / line.dailyTarget) * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OperatorCard = ({ operator }: { operator: Operator }) => (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-biobox-green/10 text-biobox-green text-xs">
                {operator.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-sm">{operator.name}</h4>
              <p className="text-xs text-muted-foreground">
                {operator.experience} anos de experiência
              </p>
            </div>
          </div>
          <Badge 
            variant="outline"
            className={cn("text-xs", operatorStatusColors[operator.status])}
          >
            {operatorStatusLabels[operator.status]}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Eficiência</span>
            <span>{operator.efficiency}%</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {operator.skills.slice(0, 3).map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {operator.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{operator.skills.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Turno: {operator.shift === 'morning' ? 'Manhã' : 
                   operator.shift === 'afternoon' ? 'Tarde' : 'Noite'}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tarefas Ativas</p>
                <p className="text-2xl font-bold text-foreground">{activeTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-biobox-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Concluídas Hoje</p>
                <p className="text-2xl font-bold text-foreground">{completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Bloqueadas</p>
                <p className="text-2xl font-bold text-foreground">{blockedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Eficiência Geral</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(overallEfficiency)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">Tarefas em Andamento</TabsTrigger>
          <TabsTrigger value="lines">Linhas de Produção</TabsTrigger>
          <TabsTrigger value="operators">Operadores</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {realTasks
              .filter(task => task.status !== 'completed')
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="lines">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {realLines.map(line => (
              <LineCard key={line.id} line={line} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operators">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {realOperators.map(operator => (
              <OperatorCard key={operator.id} operator={operator} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Detalhes da Tarefa</span>
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pedido</p>
                  <p className="font-medium">{selectedTask.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedTask.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Produto</p>
                  <p className="font-medium">{selectedTask.productName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Etapa</p>
                  <p className="font-medium">
                    {productionStages.find(s => s.id === selectedTask.stage)?.name}
                  </p>
                </div>
              </div>
              
              {selectedTask.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm bg-muted/5 p-3 rounded-lg">{selectedTask.notes}</p>
                </div>
              )}
              
              {selectedTask.issues && selectedTask.issues.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Problemas</p>
                  <div className="space-y-2">
                    {selectedTask.issues.map(issue => (
                      <div key={issue.id} className="p-3 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-red-600">
                            {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                          </span>
                          <Badge variant="outline" className="text-xs text-red-500">
                            {issue.status}
                          </Badge>
                        </div>
                        <p className="text-sm">{issue.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Reportado por {issue.reportedBy} em {format(issue.reportedAt, "dd/MM HH:mm")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
