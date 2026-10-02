import React from 'react';
import { Sparkles, Download, History, RefreshCw, BarChart2 } from 'lucide-react';
import auditorAvatar from '../assets/images/avatar_auditor_pro_1790960471029.jpg';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewAuditClick: () => void;
  onOpenHistory: () => void;
  onExportReport: () => void;
  hasResult: boolean;
  historyCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onNewAuditClick,
  onOpenHistory,
  onExportReport,
  hasResult,
  historyCount,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'recommendations', label: 'Actionable Fixes' },
    { id: 'onpage-tech', label: 'On-Page & Tech' },
    { id: 'serp-simulator', label: 'SERP & Social' },
    { id: 'code-generator', label: 'Schema & Code' },
    { id: 'competitor', label: 'Competitor Benchmark' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white group"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-slate-100 font-semibold tracking-tight">
              Rank<span className="text-emerald-400">Pulse</span>
            </span>
          </a>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            SaaS SEO Engine
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                disabled={!hasResult && item.id !== 'competitor' && item.id !== 'overview'}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                    : hasResult || item.id === 'competitor' || item.id === 'overview'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenHistory}
            className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors border border-slate-800/80"
            title="Audit History"
          >
            <History className="h-4 w-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 tabular-nums">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          {hasResult && (
            <button
              onClick={onExportReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 transition-colors whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Report</span>
            </button>
          )}

          <button
            onClick={onNewAuditClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm hover:shadow-emerald-500/20 transition-all whitespace-nowrap"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>New Audit</span>
          </button>

          {/* Auditor Profile Avatar */}
          <div className="relative pl-1">
            <img
              src={auditorAvatar}
              alt="Auditor Profile"
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full border border-slate-700/80 object-cover"
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
