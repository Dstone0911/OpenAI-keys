import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Zap, 
  Info,
  ExternalLink,
  ArrowLeftRight,
  Terminal as TerminalIcon,
  Waves,
  ChevronDown,
  Globe,
  Cpu,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { sepolia, arbitrumSepolia, polygonAmoy } from 'wagmi/chains';
import RpcSelector from './components/RpcSelector';
import PortfolioView from './components/PortfolioView';
import SimulationConsole from './components/SimulationConsole';
import SwapInterface from './components/SwapInterface';
import BridgeInterface from './components/BridgeInterface';
import { TestnetAsset } from './types';

const App: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const [activeTab, setActiveTab] = useState<'console' | 'swap' | 'bridge'>('console');
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
  
  // Supported testnets specifically for this simulation lab
  const supportedTestnets = useMemo(() => [
    { chain: sepolia, name: 'Sepolia', icon: Globe, color: 'text-blue-400' },
    { chain: arbitrumSepolia, name: 'Arbitrum Sepolia', icon: Activity, color: 'text-indigo-400' },
    { chain: polygonAmoy, name: 'Polygon Amoy', icon: ShieldCheck, color: 'text-purple-400' },
  ], []);

  const networkName = useMemo(() => {
    if (!isConnected) return 'Not Connected';
    const current = supportedTestnets.find(t => t.chain.id === chainId);
    return current ? current.name : 'Unknown Network';
  }, [isConnected, chainId, supportedTestnets]);

  // State for Testnet Assets - In a real app, these would be fetched from the provider
  const [assets, setAssets] = useState<TestnetAsset[]>([
    { symbol: 'ETH', name: 'Ethereum (Virtual)', balance: 100.0, valueUsd: 250000, contractAddress: '0x0', type: 'Native' },
    { symbol: 'USDC', name: 'USD Coin', balance: 50000.0, valueUsd: 50000, contractAddress: '0xA...B', type: 'ERC20' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: 2.5, valueUsd: 162500, contractAddress: '0xC...D', type: 'ERC20' },
    { symbol: 'TNDR', name: 'Tenderly Mock Token', balance: 10000.0, valueUsd: 0, contractAddress: '0xE...F', type: 'Virtual' },
  ]);

  // State for Bridged Mainnet Assets (Simulated extractions)
  const [mainnetAssets, setMainnetAssets] = useState<TestnetAsset[]>([]);

  const handleSwap = (fromSymbol: string, toSymbol: string, amount: number, received: number) => {
    setAssets(prevAssets => {
      return prevAssets.map(asset => {
        if (asset.symbol === fromSymbol) {
          return { ...asset, balance: asset.balance - amount };
        }
        if (asset.symbol === toSymbol) {
          return { ...asset, balance: asset.balance + received };
        }
        return asset;
      });
    });
  };

  const handleBridge = (tokenSymbol: string, amount: number) => {
    const sourceAsset = assets.find(a => a.symbol === tokenSymbol);
    if (!sourceAsset) return;

    setAssets(prev => prev.map(a => 
      a.symbol === tokenSymbol ? { ...a, balance: a.balance - amount } : a
    ));

    setMainnetAssets(prev => {
      const existing = prev.find(a => a.symbol === tokenSymbol);
      if (existing) {
        return prev.map(a => a.symbol === tokenSymbol ? { ...a, balance: a.balance + amount } : a);
      } else {
        return [...prev, { ...sourceAsset, balance: amount, type: 'Virtual' }];
      }
    });
  };

  const handleNetworkSwitch = (targetChainId: number) => {
    if (switchChain) {
      switchChain({ chainId: targetChainId });
    }
    setIsNetworkMenuOpen(false);
  };

  const totalValue = useMemo(() => assets.reduce((sum, asset) => {
    const pricePerToken = asset.balance === 0 ? 0 : asset.valueUsd / (asset.balance || 1);
    return sum + (asset.balance * pricePerToken);
  }, 0), [assets]);

  const mainnetTotalValue = useMemo(() => mainnetAssets.reduce((sum, asset) => {
    const pricePerToken = (asset.valueUsd / (asset.balance || 1)) || 2500;
    return sum + (asset.balance * pricePerToken);
  }, 0), [mainnetAssets]);

  const formattedTotalValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalValue + mainnetTotalValue);

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-gray-100 selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Layers className="text-white w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-black tracking-tighter uppercase leading-none">VirtualAlpha</h1>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Simulation Lab</span>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
              <button 
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1 transition-colors ${activeTab === 'console' ? 'text-blue-400' : 'hover:text-gray-100'}`}
              >
                <TerminalIcon className="w-4 h-4" /> Console
              </button>
              <button 
                onClick={() => setActiveTab('swap')}
                className={`flex items-center gap-1 transition-colors ${activeTab === 'swap' ? 'text-blue-400' : 'hover:text-gray-100'}`}
              >
                <ArrowLeftRight className="w-4 h-4" /> Swap
              </button>
              <button 
                onClick={() => setActiveTab('bridge')}
                className={`flex items-center gap-1 transition-colors ${activeTab === 'bridge' ? 'text-blue-400' : 'hover:text-gray-100'}`}
              >
                <Waves className="w-4 h-4" /> Bridge
              </button>
            </nav>

            <div className="flex items-center gap-3 relative">
              {isConnected && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-800 bg-gray-900/50 text-xs font-mono text-gray-400">
                  {shortAddress}
                </div>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => isConnected && setIsNetworkMenuOpen(!isNetworkMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                    isConnected ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20' : 'bg-gray-800 border-gray-700 text-gray-500'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></div>
                  <span className="max-w-[100px] truncate">{networkName}</span>
                  {isConnected && <ChevronDown className={`w-3 h-3 transition-transform ${isNetworkMenuOpen ? 'rotate-180' : ''}`} />}
                </button>

                {isNetworkMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 mb-1">
                      Target Environment
                    </div>
                    {supportedTestnets.map((item) => (
                      <button
                        key={item.chain.id}
                        onClick={() => handleNetworkSwitch(item.chain.id)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${
                          chainId === item.chain.id ? 'text-blue-400 bg-blue-400/5 font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${chainId === item.chain.id ? 'text-blue-400' : 'text-gray-500'}`} />
                        {item.name}
                        {chainId === item.chain.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></div>}
                      </button>
                    ))}
                    <div className="border-t border-gray-800 mt-1 pt-1">
                      <button 
                        onClick={() => disconnect()}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/5 transition-colors"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay to close dropdown */}
      {isNetworkMenuOpen && <div className="fixed inset-0 z-50" onClick={() => setIsNetworkMenuOpen(false)}></div>}

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {!isConnected ? (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-heading font-black mb-4 bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Extract Alpha from the Multiverse.
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Connect your wallet to bridge testnet assets to our virtual mainnet. 
                Simulate high-stakes DeFi strategies across Sepolia, Arbitrum, and Polygon.
              </p>
            </div>
            <RpcSelector onSelect={() => {}} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Left Column: Stats & Portfolio */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-4">
                <PortfolioView assets={assets} totalValue={formattedTotalValue} />
                
                {mainnetAssets.length > 0 && (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Zap className="w-20 h-20 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="text-emerald-400 w-5 h-5" />
                      <h3 className="font-heading font-bold text-emerald-100">Virtual Mainnet Credit</h3>
                    </div>
                    <div className="space-y-2 relative z-10">
                      {mainnetAssets.map(a => (
                        <div key={a.symbol} className="flex justify-between text-sm">
                          <span className="text-gray-400">{a.symbol} Extracted</span>
                          <span className="text-emerald-400 font-bold">{a.balance.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-blue-400 w-5 h-5" />
                  <h3 className="font-heading font-bold text-gray-200">Environment Specs</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Extraction Active</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      Live
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Virtual Chain ID</span>
                    <span className="text-blue-400 font-mono">{chainId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Relayer Latency</span>
                    <span className="text-gray-300">~14ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Active Feature */}
            <div className="lg:col-span-8">
              <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { id: 'console', label: 'Strategy Console', icon: TerminalIcon },
                  { id: 'swap', label: 'Virtual Swap', icon: ArrowLeftRight },
                  { id: 'bridge', label: 'Alpha Bridge', icon: Waves }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-900 text-gray-500 hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="min-h-[500px]">
                {activeTab === 'console' && <SimulationConsole assets={assets} networkName={networkName} />}
                {activeTab === 'swap' && <SwapInterface assets={assets} onSwap={handleSwap} />}
                {activeTab === 'bridge' && <BridgeInterface assets={assets} onBridge={handleBridge} />}
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors"><ExternalLink className="w-3 h-3" /> Tenderly Forks</span>
                  <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors"><ExternalLink className="w-3 h-3" /> Virtual Explorer</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="italic">Powered by Gemini 3 Flash and Alpha Bridge Engine</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-900 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span>© 2024 VirtualAlpha Simulation Lab. Educational Purpose Only.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Simulation</a>
            <a href="#" className="hover:text-gray-400 transition-colors">API Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;