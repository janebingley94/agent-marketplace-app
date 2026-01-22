'use client';

import React, { type ReactNode, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { WagmiProvider } from 'wagmi';

import { createQueryClient } from '@/lib/query-client';
import { wagmiConfig } from '@/lib/wagmi';
import { AuthBootstrap } from '@/components/auth/auth-bootstrap';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <AuthBootstrap />
          {children}
        </JotaiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
