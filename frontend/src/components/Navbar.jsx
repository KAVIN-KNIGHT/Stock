import React, { useState } from 'react';
import { TrendingUp, Search, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PRESET_TICKERS = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'];

export const Navbar = ({ currentTicker, onSearch, loading }) => {
  const { theme, toggleTheme } = useTheme();
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim().toUpperCase());
    }
  };

  const handleChipClick = (ticker) => {
    setInputVal(ticker);
    onSearch(ticker);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Money Mentor
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                <Sparkles className="w-3 h-3 mr-1 text-blue-500" /> AI 2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              LSTM Stock Intelligence & Analytics
            </p>
          </div>
        </div>

        {/* Search Bar & Ticker Chips */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value.toUpperCase())}
                placeholder="Enter stock ticker (e.g. AAPL, NVDA, TSLA)..."
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </form>

          {/* Quick Selector Chips */}
          <div className="hidden sm:flex items-center gap-2 mt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Popular:</span>
            {PRESET_TICKERS.map((t) => (
              <button
                key={t}
                onClick={() => handleChipClick(t)}
                className={`text-xs font-medium px-2.5 py-0.5 rounded-md transition-all ${
                  currentTicker === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-200/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="p-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300/50 dark:border-slate-700 transition-all shadow-sm flex items-center justify-center"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
