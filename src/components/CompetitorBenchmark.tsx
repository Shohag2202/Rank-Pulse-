import React, { useState } from 'react';
import type { RawPageMetrics, AIEvaluation } from '../types/seo';
import { ArrowRight, Trophy, Zap, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface CompetitorBenchmarkProps {
  currentUrl?: string;
  currentMetrics?: RawPageMetrics;
  currentEvaluation?: AIEvaluation;
}

export const CompetitorBenchmark: React.FC<CompetitorBenchmarkProps> = ({
  currentUrl = '',
  currentMetrics,
  currentEvaluation,
}) => {
  const [url1, setUrl1] = useState(currentUrl || 'https://linear.app');
  const [url2, setUrl2] = useState('https://jira.com');
  const [isComparing, setIsComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<{
    site1: { metrics: RawPageMetrics; evaluation: AIEvaluation };
    site2: { metrics: RawPageMetrics; evaluation: AIEvaluation };
  } | null>(
    currentMetrics && currentEvaluation
      ? null
      : null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url1.trim() || !url2.trim() || isComparing) return;

    setIsComparing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url1: url1.trim(), url2: url2.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to compare URLs');
      }

      const data = await res.json();
      setCompareResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Comparison request failed');
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Competitor Head-to-Head Benchmark</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            Rank Intelligence
          </span>
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Compare your website against top organic competitors to spot keyword gaps, speed advantages, and schema dominance.
        </p>
      </div>

      {/* Comparison Input Form */}
      <form onSubmit={handleRunComparison} className="p-4 md:p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Your Website URL</label>
            <input
              type="text"
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              placeholder="https://yoursite.com"
              disabled={isComparing}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Competitor URL to Beat</label>
            <input
              type="text"
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              placeholder="https://competitor.com"
              disabled={isComparing}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isComparing || !url1.trim() || !url2.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-800 disabled:text-slate-500 transition-all cursor-pointer"
          >
            {isComparing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Auditing & Comparing Both Domains...</span>
              </>
            ) : (
              <>
                <span>Run Head-to-Head Audit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comparison Results */}
      {compareResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Winner Banner */}
          {(() => {
            const s1 = compareResult.site1.evaluation.overallScore;
            const s2 = compareResult.site2.evaluation.overallScore;
            const isS1Winner = s1 >= s2;

            return (
              <div className="rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-800/40 p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Overall Leader</span>
                    <h3 className="text-base font-bold text-white">
                      {isS1Winner ? url1 : url2} leads by {Math.abs(s1 - s2)} points
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right font-mono">
                  <div>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[120px]">{url1}</span>
                    <span className="text-xl font-bold text-emerald-400 tabular-nums">{s1}/100</span>
                  </div>
                  <span className="text-slate-600 text-sm">vs</span>
                  <div>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[120px]">{url2}</span>
                    <span className="text-xl font-bold text-slate-300 tabular-nums">{s2}/100</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Detailed Side-by-Side Matrix */}
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-3.5">Metric & Factor</th>
                  <th className="px-4 py-3.5 text-slate-200 truncate max-w-xs">{url1}</th>
                  <th className="px-4 py-3.5 text-slate-200 truncate max-w-xs">{url2}</th>
                  <th className="px-4 py-3.5">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {/* On-Page Score */}
                <tr className="hover:bg-slate-850/40">
                  <td className="px-4 py-3 font-sans text-slate-300 font-medium">On-Page SEO Score</td>
                  <td className="px-4 py-3 tabular-nums text-emerald-400 font-semibold">
                    {compareResult.site1.evaluation.categoryScores.onPage.score}/100
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-300">
                    {compareResult.site2.evaluation.categoryScores.onPage.score}/100
                  </td>
                  <td className="px-4 py-3 font-sans">
                    {compareResult.site1.evaluation.categoryScores.onPage.score >= compareResult.site2.evaluation.categoryScores.onPage.score
                      ? <span className="text-emerald-400">Site 1 ahead</span>
                      : <span className="text-amber-400">Competitor ahead</span>}
                  </td>
                </tr>

                {/* Technical Score */}
                <tr className="hover:bg-slate-850/40">
                  <td className="px-4 py-3 font-sans text-slate-300 font-medium">Technical SEO Score</td>
                  <td className="px-4 py-3 tabular-nums text-emerald-400 font-semibold">
                    {compareResult.site1.evaluation.categoryScores.technical.score}/100
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-300">
                    {compareResult.site2.evaluation.categoryScores.technical.score}/100
                  </td>
                  <td className="px-4 py-3 font-sans">
                    {compareResult.site1.evaluation.categoryScores.technical.score >= compareResult.site2.evaluation.categoryScores.technical.score
                      ? <span className="text-emerald-400">Site 1 ahead</span>
                      : <span className="text-amber-400">Competitor ahead</span>}
                  </td>
                </tr>

                {/* Response Time */}
                <tr className="hover:bg-slate-850/40">
                  <td className="px-4 py-3 font-sans text-slate-300 font-medium">Server Latency (TTFB)</td>
                  <td className="px-4 py-3 tabular-nums text-slate-200">
                    {compareResult.site1.metrics.responseTimeMs}ms
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-200">
                    {compareResult.site2.metrics.responseTimeMs}ms
                  </td>
                  <td className="px-4 py-3 font-sans">
                    {compareResult.site1.metrics.responseTimeMs <= compareResult.site2.metrics.responseTimeMs
                      ? <span className="text-emerald-400 font-medium">Site 1 faster ({compareResult.site2.metrics.responseTimeMs - compareResult.site1.metrics.responseTimeMs}ms)</span>
                      : <span className="text-slate-400">Competitor faster</span>}
                  </td>
                </tr>

                {/* Word Count */}
                <tr className="hover:bg-slate-850/40">
                  <td className="px-4 py-3 font-sans text-slate-300 font-medium">Content Depth (Word Count)</td>
                  <td className="px-4 py-3 tabular-nums text-slate-200">
                    {compareResult.site1.metrics.content.wordCount.toLocaleString()} words
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-200">
                    {compareResult.site2.metrics.content.wordCount.toLocaleString()} words
                  </td>
                  <td className="px-4 py-3 font-sans">
                    {compareResult.site1.metrics.content.wordCount >= compareResult.site2.metrics.content.wordCount
                      ? <span className="text-emerald-400">Site 1 more comprehensive</span>
                      : <span className="text-amber-400">Competitor has more copy</span>}
                  </td>
                </tr>

                {/* Structured Data */}
                <tr className="hover:bg-slate-850/40">
                  <td className="px-4 py-3 font-sans text-slate-300 font-medium">Schema.org JSON-LD</td>
                  <td className="px-4 py-3 font-sans">
                    {compareResult.site1.metrics.structuredData.hasJsonLd ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Present ({compareResult.site1.metrics.structuredData.schemaTypes.length})</span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    {compareResult.site2.metrics.structuredData.hasJsonLd ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Present ({compareResult.site2.metrics.structuredData.schemaTypes.length})</span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    {compareResult.site1.metrics.structuredData.hasJsonLd && !compareResult.site2.metrics.structuredData.hasJsonLd
                      ? <span className="text-emerald-400">Competitive rich snippet edge!</span>
                      : <span className="text-slate-400">Parity</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
