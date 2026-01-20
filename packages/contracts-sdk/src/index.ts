import { createPublicClient, createWalletClient, http, type Chain, type PublicClient, type WalletClient } from 'viem';
import { mainnet, polygon, optimism, arbitrum, base } from 'viem/chains';

// Supported chains configuration
export const supportedChains: Record<number, Chain> = {
  1: mainnet,
  137: polygon,
  10: optimism,
  42161: arbitrum,
  8453: base,
};

// Get chain by ID
export function getChain(chainId: number): Chain | undefined {
  return supportedChains[chainId];
}

// Create public client for reading from chain
export function createPublicClientForChain(chainId: number): PublicClient | null {
  const chain = getChain(chainId);
  if (!chain) return null;

  return createPublicClient({
    chain,
    transport: http(),
  });
}

// ERC20 ABI (minimal for transfers and balances)
export const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
] as const;

// Common token addresses
export const tokenAddresses: Record<number, Record<string, `0x${string}`>> = {
  1: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EescdeCB5BadAc6f',
  },
  137: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  },
  10: {
    USDC: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
  42161: {
    USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
  8453: {
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  },
};

// Governor ABI (minimal for voting)
export const governorAbi = [
  {
    type: 'function',
    name: 'castVote',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'uint8' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'castVoteWithReason',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'uint8' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getVotes',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'blockNumber', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'hasVoted',
    stateMutability: 'view',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'account', type: 'address' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'proposalVotes',
    stateMutability: 'view',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [
      { name: 'againstVotes', type: 'uint256' },
      { name: 'forVotes', type: 'uint256' },
      { name: 'abstainVotes', type: 'uint256' },
    ],
  },
] as const;

// Helper to format wei to ether
export function formatEther(wei: bigint, decimals = 18): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = wei / divisor;
  const fractionalPart = wei % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0').slice(0, 4);
  return `${integerPart}.${fractionalStr}`;
}

// Helper to parse ether to wei
export function parseEther(ether: string, decimals = 18): bigint {
  const [integerPart, fractionalPart = ''] = ether.split('.');
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integerPart + paddedFractional);
}

// SIWE message template
export function createSiweMessage(params: {
  domain: string;
  address: string;
  statement?: string;
  uri: string;
  version?: string;
  chainId: number;
  nonce: string;
  issuedAt?: string;
  expirationTime?: string;
}): string {
  const {
    domain,
    address,
    statement = 'Sign in to Agent Marketplace',
    uri,
    version = '1',
    chainId,
    nonce,
    issuedAt = new Date().toISOString(),
    expirationTime,
  } = params;

  let message = `${domain} wants you to sign in with your Ethereum account:\n${address}\n\n`;
  message += `${statement}\n\n`;
  message += `URI: ${uri}\n`;
  message += `Version: ${version}\n`;
  message += `Chain ID: ${chainId}\n`;
  message += `Nonce: ${nonce}\n`;
  message += `Issued At: ${issuedAt}`;

  if (expirationTime) {
    message += `\nExpiration Time: ${expirationTime}`;
  }

  return message;
}

export { mainnet, polygon, optimism, arbitrum, base } from 'viem/chains';
export type { Chain, PublicClient, WalletClient } from 'viem';
