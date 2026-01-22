import { createConfig, http } from 'wagmi';
import { injected } from '@wagmi/connectors';
import { mainnet, sepolia } from 'wagmi/chains';

export const wagmiConfig: ReturnType<typeof createConfig> = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [injected()],
  ssr: true,
});
