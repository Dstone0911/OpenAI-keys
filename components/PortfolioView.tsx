
import React from 'react';
import { Wallet, TrendingUp, ArrowUpRight } from 'lucide-react';
import { TestnetAsset } from '../types';

interface PortfolioViewProps {
  assets: TestnetAsset[];
  totalValue: string;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ assets, totalValue }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="text-emerald-400 w-5 h-5" />
          <h2 className="text-xl font-heading font-bold text-gray-100">Virtual Portfolio</h2>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Total Value</span>
          <span className="text-2xl font-bold text-emerald-400 font-heading">{totalValue}</span>
        </div>
      </div>

      <div className="space-y-3">
        {assets.map((asset) => (
          <div 
            key={asset.symbol}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-950 border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/20">
                <span className="font-bold text-blue-400">{asset.symbol[0]}</span>
              </div>
              <div>
                <div className="font-bold text-gray-100">{asset.symbol}</div>
                <div className="text-xs text-gray-500">{asset.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-200">{asset.balance.toLocaleString()} {asset.symbol}</div>
              <div className="text-xs text-gray-500">${asset.valueUsd.toLocaleString()} Virtual</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-800">
        <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg transition-colors text-sm">
          <TrendingUp className="w-4 h-4" />
          View Transaction History
        </button>
      </div>
    </div>
  );
};

export default PortfolioView;
