'use client';

import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import { useAccount, useChainId, useConnect, useDisconnect, useSignMessage } from 'wagmi';

import { Button } from '@/components/ui/button';
import { accessTokenAtom, authLoadingAtom, userAtom } from '@/atoms/auth';
import { signInWithWallet } from '@/lib/auth';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [, setUser] = useAtom(userAtom);
  const [authLoading, setAuthLoading] = useAtom(authLoadingAtom);

  const connector = useMemo(() => connectors[0], [connectors]);

  const handleConnect = async () => {
    if (!connector) return;
    connect({ connector });
  };

  const handleSignIn = async () => {
    if (!address || !chainId) return;
    setAuthLoading(true);
    try {
      const response = await signInWithWallet({
        address,
        chainId,
        signMessage: (message) => signMessageAsync({ message }),
        domain: window.location.host,
        uri: window.location.origin,
      });
      setAccessToken(response.accessToken);
      setUser(response.user);
    } finally {
      setAuthLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} disabled={!connector || isPending}>
        Connect Wallet
      </Button>
    );
  }

  if (!accessToken) {
    return (
      <Button onClick={handleSignIn} disabled={authLoading}>
        Sign in with Wallet
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={() => disconnect()}>
      Disconnect
    </Button>
  );
}
