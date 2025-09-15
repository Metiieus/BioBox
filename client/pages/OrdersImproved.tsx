import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import NewOrderForm from "@/components/NewOrderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Package,
  Clock,
  DollarSign,
  CheckCircle,
  User,
  Calendar,
  Filter,
  Download,
  Printer,
  Eye,
  AlertTriangle,
  Truck,
  Factory,
  FileText,
  MoreHorizontal
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface OrderProduct {
  id: string;
  productName: string;
  model: string;
  size: string;
  color: string;
  fabric: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  sellerId: string;
  sellerName: string;
  status: 'pending' | 'confirmed' | 'in_production' | 'quality_check' | 'ready' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  totalAmount: number;
  scheduledDate: Date;
  deliveryDate?: Date;
  completedDate?: Date;
  productionProgress: number;
  assignedOperator?: string;
  products: OrderProduct[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'João Silva',
    customerPhone: '(11) 99999-9999',
    customerEmail: 'joao.silva@email.com',
    sellerId: '2',
    sellerName: 'Carlos Vendedor',
    status: 'in_production',
    priority: 'medium',
    totalAmount: 4200.00,
    scheduledDate: new Date('2024-12-20'),
    deliveryDate: new Date('2024-12-25'),
    productionProgress: 65,
    assignedOperator: 'Carlos M.',
    products: [
      {
        id: '1-1',
        productName: 'Cama Luxo Premium',
        model: 'Luxo Premium',
        size: 'Queen',
        color: 'Marrom',
        fabric: 'Veludo Premium',
        quantity: 1,
        unitPrice: 4200.00,
        totalPrice: 4200.00
      }
    ],
    notes: 'Cliente solicitou entrega no período da manhã',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Móveis Premium Ltda',
    customerPhone: '(11) 88888-8888',
    customerEmail: 'contato@moveispremium.com.br',
    sellerId: '3',
    sellerName: 'Ana Vendedora',
    status: 'confirmed',
    priority: 'high',
    totalAmount: 12600.00,
    scheduledDate: new Date('2024-12-18'),
    deliveryDate: new Date('2024-12-30'),
    productionProgress: 0,
    products: [
      {
        id: '2-1',
        productName: 'Cama King Premium',
        model: 'Premium Deluxe',
        size: 'King',
        color: 'Branco',
        fabric: 'Courino Premium',
        quantity: 3,
        unitPrice: 4200.00,
        totalPrice: 12600.00
      }
    ],
    notes: 'Pedido corporativo - prazo flexível',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12')
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Maria Santos',
    customerPhone: '(11) 77777-7777',
    customerEmail: 'maria.santos@email.com',
    sellerId: '2',
    sellerName: 'Carlos Vendedor',
    status: 'ready',
    priority: 'low',
    totalAmount: 2800.00,
    scheduledDate: new Date('2024-12-15'),
    deliveryDate: new Date('2024-12-22'),
    completedDate: new Date('2024-12-20'),
    productionProgress: 100,
    assignedOperator: 'Ana L.',
    products: [
      {
        id: '3-1',
        productName: 'Cama Standard',
        model: 'Standard Classic',
        size: 'Casal',
        color: 'Marrom',
        fabric: 'Tecido',
        quantity: 1,
        unitPrice: 2800.00,
        totalPrice: 2800.00
      }
    ],
    notes: 'Primeira compra da cliente',
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Pedro Costa',
    customerPhone: '(11) 66666-6666',
    customerEmail: 'pedro.costa@email.com',
    sellerId: '3',
    sellerName: 'Ana Vendedora',
    status: 'pending',
    priority: 'urgent',
    totalAmount: 5600.00,
    scheduledDate: new Date('2024-12-22'),
    deliveryDate: new Date('2024-12-28'),
    productionProgress: 0,
    products: [
      {
        id: '4-1',
        productName: 'Cama Luxo Premium',
        model: 'Luxo Premium',
        size: 'King',
        color: 'Preto',
        fabric: 'Couro',
        quantity: 1,
        unitPrice: 5600.00,
        totalPrice: 5600.00
      }
    ],
    notes: 'Cliente VIP - prioridade máxima',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14')
  }
];

