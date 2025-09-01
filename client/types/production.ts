export interface ProductionLine {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  currentOrder?: string;
  operatorId?: string;
  operatorName?: string;
  efficiency: number; // percentage
  dailyTarget: number;
  dailyProduced: number;
  lastUpdate: Date;
}

export interface ProductionStage {
  id: string;
  name: string;
  order: number;
  estimatedTime: number; // in minutes
  requiredSkills: string[];
  description: string;
}

export interface ProductionTask {
  id: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  customerId: string;
  customerName: string;
  stage: ProductionStage['id'];
  stageOrder: number;
  status: 'pending' | 'in_progress' | 'completed' | 'paused' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedOperator?: string;
  startTime?: Date;
  estimatedCompletionTime?: Date;
  actualCompletionTime?: Date;
  progress: number; // percentage
  notes?: string;
  issues?: ProductionIssue[];
  qualityChecks?: QualityCheck[];
}

export interface ProductionIssue {
  id: string;
  taskId: string;
  type: 'quality' | 'material' | 'equipment' | 'operator' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  reportedBy: string;
  reportedAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}

export interface QualityCheck {
  id: string;
  taskId: string;
  checkpointName: string;
  status: 'passed' | 'failed' | 'pending';
  inspector: string;
  checkedAt: Date;
  notes?: string;
  photos?: string[];
}

export interface Operator {
  id: string;
  name: string;
  skills: string[];
  experience: number; // years
  efficiency: number; // percentage
  currentTask?: string;
  status: 'available' | 'busy' | 'break' | 'absent';
  shift: 'morning' | 'afternoon' | 'night';
}

export const productionStages: ProductionStage[] = [
  {
    id: 'design',
    name: 'Design e Medidas',
    order: 1,
    estimatedTime: 30,
    requiredSkills: ['design', 'measurement'],
    description: 'Criação do projeto e tomada de medidas'
  },
  {
    id: 'cutting',
    name: 'Corte de Materiais',
    order: 2,
    estimatedTime: 60,
    requiredSkills: ['cutting', 'material_handling'],
    description: 'Corte de madeira, tecidos e espumas'
  },
  {
    id: 'frame_assembly',
    name: 'Montagem da Estrutura',
    order: 3,
    estimatedTime: 120,
    requiredSkills: ['carpentry', 'assembly'],
    description: 'Montagem da estrutura de madeira'
  },
  {
    id: 'upholstery',
    name: 'Estofamento',
    order: 4,
    estimatedTime: 180,
    requiredSkills: ['upholstery', 'sewing'],
    description: 'Aplicação de espuma e revestimento'
  },
  {
    id: 'finishing',
    name: 'Acabamento',
    order: 5,
    estimatedTime: 90,
    requiredSkills: ['finishing', 'detail_work'],
    description: 'Acabamentos finais e detalhes'
  },
  {
    id: 'quality_control',
    name: 'Controle de Qualidade',
    order: 6,
    estimatedTime: 30,
    requiredSkills: ['quality_control'],
    description: 'Inspeção final e aprovação'
  },
  {
    id: 'packaging',
    name: 'Embalagem',
    order: 7,
    estimatedTime: 45,
    requiredSkills: ['packaging'],
    description: 'Embalagem para transporte'
  }
];

export const mockOperators: Operator[] = [
  {
    id: '1',
    name: 'Carlos Mendes',
    skills: ['cutting', 'carpentry', 'assembly'],
    experience: 8,
    efficiency: 95,
    currentTask: 'task-1',
    status: 'busy',
    shift: 'morning'
  },
  {
    id: '2',
    name: 'Ana Lima',
    skills: ['upholstery', 'sewing', 'finishing'],
    experience: 6,
    efficiency: 92,
    currentTask: 'task-2',
    status: 'busy',
    shift: 'morning'
  },
  {
    id: '3',
    name: 'José Roberto',
    skills: ['design', 'measurement', 'quality_control'],
    experience: 12,
    efficiency: 98,
    status: 'available',
    shift: 'morning'
  },
  {
    id: '4',
    name: 'Maria Silva',
    skills: ['cutting', 'material_handling', 'packaging'],
    experience: 4,
    efficiency: 88,
    status: 'break',
    shift: 'morning'
  },
  {
    id: '5',
    name: 'Pedro Santos',
    skills: ['carpentry', 'assembly', 'finishing'],
    experience: 10,
    efficiency: 94,
    currentTask: 'task-3',
    status: 'busy',
    shift: 'afternoon'
  }
];

