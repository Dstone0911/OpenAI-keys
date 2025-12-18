
import React, { useState, useEffect } from 'react';
import { Shuffle, ArrowRight, Waves, ShieldCheck, Loader2, Info, ExternalLink, Zap } from 'lucide-react';
import { TestnetAsset } from '../types';

interface BridgeInterfaceProps {
  assets: TestnetAsset[];
  onBridge: (token: string, amount: number) => void;
}

const BridgeInterface: React.FC<BridgeInterfaceProps> = ({ assets, onBridge }) => {
  const [selectedToken, setSelectedToken] = useState(assets[0]?.symbol || '');
  const [amount, setAmount] = useState('');
  const [isBridging, setIsBridging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');

  const asset = assets.find(a => a.symbol === selectedToken);
  
  const handleBridge = () => {
    if (!amount || parseFloat(amount) <= 0 || !asset) return;
    
    setIsBridging(true);
    setProgress(0);
    setStatus('Initiating Cross-Chain Intent...');

    const duration = 5000; // 5 seconds simulation
    const interval = 50;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Update status text based on progress
        if (prev > 20 && prev < 50) setStatus('Locking Assets on Testnet...');
        if (prev >= 50 && prev < 80) setStatus('Validating State Proofs...');
        if (prev >= 80) setStatus('Minting Virtual Mainnet Credit...');
        
        return prev + step;
      });
    }, interval);

    setTimeout(() => {
      onBridge(selectedToken, parseFloat(amount));
      setIsBridging(false);
      setAmount('');
      setStatus('Success');
    }, duration + 500);
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-bold text-gray-200 uppercase tracking-tighter flex items-center gap-2">
          <Waves className="w-5 h-5 text-blue-400" />
          Virtual Alpha Bridge
        </h2>
        <div className="bg-blue-600/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20 uppercase">
          Simulated LayerZero / Wormhole
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* Source */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Source (Testnet)</label>
          <div className="flex items-center justify-between mb-4">
            <select 
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="bg-transparent text-xl font-bold focus:outline-none text-gray-100 cursor-pointer"
            >
              {assets.map(a => <option key={a.symbol} value={a.symbol}>{a.symbol}</option>)}
            </select>
            <span className="text-xs text-gray-500">Bal: {asset?.balance.toLocaleString()}</span>
          </div>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shuffle className="text-white w-5 h-5" />
          </div>
        </div>

        {/* Destination */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Destination (Mainnet)</label>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Zap className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-gray-400">Mainnet Simulation</span>
          </div>
          <div className="text-xs text-gray-500 italic">
            {amount ? `~${(parseFloat(amount) * 0.999).toFixed(4)} ${selectedToken} (Net of slippage)` : 'Enter amount to estimate'}
          </div>
        </div>
      </div>

      {isBridging ? (
        <div className="space-y-4 animate-in fade-in zoom-in">
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              {status}
            </span>
            <span className="text-xs text-gray-500 font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <button
          disabled={!amount || parseFloat(amount) <= 0 || (asset && parseFloat(amount) > asset.balance)}
          onClick={handleBridge}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:grayscale"
        >
          {asset && parseFloat(amount) > asset.balance ? 'Insufficient Balance' : 'Extract to Mainnet'}
        </button>
      )}

      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 space-y-2">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5" />
          <div className="text-[10px] text-gray-400">
            <strong>Simulation Guard Active:</strong> Your private keys never leave the browser. Bridging is executed via a virtual state-transition proof.
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 mt-0.5" />
          <div className="text-[10px] text-gray-400">
            Testnet tokens have no real value. This bridge simulates the conversion of "Testnet Alpha" into "Virtual Mainnet Credit" for strategy backtesting.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeInterface;
