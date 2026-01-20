// API Base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Agent categories
export const AGENT_CATEGORIES = [
  'Analytics',
  'Automation',
  'Coding',
  'Communication',
  'Content',
  'Data',
  'Design',
  'Education',
  'Finance',
  'Marketing',
  'Productivity',
  'Research',
  'Sales',
  'Security',
  'Support',
  'Other',
] as const;

export type AgentCategory = (typeof AGENT_CATEGORIES)[number];

// Supported chains
export const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', symbol: 'ETH' },
  { id: 137, name: 'Polygon', symbol: 'MATIC' },
  { id: 10, name: 'Optimism', symbol: 'ETH' },
  { id: 42161, name: 'Arbitrum', symbol: 'ETH' },
  { id: 8453, name: 'Base', symbol: 'ETH' },
] as const;

// Currencies
export const SUPPORTED_CURRENCIES = ['USD', 'USDC', 'ETH'] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

// Time periods for analytics
export const TIME_PERIODS = ['7d', '30d', '90d', 'all'] as const;
export type TimePeriod = (typeof TIME_PERIODS)[number];

// Leaderboard metrics
export const LEADERBOARD_METRICS = ['revenue', 'calls'] as const;
export type LeaderboardMetric = (typeof LEADERBOARD_METRICS)[number];

// Bill roles
export const BILL_ROLES = ['payer', 'payee'] as const;
export type BillRole = (typeof BILL_ROLES)[number];

// Proposal types
export const PROPOSAL_TYPES = ['list', 'delist', 'price_change', 'dispute'] as const;
export type ProposalType = (typeof PROPOSAL_TYPES)[number];

// Rate limits
export const RATE_LIMITS = {
  AUTH_NONCE: { requests: 5, windowMs: 60000 },
  AUTH_VERIFY: { requests: 10, windowMs: 60000 },
  AGENTS_LIST: { requests: 60, windowMs: 60000 },
  AGENTS_CREATE: { requests: 10, windowMs: 60000 },
  ORDERS_CREATE: { requests: 10, windowMs: 60000 },
} as const;

// Cache TTLs (in seconds)
export const CACHE_TTL = {
  NONCE: 300, // 5 minutes
  AGENT_DETAIL: 600, // 10 minutes
  LEADERBOARD: 300, // 5 minutes
  RATE_LIMIT: 60, // 1 minute
} as const;

// Revenue split basis points (10000 = 100%)
export const DEFAULT_REVENUE_SPLITS = {
  DEVELOPER: 7000, // 70%
  PLATFORM: 2000, // 20%
  DAO: 1000, // 10%
} as const;
