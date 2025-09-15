import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Minus, Search, User, Package, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Product {
  id: string;
  name: string;
  model: string;
  basePrice: number;
  sizes: string[];
  colors: string[];
  fabrics: string[];
}

interface OrderProduct {
  id: string;
  productId: string;
  productName: string;
  model: string;
  size: string;
  color: string;
  fabric: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: 'individual' | 'company';
}

interface NewOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated: (order: any) => void;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cama Luxo Premium',
    model: 'Luxo Premium',
    basePrice: 3750.00,
    sizes: ['Solteiro', 'Casal', 'Queen', 'King'],
    colors: ['Branco', 'Marrom', 'Preto', 'Cinza'],
    fabrics: ['Veludo Premium', 'Courino Premium', 'Couro']
  },
  {
    id: '2',
    name: 'Cama Standard',
    model: 'Standard Classic',
    basePrice: 2100.00,
    sizes: ['Solteiro', 'Casal', 'Queen'],
    colors: ['Branco', 'Marrom', 'Cinza'],
    fabrics: ['Tecido', 'Courino']
  },
  {
    id: '3',
    name: 'Cama King Premium',
    model: 'Premium Deluxe',
    basePrice: 4200.00,
    sizes: ['King'],
    colors: ['Branco', 'Preto', 'Marrom'],
    fabrics: ['Veludo Premium', 'Courino Premium', 'Couro']
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    type: 'individual'
  },
  {
    id: '2',
    name: 'Móveis Premium Ltda',
    phone: '(11) 88888-8888',
    email: 'contato@moveispremium.com.br',
    type: 'company'
  },
  {
    id: '3',
    name: 'Maria Santos',
    phone: '(11) 77777-7777',
    email: 'maria.santos@email.com',
    type: 'individual'
  }
];

