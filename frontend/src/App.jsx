import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { StockCharts } from './components/StockCharts';
import { NewsFeed } from './components/NewsFeed';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { AlertTriangle, RefreshCw, Cpu, Layers } from 'lucide-react';

function DashboardContent() {
  const [ticker, setTicker] = useState('AAPL');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalysis = async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analyze?ticker=${encodeURIComponent(symbol)}`);
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Failed to analyze stock ticker ${symbol}`);
      }
      const result = await response.json();
      setData(result);
      setTicker(symbol.toUpperCase());
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while processing stock data.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis('AAPL');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* NAVBAR */}
      <Navbar currentTicker={ticker} onSearch={fetchAnalysis} loading={loading} />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-800 dark:text-rose-200 shadow-sm animate-shake">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold">Analysis Failed</h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => fetchAnalysis(ticker)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton or Dashboard Content */}
        {loading ? (
          <LoadingSkeleton ticker={ticker} />
        ) : (
          data && (
            <>
              {/* Ticker Header Info */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      {data.company_name} ({data.ticker})
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                      USD
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>5-Year Historical Dataset</span>
                    <span>•</span>
                    <span>60-Day Lookback Window</span>
                    <span>•</span>
                    <span>Sequential LSTM Layer Architecture</span>
                  </p>
                </div>
                <div className="text-right flex sm:flex-col justify-between items-end">
                  <span className="text-xs text-slate-400 font-semibold">Latest Price</span>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    ${data.current_price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <MetricCards data={data} />

              {/* Stock Charts Section */}
              <StockCharts data={data} />

              {/* Latest News Feed Section */}
              <NewsFeed news={data.news} ticker={data.ticker} />
            </>
          )
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur py-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Money Mentor AI</span>
            <span>- Next-Gen Stock Intelligence Platform</span>
          </div>
          <div>
            Powered by FastAPI, TensorFlow LSTM Neural Network & Vite + React
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}
