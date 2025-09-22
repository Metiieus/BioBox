import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  Edit,
  Package,
  Clock,
  DollarSign,
  CheckCircle,
  User
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: 'pending' | 'confirmed' | 'in_production' | 'ready' | 'delivered';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  totalAmount: number;
  scheduledDate: Date;
  deliveryDate?: Date;
  productionProgress: number;
  assignedOperator?: string;
  productCount: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'João Silva',
    status: 'in_production',
    priority: 'medium',
    totalAmount: 4200.00,
    scheduledDate: new Date('2024-12-20'),
    deliveryDate: new Date('2024-12-25'),
    productionProgress: 65,
    assignedOperator: 'Carlos M.',
    productCount: 1
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Móveis Premium Ltda',
    status: 'confirmed',
    priority: 'high',
    totalAmount: 12600.00,
    scheduledDate: new Date('2024-12-18'),
    deliveryDate: new Date('2024-12-30'),
    productionProgress: 0,
    productCount: 3
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Maria Santos',
    status: 'ready',
    priority: 'low',
    totalAmount: 2800.00,
    scheduledDate: new Date('2024-12-15'),
    deliveryDate: new Date('2024-12-22'),
    productionProgress: 100,
    assignedOperator: 'Ana L.',
    productCount: 1
  }
];

const statusLabels = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  in_production: 'Em Produção',
  ready: 'Pronto',
  delivered: 'Entregue'
};

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_production: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  ready: 'bg-green-500/10 text-green-500 border-green-500/20',
  delivered: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
};

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

export default function OrdersFixed() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Order['status']>("all");
  const { hasPermission } = useAuth();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
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
              <span>📦 {totalOrders} total</span>
              <span>🔄 {inProductionOrders} em produção</span>
              <span>⏳ {pendingOrders} pendentes</span>
            </div>
          </div>
          {hasPermission('orders', 'create') && (
            <Button className="bg-biobox-green hover:bg-biobox-green-dark">
              <Plus className="h-4 w-4 mr-2" />
              Novo Pedido
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
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

        {/* Orders Table */}
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
                      <div className="font-medium">{order.customerName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.productCount} produto(s)
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
                        className={statusColors[order.status]}
                      >
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(order.totalAmount)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {hasPermission('orders', 'edit') && (
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
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
      </div>
    </DashboardLayout>
  );
}

