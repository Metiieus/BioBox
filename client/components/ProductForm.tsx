import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Save, Plus, Trash2, Package, Palette, Ruler } from "lucide-react";
import { Product, ProductModel, ProductSize, ProductColor, ProductFabric } from "@/types/inventory";

interface ProductFormProps {
  product?: Product;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'bed' as Product['category'],
    sku: product?.sku || '',
    description: product?.description || '',
    basePrice: product?.basePrice || 0,
    costPrice: product?.costPrice || 0,
    margin: product?.margin || 60,
    status: product?.status || 'active' as Product['status']
  });

  const [models, setModels] = useState<ProductModel[]>(product?.models || []);
  const [newModel, setNewModel] = useState({
    name: '',
    priceModifier: 1.0,
    stockQuantity: 0,
    minimumStock: 5,
    isActive: true,
    sizes: [] as ProductSize[],
    colors: [] as ProductColor[],
    fabrics: [] as ProductFabric[]
  });

  const [showModelForm, setShowModelForm] = useState(false);

  const defaultSizes: ProductSize[] = [
    { id: 'size-1', name: 'Solteiro', dimensions: { width: 88, height: 188, depth: 30 }, priceModifier: 0.8 },
    { id: 'size-2', name: 'Casal', dimensions: { width: 138, height: 188, depth: 30 }, priceModifier: 1.0 },
    { id: 'size-3', name: 'Queen', dimensions: { width: 158, height: 198, depth: 30 }, priceModifier: 1.2 },
    { id: 'size-4', name: 'King', dimensions: { width: 193, height: 203, depth: 30 }, priceModifier: 1.5 }
  ];

  const defaultColors: ProductColor[] = [
    { id: 'color-1', name: 'Branco', hexCode: '#FFFFFF', priceModifier: 1.0 },
    { id: 'color-2', name: 'Marrom', hexCode: '#8B4513', priceModifier: 1.0 },
    { id: 'color-3', name: 'Preto', hexCode: '#000000', priceModifier: 1.05 },
    { id: 'color-4', name: 'Cinza', hexCode: '#808080', priceModifier: 1.0 }
  ];

  const defaultFabrics: ProductFabric[] = [
    { id: 'fabric-1', name: 'Courino', type: 'courino', priceModifier: 1.0 },
    { id: 'fabric-2', name: 'Tecido Premium', type: 'tecido', priceModifier: 1.1 },
    { id: 'fabric-3', name: 'Veludo Premium', type: 'veludo', priceModifier: 1.3 },
    { id: 'fabric-4', name: 'Couro', type: 'couro', priceModifier: 1.4 }
  ];

  const generateSKU = () => {
    const prefix = formData.category.toUpperCase().slice(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  const calculateMargin = () => {
    if (formData.costPrice > 0 && formData.basePrice > 0) {
      return Math.round(((formData.basePrice - formData.costPrice) / formData.costPrice) * 100);
    }
    return 0;
  };

  const handleAddModel = () => {
    const model: ProductModel = {
      id: Date.now().toString(),
      ...newModel,
      sizes: defaultSizes,
      colors: defaultColors,
      fabrics: defaultFabrics
    };
    setModels(prev => [...prev, model]);
    setNewModel({
      name: '',
      priceModifier: 1.0,
      stockQuantity: 0,
      minimumStock: 5,
      isActive: true,
      sizes: [],
      colors: [],
      fabrics: []
    });
    setShowModelForm(false);
  };

  const handleRemoveModel = (modelId: string) => {
    setModels(prev => prev.filter(m => m.id !== modelId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Partial<Product> = {
      ...formData,
      models,
      specifications: [],
      images: ['/placeholder.svg'],
      margin: calculateMargin()
    };

    onSave(productData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>{product ? 'Editar Produto' : 'Novo Produto'}</span>
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList>
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="models">Modelos e Variações</TabsTrigger>
                <TabsTrigger value="pricing">Preços e Custos</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Cama Luxo Premium"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bed">Camas</SelectItem>
                        <SelectItem value="mattress">Colchões</SelectItem>
                        <SelectItem value="accessory">Acessórios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="Ex: BED-LUX-001"
                        required
                      />
                      <Button type="button" variant="outline" onClick={() => setFormData(prev => ({ ...prev, sku: generateSKU() }))}>
                        Gerar
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="discontinued">Descontinuado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição detalhada do produto..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="models" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Modelos e Variações</h3>
                  <Button
                    type="button"
                    onClick={() => setShowModelForm(true)}
                    className="bg-biobox-green hover:bg-biobox-green-dark"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Modelo
                  </Button>
                </div>

                {models.length > 0 ? (
                  <div className="space-y-4">
                    {models.map(model => (
                      <Card key={model.id} className="bg-muted/5">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{model.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant={model.isActive ? "default" : "secondary"}>
                                {model.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveModel(model.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Modificador</p>
                              <p className="font-medium">{model.priceModifier}x</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Estoque</p>
                              <p className="font-medium">{model.stockQuantity}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Tamanhos</p>
                              <p className="font-medium">{model.sizes.length}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Cores</p>
                              <p className="font-medium">{model.colors.length}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum modelo cadastrado</p>
                    <p className="text-sm">Adicione pelo menos um modelo para o produto</p>
                  </div>
                )}

                {/* Model Form */}
                {showModelForm && (
                  <Card className="bg-muted/10 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-base">Novo Modelo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Nome do Modelo</Label>
                          <Input
                            value={newModel.name}
                            onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ex: Standard, Premium"
                          />
                        </div>
                        <div>
                          <Label>Modificador de Preço</Label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={newModel.priceModifier}
                            onChange={(e) => setNewModel(prev => ({ ...prev, priceModifier: parseFloat(e.target.value) }))}
                          />
                        </div>
                        <div>
                          <Label>Estoque Inicial</Label>
                          <Input
                            type="number"
                            min="0"
                            value={newModel.stockQuantity}
                            onChange={(e) => setNewModel(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) }))}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowModelForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          onClick={handleAddModel}
                          disabled={!newModel.name}
                          className="bg-biobox-green hover:bg-biobox-green-dark"
                        >
                          Adicionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="basePrice">Preço Base</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.basePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="costPrice">Custo de Produção</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costPrice}
                      onChange={(e) => {
                        const cost = parseFloat(e.target.value);
                        setFormData(prev => ({ 
                          ...prev, 
                          costPrice: cost,
                          margin: cost > 0 && prev.basePrice > 0 ? Math.round(((prev.basePrice - cost) / cost) * 100) : 60
                        }));
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="margin">Margem de Lucro (%)</Label>
                    <Input
                      id="margin"
                      type="number"
                      min="0"
                      value={formData.margin}
                      onChange={(e) => {
                        const margin = parseInt(e.target.value);
                        setFormData(prev => ({ 
                          ...prev, 
                          margin,
                          basePrice: prev.costPrice > 0 ? prev.costPrice * (1 + margin / 100) : prev.basePrice
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/5 rounded-lg">
                  <h4 className="font-medium mb-2">Resumo Financeiro</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Custo</p>
                      <p className="font-medium">{formatCurrency(formData.costPrice)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Preço de Venda</p>
                      <p className="font-medium">{formatCurrency(formData.basePrice)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lucro Unitário</p>
                      <p className="font-medium text-biobox-green">
                        {formatCurrency(formData.basePrice - formData.costPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-biobox-green hover:bg-biobox-green-dark"
                disabled={!formData.name || !formData.sku || models.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Produto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}