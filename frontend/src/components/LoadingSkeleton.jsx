import React from 'react';
import { Cpu, RefreshCw } from 'lucide-react';

export const LoadingSkeleton = ({ ticker }) => {
  return (
    <div className="w-full space-y-6">
      
      {/* Loading Header Notification */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          <div>
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200">
              Analyzing {ticker}...
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Fetching 5-year Yahoo Finance historical data and executing LSTM neural network inference.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-300 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5 animate-pulse" /> Neural Net Running
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse p-4 flex flex-col justify-between"
          >
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-3/4 my-2" />
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full" />
          </div>
        ))}
      </div>

      {/* Main Chart Skeleton */}
      <div className="h-96 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-48" />
        </div>
        <div className="h-64 bg-slate-300/60 dark:bg-slate-700/50 rounded-xl w-full" />
      </div>

    </div>
  );
};
