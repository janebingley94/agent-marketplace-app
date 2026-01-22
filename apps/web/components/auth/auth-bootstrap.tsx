'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { accessTokenAtom, authLoadingAtom, userAtom } from '@/atoms/auth';
import { fetchMe } from '@/lib/auth';

export function AuthBootstrap() {
  const [accessToken] = useAtom(accessTokenAtom);
  const [, setUser] = useAtom(userAtom);
  const [, setLoading] = useAtom(authLoadingAtom);

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const user = await fetchMe(accessToken);
        if (isMounted) {
          setUser(user);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [accessToken, setLoading, setUser]);

  return null;
}
