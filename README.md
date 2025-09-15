# BioBoxsys - Sistema de Gerenciamento de Produção

Sistema completo para gerenciamento de produção de móveis (camas) com controle de pedidos, clientes, produção e estoque.

## 📋 Funcionalidades Principais

### 🏠 Dashboard
- Visão geral dos indicadores de produção
- Métricas em tempo real de pedidos, produção e receita
- Gráficos de produção semanal
- Atividades recentes do sistema
- Visão geral da produção atual

### 👥 Gerenciamento de Clientes
- Cadastro de clientes pessoa física e jurídica
- Histórico de pedidos e gastos por cliente
- Controle de status (ativo/inativo)
- Endereços completos com validação

### 📦 Gerenciamento de Pedidos
- **Calendário de Produção**: Visualização mensal com marcadores visuais
- **Fragmentação de Produção**: Para pedidos grandes (10+ unidades)
- **Priorização**: Sistema de prioridades (baixa, média, alta, urgente)
- **Status Completo**: Pendente → Confirmado → Em Produção → Controle de Qualidade → Pronto → Entregue
- **Configuração de Produtos**: Múltiplos modelos, tamanhos, cores e tecidos

### 🏭 Acompanhamento de Produção
- **Linhas de Produção**: Monitoramento de eficiência e capacidade
- **Tarefas em Tempo Real**: Progresso detalhado de cada etapa
- **Operadores**: Controle de disponibilidade e habilidades
- **Etapas de Produção**: Design → Corte → Montagem → Estofamento → Acabamento → Qualidade → Embalagem

### 📊 Produtos e Estoque
- **Catálogo de Produtos**: Gestão completa de produtos e variações
- **Controle de Estoque**: Alertas de estoque baixo
- **Matéria Prima**: Gestão de materiais e fornecedores
- **Códigos de Barras**: Geração e impressão de etiquetas

### ⚙️ Configurações
- **Gerenciamento de Usuários**: Criação e edição de usuários
- **Sistema de Permissões**: Controle granular por módulo e ação
- **Configurações da Empresa**: Dados corporativos
- **Backup e Restauração**: Proteção de dados
- **Notificações**: Configuração de alertas

## 💰 Sistema Financeiro

### Estrutura de Preços
- **Preço Base**: Valor fundamental do produto
- **Modificadores**: Aplicados por modelo, tamanho, cor e tecido
- **Margem de Lucro**: 60% sobre o custo de produção
- **Cálculo Automático**: Preços calculados dinamicamente

### Exemplos de Preços (Cama Luxo Premium - Base R$ 2.500):
- **Solteiro**: R$ 2.000 (modificador 0.8x)
- **Casal**: R$ 2.500 (modificador 1.0x)
- **Queen**: R$ 3.000 (modificador 1.2x)
- **King**: R$ 3.750 (modificador 1.5x)

### Modificadores de Tecido:
- **Courino**: Preço base
- **Tecido Premium**: +10%
- **Courino Premium**: +5%
- **Veludo Premium/Couro**: +30%

### Fragmentação Financeira
Para pedidos grandes (10+ unidades), o sistema permite:
- **Divisão em Lotes**: Produção e faturamento em etapas
- **Liberação Progressiva**: Recebimento conforme conclusão dos fragmentos
- **Controle de Fluxo**: Melhor gestão do capital de giro

### Métricas Financeiras
- **Receita Confirmada**: Pedidos entregues + prontos para entrega
- **Receita em Produção**: Valor liberado dos fragmentos concluídos
- **Meta Mensal**: R$ 50.000 (ajustável nas configurações)
- **Margem Bruta**: 60% sobre custos de produção

## 🔐 Sistema de Autenticação e Permissões

### Tipos de Usuário
1. **Administrador**: Acesso completo a todos os módulos
2. **Vendedor**: Acesso limitado a pedidos e clientes

### Permissões por Módulo
- **Dashboard**: Visualização de métricas gerais
- **Pedidos**: Criar, editar, visualizar e excluir pedidos
- **Clientes**: Gerenciar cadastro de clientes
- **Produção**: Acompanhar e gerenciar produção
- **Produtos**: Gerenciar catálogo e estoque
- **Configurações**: Administrar sistema e usuários

### Usuários de Demonstração
- **Admin**: admin@bioboxsys.com / password
- **Vendedor**: carlos@bioboxsys.com / password

## 🏗️ Arquitetura Técnica

### Frontend
- **React 18** com TypeScript
- **React Router 6** para navegação SPA
- **TailwindCSS 3** para estilização
- **Radix UI** para componentes base
- **Lucide React** para ícones
- **React Hook Form** para formulários
- **Recharts** para gráficos

### Backend
- **Express.js** integrado com Vite
- **Zod** para validação de dados
- **CORS** configurado para desenvolvimento

### Estrutura de Pastas
```
client/                   # Frontend React
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Biblioteca de componentes base
│   ├── DashboardLayout.tsx
│   ├── OrderForm.tsx
│   └── ...
├── pages/              # Páginas da aplicação
├── types/              # Definições TypeScript
├── hooks/              # Hooks customizados
└── lib/                # Utilitários

server/                 # Backend Express
├── routes/             # Rotas da API
└── index.ts           # Configuração do servidor

shared/                 # Código compartilhado
└── api.ts             # Interfaces da API
```

## 🚀 Como Executar

### Desenvolvimento
```bash
pnpm install
pnpm dev
```

### Produção
```bash
pnpm build
pnpm start
```

### Testes
```bash
pnpm test
```

## 📊 Dados de Demonstração

O sistema inclui dados realistas para demonstração:
- **4 pedidos** em diferentes status
- **5 clientes** (PF e PJ)
- **3 produtos** com múltiplas variações
- **5 operadores** com diferentes habilidades
- **3 linhas de produção** com eficiências variadas

### Validação Financeira
Todos os valores foram revisados para garantir consistência:
- Preços unitários correspondem aos totais
- Gastos dos clientes batem com histórico de pedidos
- Fragmentos somam o valor total do pedido
- Margens de lucro são realistas (60%)

## 🎯 Próximas Funcionalidades

- [ ] Integração com sistema de pagamento
- [ ] Relatórios financeiros detalhados
- [ ] Controle de qualidade com fotos
- [ ] Integração com transportadoras
- [ ] App mobile para operadores
- [ ] Dashboard executivo com BI

## 🔧 Configuração

### Variáveis de Ambiente
```env
VITE_PUBLIC_BUILDER_KEY=__BUILDER_PUBLIC_KEY__
PING_MESSAGE="ping pong"
```

### Personalização
- Cores da marca configuráveis em `client/global.css`
- Temas claro/escuro suportados
- Configurações da empresa editáveis via interface

## 📱 Responsividade

O sistema é totalmente responsivo, funcionando perfeitamente em:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado com navegação otimizada
- **Mobile**: Interface touch-friendly com menu hambúrguer

## 🛡️ Segurança

- Autenticação baseada em sessão
- Controle de permissões granular
- Validação de dados no frontend e backend
- Proteção contra acesso não autorizado
- Backup automático configurável

---

**BioBoxsys** - Transformando a gestão de produção de móveis com tecnologia moderna e interface intuitiva.