import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import NewOrderForm from "@/components/NewOrderForm";
import ThermalPrintManager from "@/components/ThermalPrintManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Printer,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  DollarSign,
  QrCode,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useSupabase, Order } from "@/hooks/useSupabase";

const statusLabels = {
  pending: "Pendente",
  confirmed: "Confirmado", 
  in_production: "Em Produção",
  ready: "Pronto",
  delivered: "Entregue",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média", 
  high: "Alta",
  urgent: "Urgente",
};

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_production: "bg-purple-500/10 text-purple-500 border-purple-500/20", 
  ready: "bg-green-500/10 text-green-500 border-green-500/20",
  delivered: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const priorityColors = {
  low: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20", 
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function Orders() {
  const { user } = useAuth();
  const { orders, loading } = useSupabase();
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showPrintLabels, setShowPrintLabels] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useState("all");

  // Mock orders data (fallback)
  const mockOrders: Order[] = [
    {
      id: "ORD-2024-001",
      customer_name: "João Silva",
      customer_phone: "(11) 99999-9999",
      seller_name: "Carlos Vendedor",
      seller_role: "Vendedor",
      production_date: "2024-12-20",
      delivery_date: "2024-12-25", 
      progress: 65,
      status: "in_production",
      priority: "medium",
      value: 4200.00,
      created_at: "2024-03-15T10:00:00Z",
      updated_at: "2024-03-15T10:00:00Z"
    },
    {
      id: "ORD-2024-002", 
      customer_name: "Móveis Premium Ltda",
      customer_phone: "(11) 88888-8888",
      seller_name: "Ana Vendedora",
      seller_role: "Vendedor",
      production_date: "2024-12-18",
      delivery_date: "2024-12-30",
      progress: 0,
      status: "confirmed", 
      priority: "high",
      value: 12600.00,
      created_at: "2024-03-14T10:00:00Z",
      updated_at: "2024-03-14T10:00:00Z"
    },
    {
      id: "ORD-2024-003",
      customer_name: "Maria Santos", 
      customer_phone: "(11) 77777-7777",
      seller_name: "Carlos Vendedor",
      seller_role: "Vendedor",
      production_date: "2024-12-15",
      delivery_date: "2024-12-22",
      progress: 100,
      status: "ready",
      priority: "low", 
      value: 2100.00,
      created_at: "2024-03-13T10:00:00Z",
      updated_at: "2024-03-13T10:00:00Z"
    },
    {
      id: "ORD-2024-004",
      customer_name: "Pedro Costa",
      customer_phone: "(11) 66666-6666", 
      seller_name: "Ana Vendedora",
      seller_role: "Vendedor",
      production_date: "2024-12-22",
      delivery_date: "2024-12-28",
      progress: 0,
      status: "pending",
      priority: "urgent",
      value: 5600.00,
      created_at: "2024-03-12T10:00:00Z",
      updated_at: "2024-03-12T10:00:00Z"
    }
  ];

  const ordersData = orders.length > 0 ? orders : mockOrders;

  // Filter orders
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
    const matchesTab = selectedTab === "all" || order.status === selectedTab;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  // Calculate stats
  const stats = {
    total: ordersData.length,
    in_production: ordersData.filter(o => o.status === "in_production").length,
    pending: ordersData.filter(o => o.status === "pending").length,
    urgent: ordersData.filter(o => o.priority === "urgent").length,
    overdue: ordersData.filter(o => {
      const deliveryDate = new Date(o.delivery_date);
      const today = new Date();
      return deliveryDate < today && o.status !== "delivered";
    }).length,
    revenue: ordersData.reduce((sum, o) => sum + o.value, 0)
  };

  const getStatusCounts = () => {
    return {
      all: ordersData.length,
      pending: ordersData.filter(o => o.status === "pending").length,
      confirmed: ordersData.filter(o => o.status === "confirmed").length, 
      in_production: ordersData.filter(o => o.status === "in_production").length,
      ready: ordersData.filter(o => o.status === "ready").length,
      delivered: ordersData.filter(o => o.status === "delivered").length,
    };
  };

  const statusCounts = getStatusCounts();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDaysOverdue = (deliveryDate: string) => {
    const delivery = new Date(deliveryDate);
    const today = new Date();
    const diffTime = today.getTime() - delivery.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gerenciamento de Pedidos
            </h1>
            <p className="text-muted-foreground">
              Agende e acompanhe seus pedidos de produção
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowPrintLabels(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Imprimir Etiquetas
            </Button>
            <Button
              className="bg-biobox-green hover:bg-biobox-green-dark"
              onClick={() => setShowNewOrder(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Pedido
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="flex items-center p-4">
              <Package className="h-8 w-8 text-biobox-green mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="flex items-center p-4">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="flex items-center p-4">
              <User className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Em Produção</p>
                <p className="text-2xl font-bold">{stats.in_production}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="flex items-center p-4">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Prontos</p>
                <p className="text-2xl font-bold">{ordersData.filter(o => o.status === "ready").length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="flex items-center p-4">
              <DollarSign className="h-8 w-8 text-biobox-green mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por número do pedido ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todos os Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="in_production">Em Produção</SelectItem>
                  <SelectItem value="ready">Prontos</SelectItem>
                  <SelectItem value="delivered">Entregues</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todas as Prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Lista de Pedidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">Todos ({statusCounts.all})</TabsTrigger>
                <TabsTrigger value="pending">Pendentes ({statusCounts.pending})</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmados ({statusCounts.confirmed})</TabsTrigger>
                <TabsTrigger value="in_production">Em Produção ({statusCounts.in_production})</TabsTrigger>
                <TabsTrigger value="ready">Prontos ({statusCounts.ready})</TabsTrigger>
                <TabsTrigger value="delivered">Entregues ({statusCounts.delivered})</TabsTrigger>
              </TabsList>
              
              <TabsContent value={selectedTab} className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pedido</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Vendedor</TableHead>
                        <TableHead>Data Produção</TableHead>
                        <TableHead>Data Entrega</TableHead>
                        <TableHead>Progresso</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.seller_name?.split(" ")[0]?.charAt(0)}.
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{order.customer_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.customer_phone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-biobox-green">
                              {order.seller_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.seller_role}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(order.production_date)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(order.delivery_date)}</div>
                            {getDaysOverdue(order.delivery_date) > 0 && (
                              <div className="text-xs text-red-500">
                                {getDaysOverdue(order.delivery_date)} dias atrasado
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-biobox-green h-2 rounded-full transition-all"
                                  style={{ width: `${order.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {order.progress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[order.status]}>
                              {statusLabels[order.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={priorityColors[order.priority]}>
                              {priorityLabels[order.priority]}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(order.value)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {order.status === "pending" && (
                                <>
                                  <Button size="sm" variant="outline">
                                    Aceitar
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Cancelar
                                  </Button>
                                </>
                              )}
                              {order.status === "confirmed" && (
                                <>
                                  <Button size="sm" variant="outline">
                                    Enviar p/ Produção
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Cancelar
                                  </Button>
                                </>
                              )}
                              {order.status === "in_production" && (
                                <Button size="sm" variant="outline">
                                  Controle de Qualidade
                                </Button>
                              )}
                              {order.status === "ready" && (
                                <Button size="sm" variant="outline">
                                  Entregar
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* New Order Dialog */}
        <Dialog open={showNewOrder} onOpenChange={setShowNewOrder}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Novo Pedido</DialogTitle>
            </DialogHeader>
            <NewOrderForm onClose={() => setShowNewOrder(false)} />
          </DialogContent>
        </Dialog>

        {/* Print Labels Dialog */}
        <Dialog open={showPrintLabels} onOpenChange={setShowPrintLabels}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Impressão de Etiquetas</DialogTitle>
            </DialogHeader>
            <ThermalPrintManager />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
