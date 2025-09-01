import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import OrderForm from "@/components/OrderForm";
import ProductionCalendar from "@/components/ProductionCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Filter,
  Package,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  User,
  TrendingUp
} from "lucide-react";
import { Order, mockOrders, statusLabels, statusColors, priorityColors } from "@/types/order";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Order['status']>("all");

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

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowForm(true);
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
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

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
              <span>📅 {orders.filter(o => {
                const today = new Date();
                return isSameDay(o.scheduledDate, today) || (o.deliveryDate && isSameDay(o.deliveryDate, today));
              }).length} hoje</span>
              <span>🔄 {inProductionOrders} em produção</span>
              <span>⏳ {pendingOrders} pendentes</span>
            </div>
          </div>
          <Button
            className="bg-biobox-green hover:bg-biobox-green-dark"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>

        {/* Quick Calendar and Stats Cards */}
        <div className="grid gap-4 lg:grid-cols-5">
          <QuickCalendar
            orders={orders}
            onDateClick={(date) => {
              // Switch to calendar tab and select the date
              console.log("Selected date:", date);
            }}
            className="lg:col-span-1"
          />
          <div className="lg:col-span-4 grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-biobox-green" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-foreground">{pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Em Produção</p>
                  <p className="text-2xl font-bold text-foreground">{inProductionOrders}</p>
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
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="orders">Lista de Pedidos</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <ProductionCalendar
              orders={orders}
              onOrderClick={handleEditOrder}
            />
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Lista de Pedidos</span>
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar pedidos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={statusFilter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter("all")}
                      >
                        Todos
                      </Button>
                      <Button
                        variant={statusFilter === "pending" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter("pending")}
                      >
                        Pendentes
                      </Button>
                      <Button
                        variant={statusFilter === "in_production" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter("in_production")}
                      >
                        Em Produção
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Produtos</TableHead>
                      <TableHead>Data Produção</TableHead>
                      <TableHead>Data Entrega</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Status</TableHead>
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
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.products[0]?.productName}
                            {order.products.length > 1 && ` +${order.products.length - 1}`}
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
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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
        {showForm && (
          <OrderForm
            order={selectedOrder}
            onSave={handleSaveOrder}
            onCancel={() => {
              setShowForm(false);
              setSelectedOrder(undefined);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
