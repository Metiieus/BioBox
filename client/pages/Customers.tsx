import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CustomerForm from "@/components/CustomerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Plus,
  Search,
  Edit,
  Eye,
  Filter,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { Customer, mockCustomers } from "@/types/customer";
import { cn } from "@/lib/utils";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "individual" | "business">("all");

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesType = filterType === "all" || customer.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSaveCustomer = (customerData: Partial<Customer>) => {
    if (selectedCustomer) {
      // Edit existing customer
      setCustomers(prev => prev.map(customer =>
        customer.id === selectedCustomer.id
          ? { ...customer, ...customerData, updatedAt: new Date() }
          : customer
      ));
    } else {
      // Add new customer
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        totalOrders: 0,
        totalSpent: 0
      } as Customer;
      setCustomers(prev => [newCustomer, ...prev]);
    }
    setShowForm(false);
    setSelectedCustomer(undefined);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gerenciamento de Clientes
            </h1>
            <p className="text-muted-foreground">
              Cadastre e gerencie seus clientes
            </p>
          </div>
          <Button
            className="bg-biobox-green hover:bg-biobox-green-dark"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-biobox-green" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
                  <p className="text-2xl font-bold text-foreground">{customers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pessoa Física</p>
                  <p className="text-2xl font-bold text-foreground">
                    {customers.filter(c => c.type === 'individual').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pessoa Jurídica</p>
                  <p className="text-2xl font-bold text-foreground">
                    {customers.filter(c => c.type === 'business').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {customers.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Lista de Clientes</span>
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("all")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterType === "individual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("individual")}
                  >
                    <User className="h-4 w-4 mr-1" />
                    PF
                  </Button>
                  <Button
                    variant={filterType === "business" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("business")}
                  >
                    <Building className="h-4 w-4 mr-1" />
                    PJ
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-biobox-green/10 text-biobox-green">
                            {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer.type === 'individual' ? customer.cpf : customer.cnpj}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {customer.type === 'individual' ? (
                          <User className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Building className="h-4 w-4 text-orange-500" />
                        )}
                        <span className="text-sm">
                          {customer.type === 'individual' ? 'PF' : 'PJ'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.address.city}, {customer.address.state}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{customer.totalOrders}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.status === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          customer.status === 'active'
                            ? 'bg-biobox-green/10 text-biobox-green border-biobox-green/20'
                            : ''
                        )}
                      >
                        {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Form Modal */}
        {showForm && (
          <CustomerForm
            customer={selectedCustomer}
            onSave={handleSaveCustomer}
            onCancel={() => {
              setShowForm(false);
              setSelectedCustomer(undefined);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
