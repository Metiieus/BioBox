import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CustomerForm from "@/components/CustomerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
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
  Calendar,
  Loader2
} from "lucide-react";
import { Customer } from "@/types/customer";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";

export default function CustomersFixed() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "individual" | "business">("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { supabase } = useSupabase();
  const { toast } = useToast();

  // Carregar clientes do Supabase
  const loadCustomers = async () => {
    try {
      setLoading(true);
      console.log("🔄 Carregando clientes do Supabase...");
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Erro ao carregar clientes:", error);
        toast({
          title: "Erro ao carregar clientes",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("✅ Clientes carregados:", data?.length || 0);
      
      // Mapear dados do Supabase para o formato esperado
      const mappedCustomers: Customer[] = (data || []).map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf || '',
        cnpj: customer.cnpj || '',
        type: customer.type as 'individual' | 'business',
        address: {
          street: customer.address?.street || '',
          number: customer.address?.number || '',
          complement: customer.address?.complement || '',
          neighborhood: customer.address?.neighborhood || '',
          city: customer.address?.city || '',
          state: customer.address?.state || '',
          zipCode: customer.address?.zipCode || ''
        },
        status: customer.status as 'active' | 'inactive',
        totalOrders: customer.total_orders || 0,
        totalSpent: customer.total_spent || 0,
        createdAt: new Date(customer.created_at),
        updatedAt: new Date(customer.updated_at)
      }));

      setCustomers(mappedCustomers);
    } catch (error) {
      console.error("❌ Erro inesperado ao carregar clientes:", error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar clientes ao montar o componente
  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesType = filterType === "all" || customer.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSaveCustomer = async (customerData: Partial<Customer>) => {
    try {
      setSaving(true);
      console.log("💾 Salvando cliente:", customerData);

      if (selectedCustomer) {
        // Editar cliente existente
        const { error } = await supabase
          .from('customers')
          .update({
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            cpf: customerData.cpf,
            cnpj: customerData.cnpj,
            type: customerData.type,
            address: customerData.address,
            status: customerData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedCustomer.id);

        if (error) {
          console.error("❌ Erro ao atualizar cliente:", error);
          toast({
            title: "Erro ao atualizar cliente",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        console.log("✅ Cliente atualizado com sucesso");
        toast({
          title: "Cliente atualizado",
          description: "As informações do cliente foram atualizadas com sucesso",
        });
      } else {
        // Criar novo cliente
        const { error } = await supabase
          .from('customers')
          .insert({
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            cpf: customerData.cpf,
            cnpj: customerData.cnpj,
            type: customerData.type,
            address: customerData.address,
            status: customerData.status || 'active',
            total_orders: 0,
            total_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error("❌ Erro ao criar cliente:", error);
          toast({
            title: "Erro ao criar cliente",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        console.log("✅ Cliente criado com sucesso");
        toast({
          title: "Cliente criado",
          description: "O novo cliente foi cadastrado com sucesso",
        });
      }

      // Recarregar lista de clientes
      await loadCustomers();
      
      setShowForm(false);
      setSelectedCustomer(undefined);
    } catch (error) {
      console.error("❌ Erro inesperado ao salvar cliente:", error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível salvar o cliente",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gerenciamento de Clientes (Supabase)
            </h1>
            <p className="text-muted-foreground">
              Cadastre e gerencie seus clientes com persistência no banco
            </p>
          </div>
          <Button
            className="bg-biobox-green hover:bg-biobox-green-dark"
            onClick={() => setShowForm(true)}
            disabled={saving}
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
                          disabled={saving}
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
