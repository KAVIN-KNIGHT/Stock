import React from 'react';
import { Newspaper, ExternalLink, Globe } from 'lucide-react';

export const NewsFeed = ({ news = [], ticker }) => {
  if (!news || news.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <Newspaper className="w-5 h-5 text-blue-500" />
          Latest Market News
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">No news articles currently available for {ticker}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-500" />
            Latest Market News & Sentiments for {ticker}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time financial headlines and publisher reports
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
          {news.length} Headlines
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 transition-all hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                  <Globe className="w-3.5 h-3.5" />
                  {item.publisher || 'Finance News'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-3 transition-colors">
                {item.title}
              </h4>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
              <span>Read article</span>
              <span className="font-semibold group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
