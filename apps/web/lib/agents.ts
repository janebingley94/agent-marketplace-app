import { apiFetch } from './api-client';

export type AgentOwnerSummary = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
};

export type PricingPlanSummary = {
  id: string;
  type: string;
  name: string;
  price: string;
  period: string | null;
};

export type AgentListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  tags: string[];
  iconUrl: string | null;
  status: string;
  totalCalls: number;
  totalRevenue: string;
  owner: AgentOwnerSummary;
  plans: PricingPlanSummary[];
  createdAt: string;
};

export type AgentDetail = AgentListItem;

export type AgentListResponse = {
  data: AgentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type LeaderboardItem = {
  agent: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
  revenue: string;
  calls: number;
  percentage: number;
  status: string;
};

export type LeaderboardResponse = {
  data: LeaderboardItem[];
};

export type AgentFilters = {
  q?: string | null;
  category?: string | null;
  tags?: string[];
  status?: string | null;
  sort?: string | null;
  order?: string | null;
  page?: number;
  limit?: number;
};

export type LeaderboardParams = {
  metric?: 'revenue' | 'calls';
  limit?: number;
};

const buildSearchParams = (filters: AgentFilters) => {
  const params = new URLSearchParams();

  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.status) params.set('status', filters.status);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.order) params.set('order', filters.order);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.tags && filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','));
  }

  return params;
};

export async function getAgents(filters: AgentFilters) {
  const params = buildSearchParams(filters);
  const query = params.toString();
  return apiFetch<AgentListResponse>(`/agents${query ? `?${query}` : ''}`);
}

export async function getLeaderboard(params: LeaderboardParams) {
  const search = new URLSearchParams();
  if (params.metric) search.set('metric', params.metric);
  if (params.limit) search.set('limit', String(params.limit));
  const query = search.toString();
  return apiFetch<LeaderboardResponse>(`/agents/leaderboard${query ? `?${query}` : ''}`);
}

export async function getAgentBySlug(slug: string) {
  return apiFetch<AgentDetail>(`/agents/${slug}`);
}
