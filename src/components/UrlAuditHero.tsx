import React, { useState, useEffect } from 'react';
import { Search, Globe, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface UrlAuditHeroProps {
  onAudit: (url: string) => void;
  isLoading: boolean;
  currentUrl?: string;
}

const PRESET_SITES = [
  { name: 'Stripe', url: 'https://stripe.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Vercel', url: 'https://vercel.com' },
  { name: 'Notion', url: 'https://notion.so' },
  { name: 'Airbnb', url: 'https://airbnb.com' },
];

const AUDIT_STEPS = [
  'Establishing secure connection & downloading page DOM...',
  'Inspecting title tags, meta descriptions, and OpenGraph assets...',
  'Analyzing heading hierarchy (H1-H6) and image alt attributes...',
  'Evaluating Schema.org structured data, canonical & indexing tags...',
  'Running Gemini AI ranking evaluation & generating code fixes...',
];

export const UrlAuditHero: React.FC<UrlAuditHeroProps> = ({
  onAudit,
  isLoading,
  currentUrl = '',
}) => {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (currentUrl) setInputUrl(currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    if (!isLoading) {
      setActiveStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev < AUDIT_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || isLoading) return;
    onAudit(inputUrl.trim());
  };

  const handleSelectPreset = (url: string) => {
    setInputUrl(url);
    onAudit(url);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 p-6 md:p-10 shadow-2xl">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
            <Zap className="h-3.5 w-3.5" />
            <span>Real-Time Website Audit & Search Ranking Diagnostics</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white text-balance">
            Inspect Any Website SEO & Unlock AI Action Plans
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto text-balance">
            Enter any domain or URL to audit on-page tags, crawlability, structured data, and content depth with exact copy-paste code fixes.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-700/80 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-lg">
            <div className="flex items-center gap-2.5 px-3 w-full">
              <Globe className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter any website URL (e.g., https://yourwebsite.com)"
                disabled={isLoading}
                className="w-full bg-transparent text-sm md:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-md shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Auditing Site...</span>
                </>
              ) : (
                <>
                  <span>Audit Website</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-left animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-emerald-400">
                Phase {activeStepIndex + 1} of {AUDIT_STEPS.length}
              </span>
              <span>Analyzing live DOM & algorithms</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-700 ease-out"
                style={{
                  width: `${((activeStepIndex + 1) / AUDIT_STEPS.length) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400 shrink-0" />
              <span className="font-medium">{AUDIT_STEPS[activeStepIndex]}</span>
            </div>
          </div>
        )}

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-1">
          <span className="text-slate-500">Quick Test Samples:</span>
          {PRESET_SITES.map((site) => (
            <button
              key={site.name}
              type="button"
              onClick={() => handleSelectPreset(site.url)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded bg-slate-850 hover:bg-slate-800 hover:text-slate-200 border border-slate-800 transition-colors text-slate-300"
            >
              {site.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
