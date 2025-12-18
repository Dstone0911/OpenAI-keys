
import React, { useState, useMemo } from 'react';
import { ArrowDown, RefreshCw, Info, AlertTriangle, Zap } from 'lucide-react';
import { TestnetAsset } from '../types';

interface SwapInterfaceProps {
  assets: TestnetAsset[];
  onSwap: (fromSymbol: string, toSymbol: string, amount: number, received: number) => void;
}

const SwapInterface: React.FC<SwapInterfaceProps> = ({ assets, onSwap }) => {
  const [fromToken, setFromToken] = useState<string>(assets[0]?.symbol || '');
  const [toToken, setToToken] = useState<string>(assets[1]?.symbol || '');
  const [amount, setAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);

  // Simplified AMM Simulation (Constant Product: x * y = k)
  // We'll assume a large mock liquidity pool for each pair to keep it simple
  const poolSize = 1000000; 
  
  const fromAsset = assets.find(a => a.symbol === fromToken);
  const toAsset = assets.find(a => a.symbol === toToken);

  const swapQuote = useMemo(() => {
    const inputNum = parseFloat(amount);
    if (isNaN(inputNum) || inputNum <= 0 || !fromAsset || !toAsset) return 0;
    
    // Simple constant product formula for simulation
    // out = (y * dX) / (x + dX)
    const output = (poolSize * inputNum) / (poolSize + inputNum);
    return parseFloat(output.toFixed(6));
  }, [amount, fromAsset, toAsset]);

  const priceImpact = useMemo(() => {
    const inputNum = parseFloat(amount);
    if (isNaN(inputNum) || inputNum <= 0) return 0;
    return (inputNum / poolSize) * 100;
  }, [amount]);

  const handleSwapExecute = () => {
    if (swapQuote <= 0 || !fromAsset || isSwapping) return;
    
    setIsSwapping(true);
    // Simulate network delay
    setTimeout(() => {
      onSwap(fromToken, toToken, parseFloat(amount), swapQuote);
      setAmount('');
      setIsSwapping(false);
    }, 1500);
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const isInsufficient = fromAsset && parseFloat(amount) > fromAsset.balance;

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col p-6 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-heading font-bold text-gray-200 uppercase tracking-tighter flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
          Virtual Swap Engine
        </h2>
        <button className="text-gray-500 hover:text-gray-300 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        {/* From Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>You pay</span>
            <span>Balance: {fromAsset?.balance.toLocaleString()} {fromToken}</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="bg-transparent text-2xl font-bold w-full focus:outline-none text-gray-100"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none"
            >
              {assets.map(a => (
                <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Switch Button */}
        <div className="relative h-2 flex justify-center z-10">
          <button 
            onClick={switchTokens}
            className="absolute -top-3 bg-gray-800 border border-gray-700 p-1.5 rounded-lg hover:bg-gray-700 transition-colors group"
          >
            <ArrowDown className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* To Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>You receive (estimated)</span>
            <span>Balance: {toAsset?.balance.toLocaleString()} {toToken}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold w-full text-gray-400">
              {swapQuote || '0.0'}
            </div>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none"
            >
              {assets.map(a => (
                <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      {parseFloat(amount) > 0 && (
        <div className="bg-blue-900/10 border border-blue-500/10 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Price Impact</span>
            <span className={priceImpact > 2 ? 'text-orange-400' : 'text-emerald-400'}>
              {priceImpact.toFixed(4)}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Minimum Received</span>
            <span className="text-gray-300">{(swapQuote * 0.995).toFixed(6)} {toToken}</span>
          </div>
        </div>
      )}

      {isInsufficient && (
        <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-400/5 p-2 rounded border border-orange-400/20">
          <AlertTriangle className="w-4 h-4" />
          Insufficient {fromToken} balance in your virtual wallet.
        </div>
      )}

      <button
        disabled={!amount || isInsufficient || fromToken === toToken || isSwapping}
        onClick={handleSwapExecute}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
          isSwapping 
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
        } disabled:opacity-50 disabled:shadow-none`}
      >
        {isSwapping ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Simulating Transaction...
          </>
        ) : isInsufficient ? (
          'Insufficient Balance'
        ) : fromToken === toToken ? (
          'Select Different Tokens'
        ) : !amount ? (
          'Enter Amount'
        ) : (
          'Swap Virtual Tokens'
        )}
      </button>

      <div className="flex items-center gap-2 text-[10px] text-gray-600 mt-2">
        <Info className="w-3 h-3" />
        <span>Swaps use a simulated constant product AMM with virtual liquidity pools. No real mainnet assets are affected.</span>
      </div>
    </div>
  );
};

export default SwapInterface;
