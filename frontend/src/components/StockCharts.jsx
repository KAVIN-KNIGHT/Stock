import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, Cpu, Calendar, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const StockCharts = ({ data }) => {
  const [activeTab, setActiveTab] = useState('sma');
  const { theme } = useTheme();

  if (!data) return null;

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const { historical = [], actual_vs_predicted = [], ticker } = data;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8 transition-colors duration-300">
      
      {/* Chart Header & Tab Switching */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {activeTab === 'sma' ? (
              <TrendingUp className="w-5 h-5 text-blue-500" />
            ) : (
              <Cpu className="w-5 h-5 text-indigo-500" />
            )}
            {activeTab === 'sma'
              ? `${ticker} Historical Price & Moving Averages`
              : `${ticker} Neural Network Model Validation (Actual vs Predicted)`}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === 'sma'
              ? 'Technical trend analysis using 50-day and 200-day Simple Moving Averages'
              : 'LSTM model performance evaluated over 100 historical test samples'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('sma')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sma'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Price & SMAs
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'validation'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Model Validation
          </button>
        </div>
      </div>

      {/* CHART CONTENT */}
      <div className="h-80 sm:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'sma' ? (
            <LineChart data={historical} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
              <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke={textColor} fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#151c2c' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '12px'
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="close" name="Close Price" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="sma50" name="SMA 50" stroke="#10b981" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="sma200" name="SMA 200" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
            </LineChart>
          ) : (
            <LineChart data={actual_vs_predicted} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
              <XAxis dataKey="date" stroke={textColor} fontSize={11} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke={textColor} fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#151c2c' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '12px'
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="actual" name="Actual Price" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="predicted" name="LSTM Predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <span>
          {activeTab === 'sma'
            ? 'When SMA50 crosses above SMA200, a Golden Cross (BUY) pattern is triggered. When SMA50 drops below SMA200, a Death Cross (SELL) is indicated.'
            : 'Close alignment between Actual and Predicted lines demonstrates high prediction accuracy for recent timeframes.'}
        </span>
      </div>
    </div>
  );
};
