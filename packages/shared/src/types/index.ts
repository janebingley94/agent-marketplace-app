// ========== Enums ==========
export enum AgentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  SUSPENDED = 'SUSPENDED',
}

export enum PlanType {
  FREE = 'FREE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PAYG = 'PAYG',
  HYBRID = 'HYBRID',
}

export enum EntitlementStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  SUSPENDED = 'SUSPENDED',
}

export enum RunStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELED = 'CANCELED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}

export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  VOID = 'VOID',
}

export enum DisputeStatus {
  NONE = 'NONE',
  OPENED = 'OPENED',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum InvoiceStatus {
  ISSUED = 'ISSUED',
  VOID = 'VOID',
}

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SUCCEEDED = 'SUCCEEDED',
  DEFEATED = 'DEFEATED',
  EXECUTED = 'EXECUTED',
  CANCELED = 'CANCELED',
}

// ========== User Types ==========
export interface User {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  chainId: number;
  address: string;
  isPrimary: boolean;
  createdAt: Date;
}

// ========== Agent Types ==========
export interface Agent {
  id: string;
  ownerUserId: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  tags: string[];
  iconUrl: string | null;
  isPrivate: boolean;
  status: AgentStatus;
  totalCalls: number;
  totalRevenue: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: User;
  plans?: PricingPlan[];
  currentVersion?: AgentVersion;
  versions?: AgentVersion[];
}

export interface AgentVersion {
  id: string;
  agentId: string;
  version: string;
  changelog: string | null;
  promptTemplate: string | null;
  runtimeConfig: RuntimeConfig | null;
  toolPolicy: ToolPolicy | null;
  providerKey: string | null;
  modelName: string | null;
  publishedAt: Date | null;
  createdAt: Date;
}

export interface RuntimeConfig {
  maxTokens?: number;
  temperature?: number;
  tools?: string[];
}

export interface ToolPolicy {
  allow?: string[];
  deny?: string[];
}

// ========== Pricing Types ==========
export interface PricingPlan {
  id: string;
  agentId: string;
  type: PlanType;
  name: string;
  price: string;
  currency: string;
  period: string | null;
  quota: PlanQuota | null;
  unitPrice: UnitPrice | null;
  features: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface PlanQuota {
  calls?: number;
  tokens?: number;
  tokensPerMonth?: number;
}

export interface UnitPrice {
  perCall?: number;
  per1kTokens?: number;
}

export interface Entitlement {
  id: string;
  userId: string;
  agentId: string;
  planId: string;
  status: EntitlementStatus;
  startAt: Date;
  endAt: Date | null;
  usedQuota: PlanQuota | null;
}

// ========== Conversation & Run Types ==========
export interface Conversation {
  id: string;
  userId: string;
  agentId: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  metadata: MessageMetadata | null;
  createdAt: Date;
}

export interface MessageMetadata {
  toolCalls?: unknown[];
  attachments?: unknown[];
}

export interface Run {
  id: string;
  agentId: string;
  agentVersionId: string;
  userId: string;
  conversationId: string | null;
  status: RunStatus;
  input: unknown;
  output: unknown;
  startedAt: Date | null;
  finishedAt: Date | null;
  errorCode: string | null;
  errorMessage: string | null;
  parentRunId: string | null;
}

export interface UsageMeter {
  id: string;
  runId: string;
  userId: string;
  agentId: string;
  tokensIn: number;
  tokensOut: number;
  toolCalls: number;
  durationMs: number;
  costUsd: string;
  createdAt: Date;
}

// ========== Order & Payment Types ==========
export interface Order {
  id: string;
  buyerUserId: string;
  agentId: string;
  planId: string;
  amount: string;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  paidAt: Date | null;
}

export interface Payment {
  id: string;
  orderId: string;
  method: string;
  chainId: number;
  txHash: string;
  amount: string;
  status: PaymentStatus;
  paidAt: Date | null;
}

// ========== Bill Types ==========
export interface Bill {
  id: string;
  payerUserId: string;
  payeeUserId: string;
  agentId: string;
  orderId: string | null;
  periodStart: Date;
  periodEnd: Date;
  subtotal: string;
  taxAmount: string;
  total: string;
  currency: string;
  status: BillStatus;
  dispute: DisputeStatus;
  createdAt: Date;
  paidAt: Date | null;
  agent?: Agent;
  items?: BillItem[];
}

export interface BillItem {
  id: string;
  billId: string;
  runId: string | null;
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
  currency: string;
}

export interface Invoice {
  id: string;
  billId: string;
  invoiceNo: string;
  billTo: BillTo;
  items: InvoiceItem[];
  subtotal: string;
  taxAmount: string;
  total: string;
  currency: string;
  pdfUrl: string | null;
  issuedAt: Date;
  status: InvoiceStatus;
}

export interface BillTo {
  name: string;
  address?: string;
  taxId?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
}

// ========== Revenue Split Types ==========
export interface RevenueSplit {
  id: string;
  agentId: string;
  recipient: string;
  ratioBps: number;
  kind: 'developer' | 'platform' | 'dao';
}

// ========== DAO Types ==========
export interface DaoSpace {
  id: string;
  agentId: string;
  name: string;
  chainId: number;
  governorAddress: string;
  tokenAddress: string | null;
  createdAt: Date;
}

export interface Proposal {
  id: string;
  daoSpaceId: string;
  proposerId: string | null;
  type: 'list' | 'delist' | 'price_change' | 'dispute';
  title: string;
  body: string;
  startAt: Date;
  endAt: Date;
  status: ProposalStatus;
  onchainTx: string | null;
  actions: unknown;
  createdAt: Date;
  votes?: VoteSummary;
}

export interface Vote {
  id: string;
  proposalId: string;
  voter: string;
  support: boolean;
  weight: string;
  reason: string | null;
  txHash: string | null;
  createdAt: Date;
}

export interface VoteSummary {
  for: string;
  against: string;
  abstain: string;
  quorum: string;
  participation: string;
}

// ========== API Types ==========
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

// ========== Dashboard Types ==========
export interface DashboardOverview {
  totalBalance: string;
  dailyRevenue: string;
  activeAgents: number;
  stakedAssets: string;
  revenueChange: string;
  callsChange: string;
}

export interface EarningsDataPoint {
  date: string;
  revenue: string;
  calls: number;
}

export interface EarningsSummary {
  totalRevenue: string;
  totalCalls: number;
  avgDailyRevenue: string;
}

export interface AgentEarnings {
  agent: Pick<Agent, 'id' | 'name' | 'iconUrl'>;
  revenue: string;
  percentage: number;
  calls: number;
  status: AgentStatus;
}

// ========== Leaderboard Types ==========
export interface LeaderboardEntry {
  rank: number;
  agent: Pick<Agent, 'id' | 'name' | 'slug' | 'iconUrl'>;
  revenue: string;
  calls: number;
  change: string;
}

// ========== Auth Types ==========
export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  wallets: Wallet[];
  createdAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}
