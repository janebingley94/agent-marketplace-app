import { SiweMessage } from 'siwe';
import { apiFetch } from './api-client';
import type { AuthUser } from '@/atoms/auth';

export type NonceResponse = {
  nonce: string;
  expiresAt: string;
};

type VerifyResponse = {
  accessToken: string;
  expiresIn: number;
  user: {
    id: string;
    address: string;
    name: string | null;
    avatarUrl: string | null;
  };
};

export async function requestNonce(address: string, chainId: number) {
  return apiFetch<NonceResponse>('/auth/nonce', {
    method: 'POST',
    body: JSON.stringify({ address, chainId }),
  });
}

export function buildSiweMessage(params: {
  address: string;
  chainId: number;
  nonce: string;
  domain: string;
  uri: string;
}) {
  const message = new SiweMessage({
    domain: params.domain,
    address: params.address,
    statement: 'Sign in to Agent Marketplace',
    uri: params.uri,
    version: '1',
    chainId: params.chainId,
    nonce: params.nonce,
  });

  return message.prepareMessage();
}

export async function verifySignature(payload: {
  message: string;
  signature: string;
  address: string;
  chainId: number;
}) {
  return apiFetch<VerifyResponse>('/auth/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchMe(token: string) {
  return apiFetch<AuthUser>('/auth/me', { token });
}

export async function signInWithWallet(params: {
  address: string;
  chainId: number;
  signMessage: (message: string) => Promise<string>;
  domain: string;
  uri: string;
}) {
  const nonceResponse = await requestNonce(params.address, params.chainId);
  const message = buildSiweMessage({
    address: params.address,
    chainId: params.chainId,
    nonce: nonceResponse.nonce,
    domain: params.domain,
    uri: params.uri,
  });
  const signature = await params.signMessage(message);
  return verifySignature({
    message,
    signature,
    address: params.address,
    chainId: params.chainId,
  });
}
