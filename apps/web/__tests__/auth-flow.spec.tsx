import { vi } from 'vitest';
import { buildSiweMessage, signInWithWallet } from '@/lib/auth';

const mockRequestNonce = vi.fn();
const mockVerify = vi.fn();
const mockSign = vi.fn();

vi.mock('@/lib/api-client', () => ({
  apiFetch: (path: string) => {
    if (path === '/auth/nonce') return mockRequestNonce();
    if (path === '/auth/verify') return mockVerify();
    throw new Error('unknown path');
  },
}));

vi.mock('siwe', () => ({
  SiweMessage: class {
    private readonly nonce: string;

    constructor(params: { nonce: string }) {
      this.nonce = params.nonce;
    }

    prepareMessage() {
      return `Sign in to Agent Marketplace\nNonce: ${this.nonce}`;
    }
  },
}));

describe('auth flow', () => {
  it('builds a SIWE message', () => {
    const message = buildSiweMessage({
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      chainId: 1,
      nonce: 'abc123',
      domain: 'localhost:7002',
      uri: 'http://localhost:7002',
    });

    expect(message).toContain('Sign in to Agent Marketplace');
    expect(message).toContain('Nonce: abc123');
  });

  it('signs in using nonce and signature', async () => {
    mockRequestNonce.mockResolvedValueOnce({ nonce: 'abc123', expiresAt: 'now' });
    mockVerify.mockResolvedValueOnce({
      accessToken: 'token',
      expiresIn: 86400,
      user: { id: 'user_1', address: '0x1', name: null, avatarUrl: null },
    });
    mockSign.mockResolvedValueOnce('0xsig');

    const response = await signInWithWallet({
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      chainId: 1,
      signMessage: mockSign,
      domain: 'localhost:7002',
      uri: 'http://localhost:7002',
    });

    expect(mockRequestNonce).toHaveBeenCalled();
    expect(mockSign).toHaveBeenCalled();
    expect(mockVerify).toHaveBeenCalled();
    expect(response.accessToken).toBe('token');
  });
});
