import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwfbuimpodmbtosakfsf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZmJ1aW1wb2RtYnRvc2FrZnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDA0MjksImV4cCI6MjA3MzUxNjQyOX0.gz90-RYiMC5PaIMPfkAMhOEsCPaospA4IbeUyhKIPqQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'seller' | 'operator'
          permissions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'seller' | 'operator'
          permissions?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'seller' | 'operator'
          permissions?: string[]
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          type: 'individual' | 'company'
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          type: 'individual' | 'company'
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          type?: 'individual' | 'company'
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          model: string
          base_price: number
          sizes: string[]
          colors: string[]
          fabrics: string[]
          description: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          model: string
          base_price: number
          sizes: string[]
          colors: string[]
          fabrics: string[]
          description?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          model?: string
          base_price?: number
          sizes?: string[]
          colors?: string[]
          fabrics?: string[]
          description?: string | null
          active?: boolean
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string
          seller_id: string
          status: 'pending' | 'confirmed' | 'in_production' | 'quality_check' | 'ready' | 'delivered' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          total_amount: number
          scheduled_date: string
          delivery_date: string | null
          completed_date: string | null
          production_progress: number
          assigned_operator: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id: string
          seller_id: string
          status?: 'pending' | 'confirmed' | 'in_production' | 'quality_check' | 'ready' | 'delivered' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          total_amount: number
          scheduled_date: string
          delivery_date?: string | null
          completed_date?: string | null
          production_progress?: number
          assigned_operator?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string
          seller_id?: string
          status?: 'pending' | 'confirmed' | 'in_production' | 'quality_check' | 'ready' | 'delivered' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          total_amount?: number
          scheduled_date?: string
          delivery_date?: string | null
          completed_date?: string | null
          production_progress?: number
          assigned_operator?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      order_products: {
        Row: {
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
          specifications: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
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
          specifications?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          model?: string
          size?: string
          color?: string
          fabric?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          specifications?: Record<string, any> | null
        }
      }
      production_tasks: {
        Row: {
          id: string
          order_id: string
          task_name: string
          description: string | null
          assigned_operator: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'on_hold'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          estimated_hours: number | null
          actual_hours: number | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          task_name: string
          description?: string | null
          assigned_operator?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          estimated_hours?: number | null
          actual_hours?: number | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          task_name?: string
          description?: string | null
          assigned_operator?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          estimated_hours?: number | null
          actual_hours?: number | null
          started_at?: string | null
          completed_at?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