export default function NewOrderForm({ open, onOpenChange, onOrderCreated }: NewOrderFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'individual' as 'individual' | 'company'
  });
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [orderDetails, setOrderDetails] = useState({
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    scheduledDate: '',
    deliveryDate: '',
    notes: ''
  });
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const addProduct = () => {
    const newProduct: OrderProduct = {
      id: `temp-${Date.now()}`,
      productId: '',
      productName: '',
      model: '',
      size: '',
      color: '',
      fabric: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    setOrderProducts([...orderProducts, newProduct]);
  };

  const removeProduct = (index: number) => {
    setOrderProducts(orderProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const updated = [...orderProducts];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-fill product details when product is selected
    if (field === 'productId') {
      const product = mockProducts.find(p => p.id === value);
      if (product) {
        updated[index] = {
          ...updated[index],
          productName: product.name,
          model: product.model,
          unitPrice: product.basePrice,
          totalPrice: product.basePrice * updated[index].quantity
        };
      }
    }

    // Recalculate total when quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].totalPrice = updated[index].quantity * updated[index].unitPrice;
    }

    setOrderProducts(updated);
  };

  const calculateTotal = () => {
    return orderProducts.reduce((sum, product) => sum + product.totalPrice, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const generateOrderNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}-${random}`;
  };

  const handleCreateOrder = () => {
    if (!selectedCustomer && !newCustomer.name) {
      alert('Selecione um cliente ou cadastre um novo');
      return;
    }

    if (orderProducts.length === 0) {
      alert('Adicione pelo menos um produto ao pedido');
      return;
    }

    if (!orderDetails.scheduledDate) {
      alert('Defina a data de produção');
      return;
    }

    const customer = selectedCustomer || {
      id: `temp-${Date.now()}`,
      ...newCustomer
    };

    const newOrder = {
      id: `temp-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      sellerId: user?.id || '',
      sellerName: user?.name || '',
      status: 'pending' as const,
      priority: orderDetails.priority,
      totalAmount: calculateTotal(),
      scheduledDate: new Date(orderDetails.scheduledDate),
      deliveryDate: orderDetails.deliveryDate ? new Date(orderDetails.deliveryDate) : undefined,
      productionProgress: 0,
      products: orderProducts,
      notes: orderDetails.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onOrderCreated(newOrder);
    onOpenChange(false);
    
    // Reset form
    setStep(1);
    setSelectedCustomer(null);
    setNewCustomer({ name: '', phone: '', email: '', type: 'individual' });
    setOrderProducts([]);
    setOrderDetails({ priority: 'medium', scheduledDate: '', deliveryDate: '', notes: '' });
    setShowNewCustomerForm(false);
    setCustomerSearch('');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Selecionar Cliente</h3>
              <Button
                variant="outline"
                onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </div>

            {showNewCustomerForm ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cadastrar Novo Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Nome/Razão Social</Label>
                      <Input
                        id="customerName"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="Digite o nome do cliente"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerType">Tipo</Label>
                      <Select
                        value={newCustomer.type}
                        onValueChange={(value: 'individual' | 'company') => 
                          setNewCustomer({ ...newCustomer, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Pessoa Física</SelectItem>
                          <SelectItem value="company">Pessoa Jurídica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerPhone">Telefone</Label>
                      <Input
                        id="customerPhone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="cliente@email.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente por nome, telefone ou email..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredCustomers.map((customer) => (
                    <Card
                      key={customer.id}
                      className={`cursor-pointer transition-colors ${
                        selectedCustomer?.id === customer.id
                          ? 'border-biobox-green bg-biobox-green/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.phone} • {customer.email}
                            </div>
                          </div>
                          <Badge variant={customer.type === 'company' ? 'default' : 'secondary'}>
                            {customer.type === 'company' ? 'PJ' : 'PF'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Produtos do Pedido</h3>
              <Button onClick={addProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            {orderProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum produto adicionado</p>
                <p className="text-sm">Clique em "Adicionar Produto" para começar</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Cor</TableHead>
                      <TableHead>Tecido</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Valor Unit.</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderProducts.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Select
                            value={product.productId}
                            onValueChange={(value) => updateProduct(index, 'productId', value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Selecionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockProducts.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={product.size}
                            onValueChange={(value) => updateProduct(index, 'size', value)}
                            disabled={!product.productId}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Tam." />
                            </SelectTrigger>
                            <SelectContent>
                              {product.productId && mockProducts
                                .find(p => p.id === product.productId)
                                ?.sizes.map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={product.color}
                            onValueChange={(value) => updateProduct(index, 'color', value)}
                            disabled={!product.productId}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Cor" />
                            </SelectTrigger>
                            <SelectContent>
                              {product.productId && mockProducts
                                .find(p => p.id === product.productId)
                                ?.colors.map((color) => (
                                  <SelectItem key={color} value={color}>
                                    {color}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={product.fabric}
                            onValueChange={(value) => updateProduct(index, 'fabric', value)}
                            disabled={!product.productId}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Tecido" />
                            </SelectTrigger>
                            <SelectContent>
                              {product.productId && mockProducts
                                .find(p => p.id === product.productId)
                                ?.fabrics.map((fabric) => (
                                  <SelectItem key={fabric} value={fabric}>
                                    {fabric}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={product.unitPrice}
                            onChange={(e) => updateProduct(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(product.totalPrice)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end">
                  <Card className="w-64">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total do Pedido:</span>
                        <span className="text-lg font-bold text-biobox-green">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalhes do Pedido</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={orderDetails.priority}
                  onValueChange={(value: any) => setOrderDetails({ ...orderDetails, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="scheduledDate">Data de Produção *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={orderDetails.scheduledDate}
                  onChange={(e) => setOrderDetails({ ...orderDetails, scheduledDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deliveryDate">Data de Entrega (Opcional)</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={orderDetails.deliveryDate}
                onChange={(e) => setOrderDetails({ ...orderDetails, deliveryDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={orderDetails.notes}
                onChange={(e) => setOrderDetails({ ...orderDetails, notes: e.target.value })}
                placeholder="Observações sobre o pedido..."
                rows={3}
              />
            </div>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span className="font-medium">
                    {selectedCustomer?.name || newCustomer.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vendedor:</span>
                  <span className="font-medium text-biobox-green">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Produtos:</span>
                  <span>{orderProducts.length} item(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantidade Total:</span>
                  <span>{orderProducts.reduce((sum, p) => sum + p.quantity, 0)} unidades</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-biobox-green">{formatCurrency(calculateTotal())}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return selectedCustomer || (newCustomer.name && newCustomer.phone);
      case 2:
        return orderProducts.length > 0 && orderProducts.every(p => 
          p.productId && p.size && p.color && p.fabric && p.quantity > 0 && p.unitPrice > 0
        );
      case 3:
        return orderDetails.scheduledDate;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Novo Pedido</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-biobox-green text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepNumber}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= stepNumber ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {stepNumber === 1 && 'Cliente'}
                  {stepNumber === 2 && 'Produtos'}
                  {stepNumber === 3 && 'Detalhes'}
                </span>
                {stepNumber < 3 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    step > stepNumber ? 'bg-biobox-green' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Anterior
            </Button>
            
            <div className="space-x-2">
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceedToNextStep()}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={handleCreateOrder}
                  disabled={!canProceedToNextStep()}
                  className="bg-biobox-green hover:bg-biobox-green-dark"
                >
                  Criar Pedido
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

