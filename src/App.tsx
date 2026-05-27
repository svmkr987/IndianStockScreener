import { useState } from 'react';
import { Search, Info, TrendingUp, AlertCircle, BarChart2 } from 'lucide-react';
import { StockAnalyzer } from './utils';
import type { StockData } from './types';
import { MetricsGrid } from './components/MetricsGrid';
import { PriceChart } from './components/PriceChart';
import { ScoreGauge } from './components/ScoreGauge';

export default function App() {
  const [symbols, setSymbols] = useState('');
  const [showChart, setShowChart] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StockData[]>([]);
  const [error, setError] = useState('');
  
  const handleAnalyze = async () => {
    if (!symbols.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const resp = await fetch(`/api/analyze?symbols=${encodeURIComponent(symbols)}`);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Fetch failed');
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 flex-grow-0 shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-slate-800">Stock Screener</h1>
              <p className="text-xs text-slate-400">Indian Markets (NSE)</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col gap-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Instructions
            </h3>
            <ul className="text-[13px] space-y-2 text-slate-600">
              <li className="flex gap-2"><span>1.</span><span>Enter stock name(s) in the input box</span></li>
              <li className="flex gap-2"><span>2.</span><span>For multiple stocks, separate with commas</span></li>
              <li className="flex gap-2"><span>3.</span><span>Add .NS suffix automatically for NSE stocks</span></li>
            </ul>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
              <BarChart2 className="w-3 h-3" />
              Scoring Criteria
            </h3>
            <ul className="text-[13px] space-y-2 text-slate-600">
              <li className="flex justify-between items-center"><span className="font-medium">10-12</span> <span>✅ STRONG BUY</span></li>
              <li className="flex justify-between items-center"><span className="font-medium">7-9</span> <span>👍 GOOD STOCK</span></li>
              <li className="flex justify-between items-center"><span className="font-medium">5-6</span> <span>⚠️ AVERAGE</span></li>
              <li className="flex justify-between items-center"><span className="font-medium">3-4</span> <span>⚠️ BELOW AVERAGE</span></li>
              <li className="flex justify-between items-center"><span className="font-medium">0-2</span> <span>❌ RISKY</span></li>
            </ul>
          </div>

          <div className="mt-auto p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-[11px] font-bold text-blue-800 uppercase mb-1">Data Status</div>
            <div className="flex items-center justify-between text-[11px] text-blue-600">
              <span>Last Update:</span><span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-blue-600">
              <span>API Source:</span><span className="font-medium">Yahoo Finance</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">🇮🇳 Indian Stock Fundamental Screener</h1>
          <p className="text-slate-500">Analyze the fundamentals of any Indian stock instantly.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="symbol" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Search Symbol(s)
            </label>
            <div className="relative">
              <input
                id="symbol"
                type="text"
                placeholder="e.g. RELIANCE, TCS"
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <Search className="absolute right-3 top-2.5 text-slate-400 w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={handleAnalyze}
              disabled={loading || !symbols.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[140px]"
            >
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showChart"
                checked={showChart}
                onChange={(e) => setShowChart(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="showChart" className="text-sm font-medium text-slate-600 select-none cursor-pointer">
                Show Chart
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-12">
          {results.map((result, idx) => (
            <StockResultView key={idx} result={result} showChart={showChart} />
          ))}
        </div>
      </main>
    </div>
  );
}

function StockResultView({ result, showChart }: { result: StockData; showChart: boolean; key?: React.Key }) {
  if (result.error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold">{result.symbol}</h3>
          <p>{result.error}</p>
        </div>
      </div>
    );
  }

  const analyzer = new StockAnalyzer(result);
  const basic = analyzer.basicInfo;
  const scoreResult = analyzer.score;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <header className="py-4 md:py-0 md:h-16 bg-white border-b border-slate-200 px-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm z-10 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">{basic.Name || result.symbol}</h2>
          <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight">{result.symbol}</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6 flex-wrap">
          <div className="text-right flex items-center gap-4">
            <div className="text-sm font-bold text-slate-900">{basic["Current Price"]}</div>
          </div>
          <div className="hidden md:block h-8 w-px bg-slate-200"></div>
          <div className={`text-[11px] font-bold py-1.5 px-3 rounded-full flex items-center gap-1.5 ${
              scoreResult.total >= 10 ? 'bg-emerald-100 text-emerald-800' :
              scoreResult.total >= 7 ? 'bg-blue-100 text-blue-800' :
              scoreResult.total >= 5 ? 'bg-amber-100 text-amber-800' :
              'bg-rose-100 text-rose-800'
            }`}>
            <span>Score: {scoreResult.total}/{scoreResult.max}</span>
            <span className="px-1 opacity-50">•</span>
            <span>{scoreResult.verdict}</span>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs.Container>
          <Tabs.List>
            <Tabs.Tab name="Overview" />
            <Tabs.Tab name="Valuation" />
            <Tabs.Tab name="Profitability" />
            <Tabs.Tab name="Health" />
            <Tabs.Tab name="Growth" />
            <Tabs.Tab name="Dividends" />
            <Tabs.Tab name="Momentum" />
            <Tabs.Tab name="Score" />
          </Tabs.List>

          <Tabs.Panel name="Overview">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Basic Information</h3>
                <div className="space-y-3">
                  <InfoRow label="Name" value={basic.Name} />
                  <InfoRow label="Sector" value={basic.Sector} />
                  <InfoRow label="Industry" value={basic.Industry} />
                  <InfoRow label="Market Cap" value={basic["Market Cap"]} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Price Levels</h3>
                <div className="space-y-3">
                  <InfoRow label="Current Price" value={basic["Current Price"]} />
                  <InfoRow label="52-Week High" value={basic["52-Week High"]} />
                  <InfoRow label="52-Week Low" value={basic["52-Week Low"]} />
                </div>
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel name="Valuation"><MetricsGrid data={analyzer.valuation} /></Tabs.Panel>
          <Tabs.Panel name="Profitability"><MetricsGrid data={analyzer.profitability} /></Tabs.Panel>
          <Tabs.Panel name="Health"><MetricsGrid data={analyzer.financialHealth} /></Tabs.Panel>
          <Tabs.Panel name="Growth"><MetricsGrid data={analyzer.growth} /></Tabs.Panel>
          <Tabs.Panel name="Dividends"><MetricsGrid data={analyzer.dividends} cols={2} /></Tabs.Panel>
          <Tabs.Panel name="Momentum"><MetricsGrid data={analyzer.momentum} cols={2} /></Tabs.Panel>
          
          <Tabs.Panel name="Score">
            <div className="flex gap-6 mt-4 flex-col lg:flex-row">
              <div className="w-full lg:w-3/5 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">12-Point Health Checklist</h3>
                  <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Fundamentals Only</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {Object.entries(scoreResult.breakdown).map(([key, detail]) => {
                    const isPass = detail.passed;
                    return (
                      <div key={key} className={`flex items-center justify-between p-2 rounded border-l-4 ${isPass ? 'bg-emerald-50/50 border-emerald-500' : 'bg-rose-50/50 border-rose-500'}`}>
                        <span className="text-xs font-medium text-slate-700">{key}</span>
                        <span className={`text-xs font-bold whitespace-nowrap ${isPass ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {detail.value !== null ? detail.value : 'N/A'} {isPass ? '✅' : '❌'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="w-full lg:w-2/5 flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 flex flex-col items-center justify-center">
                  <ScoreGauge score={scoreResult.total} maxScore={scoreResult.max} />
                  <div className="text-center mt-6">
                    <div className={`text-sm font-bold py-1.5 px-4 rounded-full inline-block ${
                      scoreResult.total >= 10 ? 'bg-emerald-100 text-emerald-800' :
                      scoreResult.total >= 7 ? 'bg-blue-100 text-blue-800' :
                      scoreResult.total >= 5 ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {scoreResult.verdict}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Panel>
        </Tabs.Container>

        {showChart && result.history && result.history.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-800 text-center">One Year Price History</h3>
            <PriceChart symbol={result.symbol} data={result.history} />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}:</span>
      <span className="font-medium text-slate-800 text-right">{value || 'N/A'}</span>
    </div>
  );
}

/* 
  Very simple embedded tabs for brevity 
*/
const Tabs = {
  Container: function ({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState("Overview");
    
    // Inject activeTab into children if needed, or we just map
    return (
      <div className="tabs-container">
        {React.Children.map(children, (child: any) => {
          if (child.type === Tabs.List) {
            return React.cloneElement(child, { activeTab, setActiveTab });
          }
          if (child.type === Tabs.Panel) {
            return child.props.name === activeTab ? child : null;
          }
          return child;
        })}
      </div>
    );
  },
  List: function ({ children, activeTab, setActiveTab }: { children?: React.ReactNode, activeTab?: string, setActiveTab?: (t: string) => void }) {
    return (
      <div className="flex overflow-x-auto border-b border-slate-200 mb-6 hide-scrollbar">
        {React.Children.map(children, (child: any) => 
          React.cloneElement(child, { activeTab, setActiveTab })
        )}
      </div>
    );
  },
  Tab: function ({ name, activeTab, setActiveTab }: { name: string, activeTab?: string, setActiveTab?: (t: string) => void }) {
    const isActive = activeTab === name;
    return (
      <button
        onClick={() => setActiveTab?.(name)}
        className={`px-4 py-3 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
          isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
      >
        {name}
      </button>
    );
  },
  Panel: function ({ children, name }: { children: React.ReactNode, name: string }) {
    return <div>{children}</div>;
  }
};

import React from 'react';
