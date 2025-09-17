import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProductForm from "@/components/ProductForm";
import BarcodeGenerator from "@/components/BarcodeGenerator";
import ThermalPrintManager from "@/components/ThermalPrintManager";
import {
  Package,
  Plus,
  QrCode,
  Search,
  Edit,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Box,
  Wrench,
  Barcode,
  Image,
  DollarSign,
  Palette,
  Ruler
} from "lucide-react";
import {
  Product,
  RawMaterial,
  mockProducts,
  mockRawMaterials,
  categoryLabels,
  statusLabels,
  statusColors,
  materialCategoryLabels,
  unitLabels
} from "@/types/inventory";
import { cn } from "@/lib/utils";

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(mockRawMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaterials = rawMaterials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p =>
    p.models.some(m => m.stockQuantity <= m.minimumStock)
  ).length;
  const lowStockMaterials = rawMaterials.filter(m => m.quantity <= m.minimumStock).length;

  const ProductCard = ({ product }: { product: Product }) => {
    const totalStock = product.models.reduce((sum, model) => sum + model.stockQuantity, 0);
    const lowStock = product.models.some(model => model.stockQuantity <= model.minimumStock);

    return (
      <Card
        className="bg-card border-border hover:bg-muted/5 transition-colors cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.sku}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge
                variant="outline"
                className={cn("text-xs", statusColors[product.status])}
              >
                {statusLabels[product.status]}
              </Badge>
              {lowStock && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Estoque baixo
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Estoque Total:</span>
              <span className="font-medium">{totalStock} unidades</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Preço Base:</span>
              <span className="font-medium">{formatCurrency(product.basePrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Margem:</span>
              <span className="font-medium">{product.margin}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Modelos:</span>
              <span className="font-medium">{product.models.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const MaterialCard = ({ material }: { material: RawMaterial }) => {
    const stockPercentage = (material.quantity / (material.minimumStock * 2)) * 100;
    const isLowStock = material.quantity <= material.minimumStock;

    return (
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-medium">{material.name}</h4>
              <p className="text-sm text-muted-foreground">
                {materialCategoryLabels[material.category]}
              </p>
            </div>
            {isLowStock && (
              <Badge variant="outline" className="text-red-500 border-red-500/20 bg-red-500/10">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Baixo
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Quantidade:</span>
              <span className="font-medium">
                {material.quantity} {unitLabels[material.unit]}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Mínimo:</span>
              <span className="font-medium">
                {material.minimumStock} {unitLabels[material.unit]}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Fornecedor:</span>
              <span className="font-medium">{material.supplier}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Custo Unit.:</span>
              <span className="font-medium">{formatCurrency(material.unitCost)}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Nível de Estoque</span>
                <span>{Math.min(100, Math.round(stockPercentage))}%</span>
              </div>
              <Progress
                value={Math.min(100, stockPercentage)}
                className={cn(
                  "h-2",
                  isLowStock && "bg-red-500/20"
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Produtos e Estoque
            </h1>
            <p className="text-muted-foreground">
              Gerencie produtos, estoque e códigos de barras
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowBarcode(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Gerar Etiquetas
            </Button>
            <Button variant="outline" onClick={() => setShowLabels(true)}>
              <Barcode className="h-4 w-4 mr-2" />
              Imprimir Códigos
            </Button>
            <Button className="bg-biobox-green hover:bg-biobox-green-dark" onClick={() => setShowProductForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-biobox-green" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
                  <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Produtos Ativos</p>
                  <p className="text-2xl font-bold text-foreground">{activeProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-foreground">{lowStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Box className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Materiais Baixos</p>
                  <p className="text-2xl font-bold text-foreground">{lowStockMaterials}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="products">Catálogo de Produtos</TabsTrigger>
              <TabsTrigger value="materials">Matéria Prima</TabsTrigger>
              <TabsTrigger value="barcode">Códigos de Barra</TabsTrigger>
            </TabsList>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          <TabsContent value="products">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMaterials.map(material => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="barcode">
            <div className="space-x-2">
              <Button className="bg-biobox-green hover:bg-biobox-green-dark" onClick={() => setShowBarcode(true)}>
                Gerar Códigos
              </Button>
              <Button variant="outline" onClick={() => setShowLabels(true)}>
                Imprimir Etiquetas
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Detalhes do Produto</span>
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(null)}>
                    <Package className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SKU</p>
                    <p className="font-medium">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                    <p className="font-medium">{categoryLabels[selectedProduct.category]}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={statusColors[selectedProduct.status]}>
                      {statusLabels[selectedProduct.status]}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Descrição</p>
                  <p className="text-sm bg-muted/5 p-3 rounded-lg">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Preço Base</p>
                    <p className="font-medium">{formatCurrency(selectedProduct.basePrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Custo</p>
                    <p className="font-medium">{formatCurrency(selectedProduct.costPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Margem</p>
                    <p className="font-medium">{selectedProduct.margin}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Modelos Disponíveis</p>
                  <div className="space-y-3">
                    {selectedProduct.models.map(model => (
                      <Card key={model.id} className="bg-muted/5">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{model.name}</h4>
                            <Badge variant={model.isActive ? "default" : "secondary"}>
                              {model.isActive ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Estoque</p>
                              <p className="font-medium">{model.stockQuantity}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Mínimo</p>
                              <p className="font-medium">{model.minimumStock}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Modificador</p>
                              <p className="font-medium">{model.priceModifier}x</p>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Tamanhos:</p>
                              <div className="flex flex-wrap gap-1">
                                {model.sizes.map(size => (
                                  <Badge key={size.id} variant="outline" className="text-xs">
                                    {size.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Cores:</p>
                              <div className="flex flex-wrap gap-1">
                                {model.colors.map(color => (
                                  <Badge key={color.id} variant="outline" className="text-xs">
                                    {color.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Dialogs */}
        <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
          <DialogContent>
            <ProductForm
              onSave={(p) => {
                setProducts(prev => [p, ...prev]);
                setShowProductForm(false);
              }}
              onCancel={() => setShowProductForm(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showBarcode} onOpenChange={setShowBarcode}>
          <DialogContent className="max-w-3xl">
            <BarcodeGenerator />
          </DialogContent>
        </Dialog>

        <Dialog open={showLabels} onOpenChange={setShowLabels}>
          <DialogContent className="max-w-3xl">
            <ThermalPrintManager />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
