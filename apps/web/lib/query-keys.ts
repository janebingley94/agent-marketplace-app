import type { AgentFilters, LeaderboardParams } from './agents';

export const queryKeys = {
  agents: {
    list: (filters: AgentFilters) => ['agents', 'list', filters] as const,
    leaderboard: (params: LeaderboardParams) => ['agents', 'leaderboard', params] as const,
    detail: (slug: string) => ['agents', 'detail', slug] as const,
  },
};
