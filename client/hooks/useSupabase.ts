import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Tipos para o banco de dados
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'seller' | 'operator'
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  type: 'individual' | 'company'
  address?: string
  city?: string
  state?: string
  zip_code?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  model: string
  base_price: number
  sizes: string[]
  colors: string[]
  fabrics: string[]
  description?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string
  seller_id: string
  status: 'pending' | 'confirmed' | 'in_production' | 'quality_check' | 'ready' | 'delivered' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  total_amount: number
  scheduled_date: string
  delivery_date?: string
  completed_date?: string
  production_progress: number
  assigned_operator?: string
  notes?: string
  created_at: string
  updated_at: string
  // Campos calculados
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  seller_name?: string
  products?: OrderProduct[]
}

export interface OrderProduct {
  id: string
  order_id: string
  product_id: string
  product_name: string
  model: string
  size: string
  color: string
  fabric: string
  quantity: number
  unit_price: number
  total_price: number
  specifications?: Record<string, any>
  created_at: string
}

// Hook para gerenciar dados do Supabase com fallback para localStorage
export function useSupabase() {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      if (!error) {
        setIsConnected(true)
        console.log('✅ Conectado ao Supabase')
      } else {
        setIsConnected(false)
        console.log('❌ Supabase não disponível, usando dados locais')
      }
    } catch (error) {
      setIsConnected(false)
      console.log('❌ Erro na conexão com Supabase, usando dados locais')
    } finally {
      setLoading(false)
    }
  }

  // Dados mock para fallback
  const mockUsers: User[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@bioboxsys.com',
      name: 'Administrator',
      role: 'admin',
      permissions: ['all'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'carlos@bioboxsys.com',
      name: 'Carlos Vendedor',
      role: 'seller',
      permissions: ['orders:create', 'orders:read', 'customers:create', 'customers:read'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'ana@bioboxsys.com',
      name: 'Ana Vendedora',
      role: 'seller',
      permissions: ['orders:create', 'orders:read', 'customers:create', 'customers:read'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const mockCustomers: Customer[] = [
    {
      id: '650e8400-e29b-41d4-a716-446655440000',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      type: 'individual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'Móveis Premium Ltda',
      email: 'contato@moveispremium.com.br',
      phone: '(11) 88888-8888',
      type: 'company',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440002',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 77777-7777',
      type: 'individual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440003',
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      phone: '(11) 66666-6666',
      type: 'individual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const mockProducts: Product[] = [
    {
      id: '750e8400-e29b-41d4-a716-446655440000',
      name: 'Cama Luxo Premium',
      model: 'Luxo Premium',
      base_price: 3750.00,
      sizes: ['Solteiro', 'Casal', 'Queen', 'King'],
      colors: ['Branco', 'Marrom', 'Preto', 'Cinza'],
      fabrics: ['Veludo Premium', 'Courino Premium', 'Couro'],
      description: 'Cama de alta qualidade com acabamento premium',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '750e8400-e29b-41d4-a716-446655440001',
      name: 'Cama Standard',
      model: 'Standard Classic',
      base_price: 2100.00,
      sizes: ['Solteiro', 'Casal', 'Queen'],
      colors: ['Branco', 'Marrom', 'Cinza'],
      fabrics: ['Tecido', 'Courino'],
      description: 'Cama padrão com excelente custo-benefício',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '750e8400-e29b-41d4-a716-446655440002',
      name: 'Cama King Premium',
      model: 'Premium Deluxe',
      base_price: 4200.00,
      sizes: ['King'],
      colors: ['Branco', 'Preto', 'Marrom'],
      fabrics: ['Veludo Premium', 'Courino Premium', 'Couro'],
      description: 'Cama King size com design exclusivo',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  // Funções para gerenciar dados
  const getUsers = async (): Promise<User[]> => {
    if (isConnected) {
      try {
        const { data, error } = await supabase.from('users').select('*')
        if (!error && data) return data
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      }
    }
    
    // Fallback para dados locais
    const stored = localStorage.getItem('biobox_users')
    return stored ? JSON.parse(stored) : mockUsers
  }

  const getCustomers = async (): Promise<Customer[]> => {
    if (isConnected) {
      try {
        const { data, error } = await supabase.from('customers').select('*')
        if (!error && data) return data
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      }
    }
    
    // Fallback para dados locais
    const stored = localStorage.getItem('biobox_customers')
    return stored ? JSON.parse(stored) : mockCustomers
  }

  const getProducts = async (): Promise<Product[]> => {
    if (isConnected) {
      try {
        const { data, error } = await supabase.from('products').select('*')
        if (!error && data) return data
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
    }
    
    // Fallback para dados locais
    const stored = localStorage.getItem('biobox_products')
    return stored ? JSON.parse(stored) : mockProducts
  }

  const getOrders = async (): Promise<Order[]> => {
    if (isConnected) {
      try {
        // Buscar pedidos com dados relacionados
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            customers(name, phone, email),
            users(name),
            order_products(*)
          `)
        
        if (!error && data) {
          return data.map((order: any) => ({
            ...order,
            customer_name: order.customers?.name,
            customer_phone: order.customers?.phone,
            customer_email: order.customers?.email,
            seller_name: order.users?.name,
            products: order.order_products || []
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
      }
    }
    
    // Fallback para dados locais
    const stored = localStorage.getItem('biobox_orders')
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Dados mock com relacionamentos
    const users = await getUsers()
    const customers = await getCustomers()
    
    return [
      {
        id: '850e8400-e29b-41d4-a716-446655440000',
        order_number: 'ORD-2024-001',
        customer_id: '650e8400-e29b-41d4-a716-446655440000',
        seller_id: '550e8400-e29b-41d4-a716-446655440001',
        status: 'in_production',
        priority: 'medium',
        total_amount: 4200.00,
        scheduled_date: '2024-12-20',
        delivery_date: '2024-12-25',
        production_progress: 65,
        assigned_operator: 'Carlos M.',
        notes: 'Cliente solicitou entrega no período da manhã',
        created_at: new Date('2024-12-10').toISOString(),
        updated_at: new Date('2024-12-15').toISOString(),
        customer_name: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440000')?.name,
        customer_phone: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440000')?.phone,
        customer_email: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440000')?.email,
        seller_name: users.find(u => u.id === '550e8400-e29b-41d4-a716-446655440001')?.name,
        products: []
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440001',
        order_number: 'ORD-2024-002',
        customer_id: '650e8400-e29b-41d4-a716-446655440001',
        seller_id: '550e8400-e29b-41d4-a716-446655440002',
        status: 'confirmed',
        priority: 'high',
        total_amount: 12600.00,
        scheduled_date: '2024-12-18',
        delivery_date: '2024-12-30',
        production_progress: 0,
        notes: 'Pedido para revenda - prioridade alta',
        created_at: new Date('2024-12-12').toISOString(),
        updated_at: new Date('2024-12-12').toISOString(),
        customer_name: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440001')?.name,
        customer_phone: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440001')?.phone,
        customer_email: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440001')?.email,
        seller_name: users.find(u => u.id === '550e8400-e29b-41d4-a716-446655440002')?.name,
        products: []
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440002',
        order_number: 'ORD-2024-003',
        customer_id: '650e8400-e29b-41d4-a716-446655440002',
        seller_id: '550e8400-e29b-41d4-a716-446655440001',
        status: 'ready',
        priority: 'low',
        total_amount: 2100.00,
        scheduled_date: '2024-12-15',
        delivery_date: '2024-12-22',
        production_progress: 100,
        assigned_operator: 'Ana L.',
        notes: 'Primeira compra da cliente',
        created_at: new Date('2024-12-08').toISOString(),
        updated_at: new Date('2024-12-20').toISOString(),
        customer_name: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440002')?.name,
        customer_phone: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440002')?.phone,
        customer_email: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440002')?.email,
        seller_name: users.find(u => u.id === '550e8400-e29b-41d4-a716-446655440001')?.name,
        products: []
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440003',
        order_number: 'ORD-2024-004',
        customer_id: '650e8400-e29b-41d4-a716-446655440003',
        seller_id: '550e8400-e29b-41d4-a716-446655440002',
        status: 'pending',
        priority: 'urgent',
        total_amount: 5600.00,
        scheduled_date: '2024-12-22',
        delivery_date: '2024-12-28',
        production_progress: 0,
        notes: 'Cliente precisa com urgência',
        created_at: new Date('2024-12-14').toISOString(),
        updated_at: new Date('2024-12-14').toISOString(),
        customer_name: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440003')?.name,
        customer_phone: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440003')?.phone,
        customer_email: customers.find(c => c.id === '650e8400-e29b-41d4-a716-446655440003')?.email,
        seller_name: users.find(u => u.id === '550e8400-e29b-41d4-a716-446655440002')?.name,
        products: []
      }
    ]
  }

  const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      order_number: `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      production_progress: 0,
      status: 'pending',
      priority: 'medium',
      ...orderData
    } as Order

    if (isConnected) {
      try {
        const { data, error } = await supabase.from('orders').insert([newOrder]).select().single()
        if (!error && data) return data
      } catch (error) {
        console.error('Erro ao criar pedido:', error)
      }
    }

    // Fallback para localStorage
    const orders = await getOrders()
    const updatedOrders = [newOrder, ...orders]
    localStorage.setItem('biobox_orders', JSON.stringify(updatedOrders))
    return newOrder
  }

  const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<Order | null> => {
    const now = new Date().toISOString();
    if (isConnected) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ ...updates, updated_at: now })
          .eq('id', orderId)
          .select()
          .single();
        if (!error && data) return data as Order;
      } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
      }
    }

    const orders = await getOrders();
    const updated = orders.map(o => (o.id === orderId ? { ...o, ...updates, updated_at: now } : o));
    localStorage.setItem('biobox_orders', JSON.stringify(updated));
    return updated.find(o => o.id === orderId) || null;
  }

  const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: productData.name || 'Produto',
      model: productData.model || '',
      base_price: productData.base_price || 0,
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      fabrics: productData.fabrics || [],
      description: productData.description,
      active: productData.active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Product;

    if (isConnected) {
      try {
        const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
        if (!error && data) return data as Product;
      } catch (error) {
        console.error('Erro ao criar produto:', error);
      }
    }

    const products = await getProducts();
    const updated = [newProduct, ...products];
    localStorage.setItem('biobox_products', JSON.stringify(updated));
    return newProduct;
  }

  const createCustomer = async (customerData: Partial<Customer>): Promise<Customer | null> => {
    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...customerData
    } as Customer

    if (isConnected) {
      try {
        const { data, error } = await supabase.from('customers').insert([newCustomer]).select().single()
        if (!error && data) return data
      } catch (error) {
        console.error('Erro ao criar cliente:', error)
      }
    }
    
    // Fallback para localStorage
    const customers = await getCustomers()
    const updatedCustomers = [newCustomer, ...customers]
    localStorage.setItem('biobox_customers', JSON.stringify(updatedCustomers))
    return newCustomer
  }

  return {
    isConnected,
    loading,
    getUsers,
    getCustomers,
    getProducts,
    getOrders,
    createOrder,
    updateOrder,
    createProduct,
    createCustomer,
    checkConnection
  }
}
