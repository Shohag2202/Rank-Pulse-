import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { UrlAuditHero } from './components/UrlAuditHero';
import { ScoreGauge } from './components/ScoreGauge';
import { ActionableRecommendations } from './components/ActionableRecommendations';
import { OnPageAndTechInspector } from './components/OnPageAndTechInspector';
import { SerpPreviewSimulator } from './components/SerpPreviewSimulator';
import { CodeFixGenerator } from './components/CodeFixGenerator';
import { CompetitorBenchmark } from './components/CompetitorBenchmark';
import { AuditHistoryModal } from './components/AuditHistoryModal';
import { ExportReportModal } from './components/ExportReportModal';
import type { SEOAuditResult } from './types/seo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Share2,
  TrendingUp,
} from 'lucide-react';

const STORAGE_KEY = 'rankpulse_audit_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<SEOAuditResult | null>(null);
  const [auditHistory, setAuditHistory] = useState<SEOAuditResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Load audit history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAuditHistory(parsed);
          // Auto-load most recent audit if available
          setAuditResult(parsed[0]);
        }
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
  }, []);

  // Save audit to history
  const saveAuditToHistory = (result: SEOAuditResult) => {
    setAuditHistory((prev) => {
      const filtered = prev.filter((item) => item.url !== result.url);
      const updated = [result, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // quota exceeded fallback
      }
      return updated;
    });
  };

  const handleRunAudit = async (url: string) => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to inspect website');
      }

      const data = await response.json();
      if (!data.result) {
        throw new Error('Invalid audit response from server');
      }

      setAuditResult(data.result);
      saveAuditToHistory(data.result);
      setActiveTab('overview');
    } catch (err: any) {
      console.error('Audit execution failed:', err);
      setError(err.message || 'Could not audit website. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setAuditHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const handleDeleteAudit = (id: string) => {
    setAuditHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (auditResult?.id === id) {
      setAuditResult(null);
    }
  };

  const handleSelectAudit = (item: SEOAuditResult) => {
    setAuditResult(item);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/25 selection:text-emerald-200">
      {/* Top Header */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewAuditClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (inputEl) inputEl.focus();
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExportReport={() => setIsExportOpen(true)}
        hasResult={!!auditResult}
        historyCount={auditHistory.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* URL Audit Hero Banner */}
        <UrlAuditHero
          onAudit={handleRunAudit}
          isLoading={isLoading}
          currentUrl={auditResult?.url || ''}
        />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs md:text-sm flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-white px-2 py-1 rounded"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* If audit result exists, render the tab panels */}
        {auditResult ? (
          <div className="space-y-6">
            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Score and Category Health */}
                <ScoreGauge
                  evaluation={auditResult.aiEvaluation}
                  metrics={auditResult.metrics}
                />

                {/* Priority Action Items Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>Top Priority Recommendations</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 font-mono">
                          Immediate Fixes
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Highest ranking impact optimizations identified by AI audit.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>View All ({auditResult.aiEvaluation.recommendations.length})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <ActionableRecommendations
                    recommendations={auditResult.aiEvaluation.recommendations.slice(0, 3)}
                    quickWins={auditResult.aiEvaluation.quickWins}
                  />
                </div>

                {/* SERP Snippet Quick Snapshot */}
                <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Google SERP Snippet Preview
                    </span>
                    <button
                      onClick={() => setActiveTab('serp-simulator')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Open Live Simulator →
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-sm">
                    <div className="text-xs text-slate-600 truncate">{auditResult.metrics.finalUrl}</div>
                    <div className="text-base font-semibold text-[#1a0dab] line-clamp-1">
                      {auditResult.metrics.title.text || 'Untitled Page'}
                    </div>
                    <div className="text-xs text-[#4d5156] line-clamp-2 mt-1">
                      {auditResult.metrics.metaDescription.text || 'No meta description found.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Actionable Fixes */}
            {activeTab === 'recommendations' && (
              <div className="animate-in fade-in duration-200">
                <ActionableRecommendations
                  recommendations={auditResult.aiEvaluation.recommendations}
                  quickWins={auditResult.aiEvaluation.quickWins}
                />
              </div>
            )}

            {/* Tab: On-Page & Technical */}
            {activeTab === 'onpage-tech' && (
              <div className="animate-in fade-in duration-200">
                <OnPageAndTechInspector
                  metrics={auditResult.metrics}
                  evaluation={auditResult.aiEvaluation}
                />
              </div>
            )}

            {/* Tab: SERP & Social Preview */}
            {activeTab === 'serp-simulator' && (
              <div className="animate-in fade-in duration-200">
                <SerpPreviewSimulator
                  metrics={auditResult.metrics}
                  evaluation={auditResult.aiEvaluation}
                />
              </div>
            )}

            {/* Tab: Schema & Code Generator */}
            {activeTab === 'code-generator' && (
              <div className="animate-in fade-in duration-200">
                <CodeFixGenerator
                  metrics={auditResult.metrics}
                  evaluation={auditResult.aiEvaluation}
                />
              </div>
            )}

            {/* Tab: Competitor Benchmark */}
            {activeTab === 'competitor' && (
              <div className="animate-in fade-in duration-200">
                <CompetitorBenchmark
                  currentUrl={auditResult.url}
                  currentMetrics={auditResult.metrics}
                  currentEvaluation={auditResult.aiEvaluation}
                />
              </div>
            )}
          </div>
        ) : (
          /* Empty / Welcome State before first audit */
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Search className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-white">Full On-Page & Technical Crawl</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time HTML parsing of title tags, meta descriptions, canonical directives, heading hierarchies, and missing image alt tags.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                <div className="h-9 w-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-white">AI-Powered Action Roadmap</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every issue is categorized by impact and effort, paired with exact copy-paste HTML and JSON-LD code solutions.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-white">SERP & Competitor Intelligence</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Simulate live desktop & mobile Google search results with pixel-perfect truncation tests and head-to-head competitor audits.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AuditHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={auditHistory}
        onSelectAudit={handleSelectAudit}
        onClearHistory={handleClearHistory}
        onDeleteAudit={handleDeleteAudit}
      />

      {auditResult && (
        <ExportReportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          auditResult={auditResult}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900/90 py-6 px-4 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">RankPulse SEO Audit SaaS</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Actionable Search Ranking & Technical Diagnostics</span>
          </div>
          <div className="text-slate-400">
            Compliant with Google Search Essentials & Schema.org standards
          </div>
        </div>
      </footer>
    </div>
  );
}
