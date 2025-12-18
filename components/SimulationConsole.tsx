
import React, { useState } from 'react';
import { Terminal, Play, Zap, CheckCircle, Loader2, Code } from 'lucide-react';
import { SimulationStrategy } from '../types';
import { analyzeStrategy } from '../services/geminiService';

interface SimulationConsoleProps {
  assets: any[];
  networkName: string;
}

const SimulationConsole: React.FC<SimulationConsoleProps> = ({ assets, networkName }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<SimulationStrategy>(SimulationStrategy.ARBITRAGE);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const analysis = await analyzeStrategy(selectedStrategy, assets, networkName, prompt);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal className="text-blue-400 w-5 h-5" />
          <h2 className="font-heading font-bold text-gray-200 uppercase tracking-tighter">AI Extraction Architect</h2>
        </div>
        <div className="flex gap-2">
          {Object.values(SimulationStrategy).map((strat) => (
            <button
              key={strat}
              onClick={() => setSelectedStrategy(strat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                selectedStrategy === strat ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {strat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
            <Zap className="w-12 h-12 text-blue-500 mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Define your extraction goal</h3>
            <p className="text-gray-500 text-sm">
              Ask the architect to find arbitrage paths, optimize staking, or perform a complex flash loan attack simulation on your virtual fork.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <div className="text-gray-400 font-medium animate-pulse">Consulting Gemini for optimal strategies...</div>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-400 w-5 h-5" />
                <h3 className="text-lg font-bold text-blue-100">{result.title}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">{result.summary}</p>
              <div className="bg-gray-950 p-3 rounded border border-gray-800 mb-4">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Expected Virtual Alpha</div>
                <div className="text-2xl font-bold text-emerald-400 font-heading">{result.estimatedProfit}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Execution Sequence</h4>
              <div className="space-y-2">
                {result.steps.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-300 mt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contract Snippet</h4>
                <button className="text-blue-400 text-xs flex items-center gap-1 hover:underline">
                  <Code className="w-3 h-3" /> Copy
                </button>
              </div>
              <pre className="bg-gray-950 border border-gray-800 p-4 rounded text-xs text-blue-300 font-mono overflow-x-auto">
                {result.code}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-4 border-t border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
            placeholder="E.g. simulate a flash loan arbitrage between Uniswap and SushiSwap..."
            className="w-full bg-gray-950 border border-gray-700 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSimulate}
            disabled={loading || !prompt}
            className="absolute right-2 top-1.5 p-1.5 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Play className="w-5 h-5 text-white fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationConsole;
