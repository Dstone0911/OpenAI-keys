
import React, { useState } from 'react';
import { Globe, ShieldAlert, Cpu, Wallet } from 'lucide-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';

interface RpcSelectorProps {
  onSelect: (config: { name: string; rpc: string; isVirtual: boolean }) => void;
}

const RpcSelector: React.FC<RpcSelectorProps> = ({ onSelect }) => {
  const { open } = useWeb3Modal();
  const [customRpc, setCustomRpc] = useState('');

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
          <Wallet className="text-white w-8 h-8" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-gray-100 mb-2">Initialize Environment</h2>
        <p className="text-gray-400 text-sm">Connect your wallet to start the simulation engine.</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => open()}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-blue-600/20 active:scale-[0.98]"
        >
          <img src="https://avatars.githubusercontent.com/u/37784886" alt="WalletConnect" className="w-6 h-6 rounded-md" />
          Connect with WalletConnect
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
            <span className="bg-gray-900 px-4 text-gray-600">or use custom rpc</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tenderly / Fork RPC</label>
            <input
              type="text"
              value={customRpc}
              onChange={(e) => setCustomRpc(e.target.value)}
              placeholder="https://rpc.tenderly.co/..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono text-blue-400 placeholder:text-gray-700 outline-none"
            />
          </div>
          <button
            onClick={() => customRpc && onSelect({ name: 'Custom Fork', rpc: customRpc, isVirtual: true })}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 px-4 rounded-xl transition-colors text-sm border border-gray-700"
          >
            Connect Custom Endpoint
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-800/50">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Supports<br/>Virtual Forks</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-800/50">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Safe<br/>Simulation</span>
        </div>
      </div>
    </div>
  );
};

export default RpcSelector;
