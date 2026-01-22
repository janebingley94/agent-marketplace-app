import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { WalletButton } from '@/components/wallet/wallet-button';

const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
const mockSignMessage = vi.fn();

vi.mock('wagmi', () => ({
  useAccount: () => ({ isConnected: false, address: undefined }),
  useChainId: () => 1,
  useConnect: () => ({
    connect: mockConnect,
    connectors: [{ id: 'injected', name: 'Injected', ready: true }],
    isPending: false,
  }),
  useDisconnect: () => ({ disconnect: mockDisconnect }),
  useSignMessage: () => ({ signMessageAsync: mockSignMessage }),
}));

vi.mock('@/lib/auth', () => ({
  signInWithWallet: vi.fn(),
}));

describe('WalletButton', () => {
  it('renders connect button when disconnected', () => {
    render(<WalletButton />);
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('triggers connect when clicked', () => {
    render(<WalletButton />);
    fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
    expect(mockConnect).toHaveBeenCalled();
  });
});
