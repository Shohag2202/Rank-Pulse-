import React, { useState } from 'react';
import type { RawPageMetrics, AIEvaluation } from '../types/seo';
import { Smartphone, Monitor, Sparkles, RefreshCcw, ExternalLink, Share2 } from 'lucide-react';

interface SerpPreviewSimulatorProps {
  metrics: RawPageMetrics;
  evaluation: AIEvaluation;
}

export const SerpPreviewSimulator: React.FC<SerpPreviewSimulatorProps> = ({
  metrics,
  evaluation,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activePreview, setActivePreview] = useState<'google' | 'social'>('google');

  // Interactive live edits
  const [previewTitle, setPreviewTitle] = useState(
    metrics.title.text || evaluation.searchSnippetPreview.title || new URL(metrics.finalUrl).hostname
  );
  const [previewSnippet, setPreviewSnippet] = useState(
    metrics.metaDescription.text || evaluation.searchSnippetPreview.snippet || 'No description provided.'
  );

  const applyAiSuggestion = () => {
    if (evaluation.optimizedHeadCode?.suggestedTitle) {
      setPreviewTitle(evaluation.optimizedHeadCode.suggestedTitle);
    }
    if (evaluation.optimizedHeadCode?.suggestedMetaDescription) {
      setPreviewSnippet(evaluation.optimizedHeadCode.suggestedMetaDescription);
    }
  };

  const resetToOriginal = () => {
    setPreviewTitle(metrics.title.text || new URL(metrics.finalUrl).hostname);
    setPreviewSnippet(metrics.metaDescription.text || 'No description provided.');
  };

  const domain = new URL(metrics.finalUrl).hostname;
  const isTitleTruncated = previewTitle.length > 60;
  const isSnippetTruncated = previewSnippet.length > 160;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            SERP & Social Share Simulator
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Preview and edit your search snippet before publishing to maximize organic click-through rate (CTR).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Type Switcher */}
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setActivePreview('google')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activePreview === 'google'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Google SERP
            </button>
            <button
              onClick={() => setActivePreview('social')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activePreview === 'social'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Social Cards (OG)
            </button>
          </div>

          {activePreview === 'google' && (
            <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-md transition-colors ${
                  deviceMode === 'desktop'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Desktop View"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-md transition-colors ${
                  deviceMode === 'mobile'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mobile View"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Google SERP Preview Container */}
      {activePreview === 'google' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Simulation Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Google Result Rendering ({deviceMode === 'desktop' ? 'Desktop' : 'Mobile'})</span>
              <span className="text-slate-500 font-mono text-[11px]">Real pixel scaling</span>
            </div>

            <div
              className={`rounded-2xl border transition-all ${
                deviceMode === 'mobile'
                  ? 'max-w-sm mx-auto p-4 bg-white text-slate-900 border-slate-200 shadow-xl'
                  : 'w-full p-6 bg-white text-slate-900 border-slate-200 shadow-md'
              }`}
            >
              {/* Google Result Header */}
              <div className="flex items-center gap-3 mb-1.5">
                <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                  {domain.charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight truncate">
                  <div className="text-xs font-medium text-slate-800 truncate">{domain}</div>
                  <div className="text-[11px] text-slate-500 truncate">{metrics.finalUrl}</div>
                </div>
              </div>

              {/* Title Link */}
              <div className="text-[#1a0dab] hover:underline cursor-pointer font-medium text-lg leading-snug line-clamp-2">
                {previewTitle || 'Page Title Appears Here'}
              </div>

              {/* Truncation warning indicator */}
              {isTitleTruncated && (
                <span className="inline-block mt-1 text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  Title exceeds 60 chars ({previewTitle.length}) — Google will truncate with ...
                </span>
              )}

              {/* Snippet */}
              <div className="text-xs md:text-sm text-[#4d5156] leading-relaxed mt-1.5 line-clamp-3">
                {previewSnippet}
              </div>

              {isSnippetTruncated && (
                <span className="inline-block mt-1 text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  Description exceeds 160 chars ({previewSnippet.length}) — mobile snippet will truncate
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Live Copy Editor */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Live Snippet Editor
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={applyAiSuggestion}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 rounded hover:bg-emerald-900/60 transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Apply AI Copy</span>
                </button>
                <button
                  type="button"
                  onClick={resetToOriginal}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
                  title="Reset to Original"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-4">
              {/* Title editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-300">SERP Title Tag</label>
                  <span className={`font-mono ${isTitleTruncated ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                    {previewTitle.length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={previewTitle}
                  onChange={(e) => setPreviewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Snippet editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-300">Meta Description</label>
                  <span className={`font-mono ${isSnippetTruncated ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                    {previewSnippet.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={previewSnippet}
                  onChange={(e) => setPreviewSnippet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                Tip: High CTR titles usually feature a clear primary benefit, primary target keyword, and brand name separated by pipe (<code className="font-mono text-emerald-400">|</code>) or dash.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Cards (Open Graph / Twitter) Preview */}
      {activePreview === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Open Graph Card */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-sky-400" />
              <span>Facebook / LinkedIn Card (OpenGraph)</span>
            </span>

            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/80 shadow-lg">
              {metrics.openGraph.image ? (
                <img
                  src={metrics.openGraph.image}
                  alt="OG Image Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover bg-slate-800"
                />
              ) : (
                <div className="w-full h-44 bg-slate-850 flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                  <Share2 className="h-8 w-8 mb-2 opacity-40" />
                  <span>No og:image tag specified</span>
                  <span className="text-[10px] text-slate-600 mt-1">Recommended: 1200x630px image</span>
                </div>
              )}

              <div className="p-4 space-y-1.5">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                  {metrics.openGraph.siteName || domain}
                </span>
                <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">
                  {metrics.openGraph.title || previewTitle}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {metrics.openGraph.description || previewSnippet}
                </p>
              </div>
            </div>
          </div>

          {/* Twitter Card */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Twitter / X Large Summary Card</span>
            </span>

            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/80 shadow-lg">
              {metrics.twitterCard.image || metrics.openGraph.image ? (
                <img
                  src={metrics.twitterCard.image || metrics.openGraph.image || ''}
                  alt="Twitter Card Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover bg-slate-800"
                />
              ) : (
                <div className="w-full h-44 bg-slate-850 flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                  <Share2 className="h-8 w-8 mb-2 opacity-40" />
                  <span>No twitter:image tag specified</span>
                </div>
              )}

              <div className="p-4 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-mono">
                  {domain}
                </span>
                <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">
                  {metrics.twitterCard.title || previewTitle}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {metrics.twitterCard.description || previewSnippet}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
