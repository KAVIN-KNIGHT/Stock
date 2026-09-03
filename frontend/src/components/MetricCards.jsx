import React from 'react';
import { Target, ArrowUpRight, ArrowDownRight, Activity, ShieldAlert, BarChart3, Percent, CheckCircle2 } from 'lucide-react';

export const MetricCards = ({ data }) => {
  if (!data) return null;

  const {
    current_price,
    metrics: { next_price, lower, upper, rmse, mae, mape, r2 },
    signal,
    currency
  } = data;

  const priceDiff = next_price - current_price;
  const pctChange = current_price ? ((priceDiff / current_price) * 100).toFixed(2) : '0.00';
  const isPositive = priceDiff >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* CARD 1: Predicted Price */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
          <span>LSTM PREDICTED PRICE</span>
          <Target className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ${next_price.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-slate-500">{currency}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Current: ${current_price.toFixed(2)}</span>
          <span className={`inline-flex items-center font-bold ${isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {isPositive ? '+' : ''}{pctChange}%
          </span>
        </div>
      </div>

      {/* CARD 2: Range & Confidence */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
          <span>CONFIDENCE INTERVAL</span>
          <ShieldAlert className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-slate-400 block">Lower Bound</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">${lower.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Upper Bound</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">${upper.toFixed(2)}</span>
          </div>
        </div>
        {/* Progress Bar Visualizing Prediction Range */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full w-full" />
        </div>
      </div>

      {/* CARD 3: Technical Signal */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
          <span>TECHNICAL SIGNAL</span>
          <Activity className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-center justify-between my-1">
          <div className={`px-4 py-1.5 rounded-xl font-black text-sm tracking-wider flex items-center gap-1.5 shadow-sm ${
            signal === 'BUY'
              ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/30'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            {signal} SIGNAL
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          Based on SMA50 vs SMA200 crossover
        </p>
      </div>

      {/* CARD 4: Model Performance Overview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
          <span>MODEL ACCURACY</span>
          <BarChart3 className="w-4 h-4 text-cyan-500" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">RMSE</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{rmse.toFixed(2)}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">R² Score</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{r2.toFixed(4)}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">MAE</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{mae.toFixed(2)}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">MAPE</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{mape.toFixed(2)}%</span>
          </div>
        </div>
      </div>

    </div>
  );
};
