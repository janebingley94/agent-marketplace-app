import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type AuthUser = {
  id: string;
  name: string | null;
  email?: string | null;
  avatarUrl: string | null;
  wallets?: Array<{
    id: string;
    chainId: number;
    address: string;
    isPrimary: boolean;
  }>;
  createdAt?: string;
  address?: string;
};

export const accessTokenAtom = atomWithStorage<string | null>('accessToken', null);
export const userAtom = atom<AuthUser | null>(null);
export const authLoadingAtom = atom(false);
export const isAuthenticatedAtom = atom((get) => Boolean(get(accessTokenAtom)));
