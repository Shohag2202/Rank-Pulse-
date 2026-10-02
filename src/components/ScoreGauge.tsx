import React from 'react';
import type { AIEvaluation, RawPageMetrics } from '../types/seo';
import { ShieldCheck, FileText, Code, Share2, Smartphone, Clock, Database, Layers } from 'lucide-react';

interface ScoreGaugeProps {
  evaluation: AIEvaluation;
  metrics: RawPageMetrics;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ evaluation, metrics }) => {
  const { overallScore, scoreGrade, executiveSummary, categoryScores } = evaluation;

  // Grade color theme
  const getGradeColor = (score: number) => {
    if (score >= 90) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/40' };
    if (score >= 80) return { stroke: '#34d399', text: 'text-emerald-300', bg: 'bg-emerald-950/30', border: 'border-emerald-800/30' };
    if (score >= 70) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/40' };
    if (score >= 60) return { stroke: '#fb923c', text: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-800/40' };
    return { stroke: '#ef4444', text: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-800/40' };
  };

  const theme = getGradeColor(overallScore);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const categories = [
    {
      key: 'onPage',
      title: 'On-Page SEO',
      icon: FileText,
      data: categoryScores.onPage,
      details: `${metrics.title.length} char title · ${metrics.headings.h1.length} H1 headline`,
    },
    {
      key: 'technical',
      title: 'Technical SEO',
      icon: Code,
      data: categoryScores.technical,
      details: `${metrics.isHttps ? 'HTTPS SSL' : 'Insecure HTTP'} · ${metrics.canonical.present ? 'Canonical set' : 'No Canonical'}`,
    },
    {
      key: 'content',
      title: 'Content Quality',
      icon: Layers,
      data: categoryScores.content,
      details: `${metrics.content.wordCount.toLocaleString()} words · ${metrics.content.readingTimeMin} min read`,
    },
    {
      key: 'socialAndRich',
      title: 'Social & Rich Media',
      icon: Share2,
      data: categoryScores.socialAndRich,
      details: `${metrics.openGraph.present ? 'OpenGraph active' : 'Missing OG'} · ${metrics.images.missingAlt} missing ALT`,
    },
    {
      key: 'mobileAndUx',
      title: 'Mobile & Speed',
      icon: Smartphone,
      data: categoryScores.mobileAndUx,
      details: `${metrics.responseTimeMs}ms TTFB · ${(metrics.pageSizeBytes / 1024).toFixed(0)} KB`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Score Gauge + Executive Summary */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular Score Gauge */}
          <div className="relative flex flex-col items-center justify-center shrink-0">
            <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 140 140">
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#1e293b"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress stroke */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-extrabold tracking-tight tabular-nums ${theme.text}`}>
                {overallScore}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Grade {scoreGrade}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-semibold text-slate-300">Executive Diagnosis</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono truncate max-w-sm">
                {metrics.finalUrl}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 tabular-nums">
                {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              {executiveSummary}
            </p>

            {/* Telemetry pill row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span className="tabular-nums">{metrics.responseTimeMs}ms</span> latency
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Database className="h-3.5 w-3.5 text-slate-500" />
                <span className="tabular-nums">{(metrics.pageSizeBytes / 1024).toFixed(1)} KB</span> payload
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className={`h-3.5 w-3.5 ${metrics.isHttps ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span>{metrics.isHttps ? 'Valid SSL' : 'Missing SSL'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const score = cat.data.score;
          const status = cat.data.status;
          const isGood = status === 'Good';
          const isFair = status === 'Fair';

          return (
            <div
              key={cat.key}
              className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 flex flex-col justify-between hover:border-slate-700/80 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                    <span>{cat.title}</span>
                  </span>
                  <span
                    className={`text-xs font-semibold font-mono tabular-nums ${
                      isGood ? 'text-emerald-400' : isFair ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {score}/100
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isGood ? 'bg-emerald-400' : isFair ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {cat.data.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 mt-2">
                <span className="text-[10px] text-slate-500 font-mono block truncate">
                  {cat.details}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