export const mockProductionLines: ProductionLine[] = [
  {
    id: '1',
    name: 'Linha A - Camas Premium',
    status: 'active',
    currentOrder: 'ORD-2024-001',
    operatorId: '1',
    operatorName: 'Carlos Mendes',
    efficiency: 95,
    dailyTarget: 3,
    dailyProduced: 2,
    lastUpdate: new Date()
  },
  {
    id: '2',
    name: 'Linha B - Camas Standard',
    status: 'active',
    currentOrder: 'ORD-2024-002',
    operatorId: '2',
    operatorName: 'Ana Lima',
    efficiency: 92,
    dailyTarget: 4,
    dailyProduced: 3,
    lastUpdate: new Date()
  },
  {
    id: '3',
    name: 'Linha C - Acabamento',
    status: 'maintenance',
    efficiency: 0,
    dailyTarget: 5,
    dailyProduced: 0,
    lastUpdate: new Date()
  }
];

export const mockProductionTasks: ProductionTask[] = [
  {
    id: 'task-1',
    orderId: '1',
    orderNumber: 'ORD-2024-001',
    productName: 'Cama Queen Luxo',
    customerId: '1',
    customerName: 'João Silva',
    stage: 'finishing',
    stageOrder: 5,
    status: 'in_progress',
    priority: 'medium',
    assignedOperator: 'Carlos Mendes',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    estimatedCompletionTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    progress: 85,
    notes: 'Aplicando verniz final na cabeceira'
  },
  {
    id: 'task-2',
    orderId: '2',
    orderNumber: 'ORD-2024-002',
    productName: 'Cama King Standard',
    customerId: '2',
    customerName: 'Móveis Premium Ltda',
    stage: 'upholstery',
    stageOrder: 4,
    status: 'in_progress',
    priority: 'high',
    assignedOperator: 'Ana Lima',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    estimatedCompletionTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    progress: 60,
    notes: 'Instalando tecido premium na cabeceira'
  },
  {
    id: 'task-3',
    orderId: '3',
    orderNumber: 'ORD-2024-003',
    productName: 'Cama Casal Standard',
    customerId: '3',
    customerName: 'Maria Santos',
    stage: 'quality_control',
    stageOrder: 6,
    status: 'completed',
    priority: 'low',
    assignedOperator: 'José Roberto',
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    actualCompletionTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    progress: 100,
    notes: 'Aprovada no controle de qualidade'
  },
  {
    id: 'task-4',
    orderId: '4',
    orderNumber: 'ORD-2024-004',
    productName: 'Cama Premium Deluxe',
    customerId: '5',
    customerName: 'Casa & Decoração S.A.',
    stage: 'cutting',
    stageOrder: 2,
    status: 'blocked',
    priority: 'urgent',
    progress: 0,
    notes: 'Aguardando chegada do tecido especial importado',
    issues: [
      {
        id: 'issue-1',
        taskId: 'task-4',
        type: 'material',
        description: 'Tecido especial não chegou no prazo previsto',
        severity: 'high',
        status: 'investigating',
        reportedBy: 'Maria Silva',
        reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]
  }
];

export const statusLabels = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  paused: 'Pausado',
  blocked: 'Bloqueado'
};

export const statusColors = {
  pending: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-biobox-green/10 text-biobox-green border-biobox-green/20',
  paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  blocked: 'bg-red-500/10 text-red-500 border-red-500/20'
};

export const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

export const operatorStatusColors = {
  available: 'bg-biobox-green/10 text-biobox-green border-biobox-green/20',
  busy: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  break: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  absent: 'bg-red-500/10 text-red-500 border-red-500/20'
};

export const operatorStatusLabels = {
  available: 'Disponível',
  busy: 'Ocupado',
  break: 'Pausa',
  absent: 'Ausente'
};
