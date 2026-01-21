import { AgentStatus, PlanType } from '@prisma/client';

type SeedUser = {
  email: string;
  name: string;
  avatarUrl: string;
  wallet: {
    chainId: number;
    address: string;
    isPrimary: boolean;
  };
};

type SeedAgent = {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  status: AgentStatus;
  totalCalls: number;
  totalRevenue: number;
};

type SeedPlanTemplate = {
  type: PlanType;
  name: string;
  price: number;
  currency: string;
  period?: string;
  quota: Record<string, number>;
  features: string[];
};

export const seedUsers: SeedUser[] = [
  {
    email: 'alice@example.com',
    name: 'Alice Chen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    wallet: {
      chainId: 1,
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      isPrimary: true,
    },
  },
  {
    email: 'bob@example.com',
    name: 'Bob Wilson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    wallet: {
      chainId: 1,
      address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      isPrimary: true,
    },
  },
  {
    email: 'carol@example.com',
    name: 'Carol Martinez',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    wallet: {
      chainId: 1,
      address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
      isPrimary: true,
    },
  },
];

export const seedAgents: SeedAgent[] = [
  {
    name: 'Data Analyst Pro',
    slug: 'data-analyst-pro',
    description: 'AI-powered data analysis agent that transforms raw data into actionable insights. Supports CSV, JSON, and SQL databases.',
    category: 'Analytics',
    tags: ['data', 'analysis', 'visualization', 'charts'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 15420,
    totalRevenue: 5230.5,
  },
  {
    name: 'Code Review Assistant',
    slug: 'code-review-assistant',
    description: 'Automated code review agent that identifies bugs, security vulnerabilities, and suggests improvements.',
    category: 'Coding',
    tags: ['code-review', 'security', 'best-practices'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 28750,
    totalRevenue: 8920.0,
  },
  {
    name: 'Content Writer',
    slug: 'content-writer',
    description: 'Professional content generation agent for blogs, articles, and marketing copy with SEO optimization.',
    category: 'Content',
    tags: ['writing', 'seo', 'marketing', 'blog'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 42100,
    totalRevenue: 12450.75,
  },
  {
    name: 'Customer Support Bot',
    slug: 'customer-support-bot',
    description: 'Intelligent customer support agent that handles inquiries, troubleshooting, and ticket management.',
    category: 'Support',
    tags: ['support', 'customer-service', 'helpdesk'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 95230,
    totalRevenue: 18900.25,
  },
  {
    name: 'Financial Advisor',
    slug: 'financial-advisor',
    description: 'AI financial advisor for portfolio analysis, market trends, and investment recommendations.',
    category: 'Finance',
    tags: ['finance', 'investment', 'portfolio', 'trading'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 8540,
    totalRevenue: 15680.0,
  },
  {
    name: 'Research Assistant',
    slug: 'research-assistant',
    description: 'Academic and market research agent that gathers, synthesizes, and summarizes information from multiple sources.',
    category: 'Research',
    tags: ['research', 'academic', 'synthesis'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 12890,
    totalRevenue: 4560.3,
  },
  {
    name: 'Email Composer',
    slug: 'email-composer',
    description: 'Professional email writing assistant for business communication, follow-ups, and cold outreach.',
    category: 'Communication',
    tags: ['email', 'communication', 'business'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 35620,
    totalRevenue: 7890.45,
  },
  {
    name: 'SQL Query Builder',
    slug: 'sql-query-builder',
    description: 'Natural language to SQL converter with query optimization and explanation capabilities.',
    category: 'Data',
    tags: ['sql', 'database', 'query'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 18930,
    totalRevenue: 6340.8,
  },
  {
    name: 'Marketing Strategist',
    slug: 'marketing-strategist',
    description: 'AI marketing agent for campaign planning, audience analysis, and performance optimization.',
    category: 'Marketing',
    tags: ['marketing', 'strategy', 'campaigns'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 7650,
    totalRevenue: 9870.6,
  },
  {
    name: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    description: 'Design assistant for creating wireframes, UI components, and design system recommendations.',
    category: 'Design',
    tags: ['design', 'ui', 'ux', 'wireframes'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 5420,
    totalRevenue: 3210.9,
  },
  {
    name: 'Legal Document Analyzer',
    slug: 'legal-document-analyzer',
    description: 'Contract review and legal document analysis agent with risk assessment capabilities.',
    category: 'Other',
    tags: ['legal', 'contracts', 'compliance'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 3280,
    totalRevenue: 8540.0,
  },
  {
    name: 'Workflow Automator',
    slug: 'workflow-automator',
    description: 'Process automation agent that creates and manages workflows across multiple tools and platforms.',
    category: 'Automation',
    tags: ['automation', 'workflow', 'integration'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 11450,
    totalRevenue: 5670.35,
  },
  {
    name: 'Sales Coach',
    slug: 'sales-coach',
    description: 'AI sales training agent with objection handling, pitch improvement, and deal analysis.',
    category: 'Sales',
    tags: ['sales', 'coaching', 'deals'],
    status: AgentStatus.DRAFT,
    totalCalls: 0,
    totalRevenue: 0,
  },
  {
    name: 'Security Scanner',
    slug: 'security-scanner',
    description: 'Security vulnerability assessment agent for web applications and infrastructure.',
    category: 'Security',
    tags: ['security', 'vulnerability', 'scanning'],
    status: AgentStatus.PENDING_REVIEW,
    totalCalls: 0,
    totalRevenue: 0,
  },
  {
    name: 'Learning Tutor',
    slug: 'learning-tutor',
    description: 'Personalized education agent for various subjects with adaptive learning paths.',
    category: 'Education',
    tags: ['education', 'tutoring', 'learning'],
    status: AgentStatus.PUBLISHED,
    totalCalls: 22340,
    totalRevenue: 4890.2,
  },
];

export const planTemplates: SeedPlanTemplate[] = [
  {
    type: PlanType.FREE,
    name: 'Free',
    price: 0,
    currency: 'USD',
    quota: { calls: 10, tokensPerMonth: 10000 },
    features: ['Basic features', '10 calls/month', 'Community support'],
  },
  {
    type: PlanType.SUBSCRIPTION,
    name: 'Pro',
    price: 29,
    currency: 'USD',
    period: 'month',
    quota: { calls: 1000, tokensPerMonth: 500000 },
    features: ['All features', '1000 calls/month', 'Priority support', 'API access'],
  },
  {
    type: PlanType.SUBSCRIPTION,
    name: 'Enterprise',
    price: 199,
    currency: 'USD',
    period: 'month',
    quota: { calls: -1, tokensPerMonth: -1 },
    features: ['Unlimited calls', 'Dedicated support', 'Custom integrations', 'SLA'],
  },
];
