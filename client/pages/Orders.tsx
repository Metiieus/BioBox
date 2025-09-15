import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import OrderForm from "@/components/OrderForm";
import ProductionCalendar from "@/components/ProductionCalendar";
import FragmentProgress from "@/components/FragmentProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  TrendingUp,
  Square
} from "lucide-react";
import { Order, mockOrders, statusLabels, statusColors, priorityColors } from "@/types/order";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [selectedFragmentOrder, setSelectedFragmentOrder] = useState<Order | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Order['status']>("all");
  const { hasPermission } = useAuth();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveOrder = (orderData: Partial<Order>) => {
    if (selectedOrder) {
      // Edit existing order
      setOrders(prev => prev.map(order =>
        order.id === selectedOrder.id
          ? { ...order, ...orderData, updatedAt: new Date() }
          : order
      ));
    } else {
      // Add new order
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      } as Order;
      setOrders(prev => [newOrder, ...prev]);
    }
    setShowForm(false);
    setSelectedOrder(undefined);

    // Force calendar to refresh by updating the key or triggering re-render
    // The calendar will automatically show the new markers since it uses the orders prop
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowForm(true);
  };

  const handleViewFragments = (order: Order) => {
    setSelectedFragmentOrder(order);
  };

  const handleUpdateFragment = (fragmentId: string, updates: any) => {
    if (!selectedFragmentOrder) return;

    setOrders(prev => prev.map(order => {
      if (order.id === selectedFragmentOrder.id && order.fragments) {
        const updatedFragments = order.fragments.map(fragment =>
          fragment.id === fragmentId ? { ...fragment, ...updates } : fragment
        );
        
        // Update order progress based on fragments
        const totalProgress = updatedFragments.reduce((sum, f) => sum + f.progress, 0) / updatedFragments.length;
        const allCompleted = updatedFragments.every(f => f.status === 'completed');
        
        return {
          ...order,
          fragments: updatedFragments,
          productionProgress: totalProgress,
          status: allCompleted ? 'ready' as const : order.status,
          updatedAt: new Date()
        };
      }
      return order;
    }));

    // Update selected order for real-time UI updates
    setSelectedFragmentOrder(prev => {
      if (!prev || !prev.fragments) return prev;
      return {
        ...prev,
        fragments: prev.fragments.map(fragment =>
          fragment.id === fragmentId ? { ...fragment, ...updates } : fragment
        )
      };
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const inProductionOrders = orders.filter(o => o.status === 'in_production').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gerenciamento de Pedidos
            </h1>
            <p className="text-muted-foreground">
              Agende e acompanhe seus pedidos de produção
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <span>📅 {orders.filter(o => {
                const today = new Date();
                return isSameDay(o.scheduledDate, today) || (o.deliveryDate && isSameDay(o.deliveryDate, today));
              }).length} hoje</span>
              <span>🔄 {inProductionOrders} em produção</span>
              <span>⏳ {pendingOrders} pendentes</span>
              <span>📦 {orders.filter(o => o.isFragmented).length} fragmentados</span>
            </div>
          </div>
          {hasPermission('orders', 'create') && (
            <Button
              className="bg-biobox-green hover:bg-biobox-green-dark"
              onClick={() => setShowForm(true)}
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
                <User className="h-8 w-8 text-purple-500" />
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
                <DollarSign className="h-8 w-8 text-biobox-green" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por número do pedido ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todas as Prioridades" />
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

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lista de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">Todos ({stats.totalOrders})</TabsTrigger>
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
                          <div className="flex items-center space-x-2">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                priorityColors[order.priority]
                              )}
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
                          <div className="font-medium">{order.customerName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.products.length} produto(s)
                            {order.isFragmented && (
                              <Badge variant="outline" className="ml-2 text-xs bg-purple-500/10 text-purple-500 border-purple-500/20">
                                Fragmentado
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.products[0]?.productName}
                            {order.products.length > 1 && ` +${order.products.length - 1}`}
                            {order.totalQuantity && (
                              <span className="block">Total: {order.totalQuantity} unidades</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(order.scheduledDate)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.deliveryDate ? formatDate(order.deliveryDate) : '-'}
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
                            className={cn("text-xs", statusColors[order.status])}
                          >
                            {statusLabels[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatCurrency(order.totalAmount)}</div>
                          {order.isFragmented && order.fragments && (
                            <div className="text-xs text-muted-foreground">
                              Liberado: {formatCurrency(
                                order.fragments
                                  .filter(f => f.status === 'completed')
                                  .reduce((sum, f) => sum + f.value, 0)
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {hasPermission('orders', 'edit') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {order.isFragmented && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewFragments(order)}
                                title="Ver fragmentos"
                              >
                                <Package className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Form Modal */}
        {showForm && hasPermission('orders', 'create') && (
          <OrderForm
            order={selectedOrder}
            onSave={handleSaveOrder}
            onCancel={() => {
              setShowForm(false);
              setSelectedOrder(undefined);
            }}
          />
        )}

        {/* Fragment Progress Modal */}
        {selectedFragmentOrder && selectedFragmentOrder.fragments && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Fragmentos - {selectedFragmentOrder.orderNumber}</span>
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSelectedFragmentOrder(undefined)}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <FragmentProgress
                  fragments={selectedFragmentOrder.fragments}
                  onUpdateFragment={handleUpdateFragment}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}