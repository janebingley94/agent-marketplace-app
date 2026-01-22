import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const wagmiConfig: ReturnType<typeof createConfig> = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [],
  ssr: true,
});