const statusLabels = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  in_production: 'Em Produção',
  quality_check: 'Controle de Qualidade',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
};

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_production: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  quality_check: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  ready: 'bg-green-500/10 text-green-500 border-green-500/20',
  delivered: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
};

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente'
};

export default function OrdersImproved() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Order['status']>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Order['priority']>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { hasPermission } = useAuth();

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
      const matchesTab = activeTab === "all" || order.status === activeTab;
      return matchesSearch && matchesStatus && matchesPriority && matchesTab;
    });
  }, [orders, searchTerm, statusFilter, priorityFilter, activeTab]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR');
  };

  const getDaysUntilDelivery = (deliveryDate?: Date) => {
    if (!deliveryDate) return null;
    const today = new Date();
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_production':
        return <Factory className="h-4 w-4" />;
      case 'quality_check':
        return <Eye className="h-4 w-4" />;
      case 'ready':
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <Truck className="h-4 w-4" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const inProductionOrders = orders.filter(o => o.status === 'in_production').length;
    const readyOrders = orders.filter(o => o.status === 'ready').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const urgentOrders = orders.filter(o => o.priority === 'urgent').length;
    const overdueOrders = orders.filter(o => 
      o.deliveryDate && new Date() > o.deliveryDate && !['delivered', 'cancelled'].includes(o.status)
    ).length;

    return {
      totalOrders,
      pendingOrders,
      inProductionOrders,
      readyOrders,
      totalRevenue,
      urgentOrders,
      overdueOrders
    };
  }, [orders]);

  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gerenciamento de Pedidos
            </h1>
            <p className="text-muted-foreground">
              Agende e acompanhe seus pedidos de produção
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span>📦 {stats.totalOrders} total</span>
              <span>🔄 {stats.inProductionOrders} em produção</span>
              <span>⏳ {stats.pendingOrders} pendentes</span>
              {stats.urgentOrders > 0 && <span className="text-red-500">🚨 {stats.urgentOrders} urgentes</span>}
              {stats.overdueOrders > 0 && <span className="text-red-500">⚠️ {stats.overdueOrders} atrasados</span>}
            </div>
          </div>
          {hasPermission('orders', 'create') && (
            <Button 
              className="bg-biobox-green hover:bg-biobox-green-dark"
              onClick={() => setShowNewOrderForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Pedido
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-biobox-green" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Factory className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Em Produção</p>
                  <p className="text-2xl font-bold text-foreground">{stats.inProductionOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Prontos</p>
                  <p className="text-2xl font-bold text-foreground">{stats.readyOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número do pedido ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Prioridades</SelectItem>
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table with Tabs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Lista de Pedidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">Todos ({orders.length})</TabsTrigger>
                <TabsTrigger value="pending">Pendentes ({stats.pendingOrders})</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmados ({orders.filter(o => o.status === 'confirmed').length})</TabsTrigger>
                <TabsTrigger value="in_production">Em Produção ({stats.inProductionOrders})</TabsTrigger>
                <TabsTrigger value="ready">Prontos ({stats.readyOrders})</TabsTrigger>
                <TabsTrigger value="delivered">Entregues ({orders.filter(o => o.status === 'delivered').length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Produtos</TableHead>
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
                    {filteredOrders.map((order) => {
                      const daysUntilDelivery = getDaysUntilDelivery(order.deliveryDate);
                      const isOverdue = daysUntilDelivery !== null && daysUntilDelivery < 0 && !['delivered', 'cancelled'].includes(order.status);
                      
                      return (
                        <TableRow key={order.id} className={isOverdue ? "bg-red-50 dark:bg-red-950/20" : ""}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${priorityColors[order.priority]}`}
                              />
                              <div>
                                <div className="font-medium">{order.orderNumber}</div>
                                {order.assignedOperator && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <User className="h-3 w-3 mr-1" />
                                    {order.assignedOperator}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customerName}</div>
                              <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-biobox-green">{order.sellerName}</div>
                              <div className="text-xs text-muted-foreground">Vendedor</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {order.products.length} produto(s)
                              <div className="text-xs text-muted-foreground">
                                {order.products.reduce((sum, p) => sum + p.quantity, 0)} unidades
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(order.scheduledDate)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {order.deliveryDate ? formatDate(order.deliveryDate) : '-'}
                              {daysUntilDelivery !== null && (
                                <div className={`text-xs ${isOverdue ? 'text-red-500' : daysUntilDelivery <= 3 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                                  {isOverdue ? `${Math.abs(daysUntilDelivery)} dias atrasado` : 
                                   daysUntilDelivery === 0 ? 'Hoje' :
                                   daysUntilDelivery === 1 ? 'Amanhã' :
                                   `${daysUntilDelivery} dias`}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Progress value={order.productionProgress} className="h-2" />
                              <div className="text-xs text-muted-foreground">
                                {order.productionProgress}%
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusColors[order.status]}
                            >
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(order.status)}
                                <span>{statusLabels[order.status]}</span>
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${priorityColors[order.priority]}/10 text-${priorityColors[order.priority].replace('bg-', '')} border-${priorityColors[order.priority].replace('bg-', '')}/20`}
                            >
                              {priorityLabels[order.priority]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{formatCurrency(order.totalAmount)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {hasPermission('orders', 'edit') && (
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Detalhes do Pedido {selectedOrder?.orderNumber}</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações do Cliente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Nome</Label>
                        <p className="text-sm">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Telefone</Label>
                        <p className="text-sm">{selectedOrder.customerPhone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm">{selectedOrder.customerEmail}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status do Pedido</Label>
                        <Badge className={statusColors[selectedOrder.status]}>
                          {statusLabels[selectedOrder.status]}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produtos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Modelo</TableHead>
                          <TableHead>Tamanho</TableHead>
                          <TableHead>Cor</TableHead>
                          <TableHead>Tecido</TableHead>
                          <TableHead>Qtd</TableHead>
                          <TableHead>Valor Unit.</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.productName}</TableCell>
                            <TableCell>{product.model}</TableCell>
                            <TableCell>{product.size}</TableCell>
                            <TableCell>{product.color}</TableCell>
                            <TableCell>{product.fabric}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>{formatCurrency(product.unitPrice)}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(product.totalPrice)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Order Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cronograma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Data de Criação</Label>
                        <p className="text-sm">{formatDateTime(selectedOrder.createdAt)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Última Atualização</Label>
                        <p className="text-sm">{formatDateTime(selectedOrder.updatedAt)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Data de Produção</Label>
                        <p className="text-sm">{formatDate(selectedOrder.scheduledDate)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Data de Entrega</Label>
                        <p className="text-sm">{selectedOrder.deliveryDate ? formatDate(selectedOrder.deliveryDate) : 'Não definida'}</p>
                      </div>
                      {selectedOrder.completedDate && (
                        <div>
                          <Label className="text-sm font-medium">Data de Conclusão</Label>
                          <p className="text-sm">{formatDate(selectedOrder.completedDate)}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium">Progresso da Produção</Label>
                        <div className="space-y-1">
                          <Progress value={selectedOrder.productionProgress} className="h-2" />
                          <p className="text-sm">{selectedOrder.productionProgress}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {selectedOrder.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Observações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar PDF
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  {hasPermission('orders', 'edit') && (
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Pedido
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* New Order Form */}
        <NewOrderForm
          open={showNewOrderForm}
          onOpenChange={setShowNewOrderForm}
          onOrderCreated={handleOrderCreated}
        />
      </div>
    </DashboardLayout>
  );
}

