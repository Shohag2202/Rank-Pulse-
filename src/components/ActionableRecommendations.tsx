import React, { useState } from 'react';
import type { SEORecommendation } from '../types/seo';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Code2,
} from 'lucide-react';

interface ActionableRecommendationsProps {
  recommendations: SEORecommendation[];
  quickWins: string[];
}

export const ActionableRecommendations: React.FC<ActionableRecommendationsProps> = ({
  recommendations: initialRecs,
  quickWins,
}) => {
  const [recommendations, setRecommendations] = useState<SEORecommendation[]>(initialRecs);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'opportunity'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(initialRecs[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const toggleResolved = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, isResolved: !rec.isResolved } : rec))
    );
  };

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllSummary = () => {
    const text = recommendations
      .map(
        (r, i) =>
          `${i + 1}. [${r.severity.toUpperCase()}] ${r.title}\n   - Why: ${r.whyItMatters}\n   - Fix: ${r.howToFix}${
            r.codeSnippet ? `\n   - Code:\n${r.codeSnippet}` : ''
          }\n`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const resolvedCount = recommendations.filter((r) => r.isResolved).length;
  const filteredRecs = recommendations.filter((r) => (filter === 'all' ? true : r.severity === filter));

  const getSeverityBadge = (severity: SEORecommendation['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'Critical Issue',
          icon: AlertCircle,
          badge: 'text-rose-400 bg-rose-950/40 border-rose-800/50',
        };
      case 'high':
        return {
          label: 'High Priority',
          icon: AlertTriangle,
          badge: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
        };
      case 'medium':
        return {
          label: 'Medium Priority',
          icon: Info,
          badge: 'text-sky-400 bg-sky-950/40 border-sky-800/50',
        };
      case 'opportunity':
      default:
        return {
          label: 'Growth Opportunity',
          icon: Sparkles,
          badge: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Wins Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Actionable Ranking Roadmap</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono tabular-nums">
              {resolvedCount}/{recommendations.length} Resolved
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Prioritized tactical steps to optimize search visibility, crawl efficiency, and user CTR.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyAllSummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 transition-colors"
          >
            {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedAll ? 'Copied All!' : 'Copy Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Quick Wins Banner */}
      {quickWins.length > 0 && (
        <div className="rounded-xl bg-emerald-950/20 border border-emerald-800/40 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>Highest-ROI Quick Wins (Implement in &lt; 30 Minutes)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            {quickWins.map((win, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                <span className="text-emerald-400 font-mono font-bold">{idx + 1}.</span>
                <span>{win}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Segmented Control */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 w-fit">
        {[
          { id: 'all', label: `All (${recommendations.length})` },
          { id: 'critical', label: `Critical (${recommendations.filter((r) => r.severity === 'critical').length})` },
          { id: 'high', label: `High (${recommendations.filter((r) => r.severity === 'high').length})` },
          { id: 'medium', label: `Medium (${recommendations.filter((r) => r.severity === 'medium').length})` },
          { id: 'opportunity', label: `Opportunities (${recommendations.filter((r) => r.severity === 'opportunity').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              filter === tab.id
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {filteredRecs.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
            No recommendations found matching this filter category.
          </div>
        ) : (
          filteredRecs.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const badge = getSeverityBadge(rec.severity);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={rec.id}
                className={`rounded-xl border transition-all ${
                  rec.isResolved
                    ? 'bg-slate-950/40 border-slate-900 opacity-70'
                    : isExpanded
                    ? 'bg-slate-900/90 border-slate-700 shadow-md'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/60'
                }`}
              >
                {/* Header row */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Mark as resolved toggle */}
                    <button
                      type="button"
                      onClick={() => toggleResolved(rec.id)}
                      className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        rec.isResolved
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-700 hover:border-emerald-400 bg-slate-900'
                      }`}
                      title={rec.isResolved ? 'Mark as unresolved' : 'Mark as completed'}
                    >
                      {rec.isResolved && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${badge.badge}`}>
                          <BadgeIcon className="h-3 w-3" />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-[11px] text-slate-400 font-medium">{rec.impact}</span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-[11px] text-slate-400 font-mono">{rec.effort}</span>
                      </div>

                      <h3
                        onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                        className={`text-sm md:text-base font-semibold cursor-pointer truncate hover:text-emerald-400 transition-colors ${
                          rec.isResolved ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {rec.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 border-t border-slate-800/80 space-y-4 text-xs md:text-sm">
                    {/* Why it matters */}
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Why It Matters</span>
                      <p className="text-slate-300 leading-relaxed">{rec.whyItMatters}</p>
                    </div>

                    {/* How to fix */}
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">How to Fix</span>
                      <p className="text-slate-300 leading-relaxed">{rec.howToFix}</p>
                    </div>

                    {/* Code snippet if provided */}
                    {rec.codeSnippet && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <Code2 className="h-3.5 w-3.5" />
                            <span>Recommended Code Solution</span>
                          </span>
                          <button
                            onClick={() => copyCode(rec.id, rec.codeSnippet!)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
                          >
                            {copiedId === rec.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-emerald-300/90 overflow-x-auto whitespace-pre">
                          {rec.codeSnippet}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
