import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Product, ProductModel } from "@/types/inventory";

interface ProductFormProps {
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductForm({ onSave, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "bed" as Product["category"],
    description: "",
    basePrice: 0,
    costPrice: 0,
    margin: 0,
    status: "active" as Product["status"],
    modelName: "Standard",
    stockQuantity: 0,
    minimumStock: 0,
  });

  const canSave = () => form.name && form.sku && form.basePrice > 0;

  const handleSave = () => {
    const model: ProductModel = {
      id: `model-${Date.now()}`,
      name: form.modelName || "Standard",
      priceModifier: 1.0,
      stockQuantity: form.stockQuantity,
      minimumStock: form.minimumStock,
      isActive: true,
      sizes: [],
      colors: [],
      fabrics: [],
    };

    const product: Product = {
      id: `prod-${Date.now()}`,
      name: form.name,
      category: form.category,
      sku: form.sku,
      description: form.description,
      basePrice: form.basePrice,
      costPrice: form.costPrice,
      margin: form.margin,
      status: form.status,
      models: [model],
      specifications: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;

    onSave(product);
  };

  return (
    <Card className="bg-card border-border w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Novo Produto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>SKU</Label>
            <Input
              value={form.sku}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sku: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Categoria</Label>
            <Select
              value={form.category}
              onValueChange={(v: any) =>
                setForm((prev) => ({ ...prev, category: v }))
              }
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
          <div>
            <Label>Preço Base</Label>
            <Input
              type="number"
              step="0.01"
              value={form.basePrice}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  basePrice: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div>
            <Label>Custo</Label>
            <Input
              type="number"
              step="0.01"
              value={form.costPrice}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  costPrice: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Margem (%)</Label>
            <Input
              type="number"
              step="1"
              value={form.margin}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  margin: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v: any) =>
                setForm((prev) => ({ ...prev, status: v }))
              }
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
          <div>
            <Label>Modelo Inicial</Label>
            <Input
              value={form.modelName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, modelName: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Estoque Inicial</Label>
            <Input
              type="number"
              value={form.stockQuantity}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  stockQuantity: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div>
            <Label>Estoque Mínimo</Label>
            <Input
              type="number"
              value={form.minimumStock}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  minimumStock: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
        <div>
          <Label>Descrição</Label>
          <Textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            className="bg-biobox-green hover:bg-biobox-green-dark"
            onClick={handleSave}
            disabled={!canSave()}
          >
            Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
