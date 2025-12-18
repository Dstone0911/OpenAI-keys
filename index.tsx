import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { sepolia, arbitrumSepolia, polygonAmoy } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Get projectId (Using a stable public project ID for demo)
const projectId = '8e063c80aa47391605220ad337777085';

// 2. Create wagmiConfig with the requested testnet chains
const metadata = {
  name: 'VirtualAlpha',
  description: 'Testnet Simulation Lab',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [sepolia, arbitrumSepolia, polygonAmoy] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 3. Create modal with robust settings for restricted origin environments
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableEIP6963: true,
  enableAnalytics: false,
  enableOnramp: false,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#2563eb',
    '--w3m-border-radius-master': '1px',
    '--w3m-z-index': 9999
  }
});

// 4. Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);