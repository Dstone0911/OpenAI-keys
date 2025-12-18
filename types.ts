
export interface TestnetAsset {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  contractAddress: string;
  type: 'Native' | 'ERC20' | 'Virtual';
}

export interface SimulationStep {
  id: string;
  action: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
}

export interface NetworkConfig {
  id: string;
  name: string;
  rpcUrl: string;
  isVirtual: boolean;
  chainId: number;
}

export enum SimulationStrategy {
  ARBITRAGE = 'Arbitrage',
  YIELD_FARMING = 'Yield Farming',
  LIQUIDATION = 'Liquidation',
  SANDBOX_TEST = 'Sandbox Test'
}
