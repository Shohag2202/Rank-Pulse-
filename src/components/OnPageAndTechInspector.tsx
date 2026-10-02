import React, { useState } from 'react';
import type { RawPageMetrics, AIEvaluation } from '../types/seo';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Image,
  Link,
  Code,
  Smartphone,
  Eye,
  Hash,
  Database,
  ExternalLink,
} from 'lucide-react';

interface OnPageAndTechInspectorProps {
  metrics: RawPageMetrics;
  evaluation: AIEvaluation;
}

export const OnPageAndTechInspector: React.FC<OnPageAndTechInspectorProps> = ({
  metrics,
  evaluation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'onpage' | 'technical' | 'headings' | 'images' | 'keywords'>('onpage');

  // Title meter calculations
  const titleLen = metrics.title.length;
  const isTitleOptimal = titleLen >= 40 && titleLen <= 65;

  // Description meter calculations
  const descLen = metrics.metaDescription.length;
  const isDescOptimal = descLen >= 120 && descLen <= 165;

  return (
    <div className="space-y-6">
      {/* Subtab navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 w-fit">
        {[
          { id: 'onpage', label: 'Meta & Tags' },
          { id: 'technical', label: 'Technical SEO' },
          { id: 'headings', label: `Headings (${metrics.headings.totalHeadings})` },
          { id: 'images', label: `Images (${metrics.images.total})` },
          { id: 'keywords', label: 'Keyword Density' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSubTab === tab.id
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subtab 1: Meta & Tags */}
      {activeSubTab === 'onpage' && (
        <div className="space-y-4">
          {/* Title tag box */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">Title Tag</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  <span className={isTitleOptimal ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {titleLen}
                  </span>{' '}
                  / 60 chars (recommended: 50-60)
                </span>
                {isTitleOptimal ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="h-3 w-3" /> Optimal
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded">
                    <AlertTriangle className="h-3 w-3" /> {titleLen === 0 ? 'Missing' : titleLen < 40 ? 'Too Short' : 'Too Long'}
                  </span>
                )}
              </div>
            </div>

            {/* Character length indicator */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isTitleOptimal ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, (titleLen / 70) * 100)}%` }}
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
              {metrics.title.text || <span className="text-rose-400 italic">&lt;No &lt;title&gt; tag found in HTML&gt;</span>}
            </div>

            {/* Suggested alternative */}
            {evaluation.optimizedHeadCode?.suggestedTitle && (
              <div className="text-xs text-slate-400 space-y-1">
                <span className="text-emerald-400 font-medium">AI Recommended High-CTR Title:</span>
                <p className="font-mono text-slate-300 bg-slate-950/60 p-2 rounded border border-emerald-900/40">
                  {evaluation.optimizedHeadCode.suggestedTitle}
                </p>
              </div>
            )}
          </div>

          {/* Meta Description box */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">Meta Description</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  <span className={isDescOptimal ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {descLen}
                  </span>{' '}
                  / 160 chars (recommended: 140-160)
                </span>
                {isDescOptimal ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="h-3 w-3" /> Optimal
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded">
                    <AlertTriangle className="h-3 w-3" /> {descLen === 0 ? 'Missing' : descLen < 120 ? 'Too Short' : 'Too Long'}
                  </span>
                )}
              </div>
            </div>

            {/* Length indicator */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isDescOptimal ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, (descLen / 170) * 100)}%` }}
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed">
              {metrics.metaDescription.text || (
                <span className="text-rose-400 italic">&lt;No &lt;meta name="description"&gt; found. Search engines will generate automated snippet.&gt;</span>
              )}
            </div>

            {/* Suggested alternative */}
            {evaluation.optimizedHeadCode?.suggestedMetaDescription && (
              <div className="text-xs text-slate-400 space-y-1">
                <span className="text-emerald-400 font-medium">AI Recommended Search Snippet:</span>
                <p className="font-mono text-slate-300 bg-slate-950/60 p-2 rounded border border-emerald-900/40">
                  {evaluation.optimizedHeadCode.suggestedMetaDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 2: Technical SEO */}
      {activeSubTab === 'technical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SSL / HTTPS */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">HTTPS & SSL Security</span>
              {metrics.isHttps ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Secure
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Insecure HTTP
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {metrics.isHttps
                ? 'Traffic is fully encrypted over HTTPS. Google uses HTTPS as a positive ranking signal.'
                : 'Site is served unencrypted. Modern browsers mark this as Not Secure, hurting rankings and CTR.'}
            </p>
          </div>

          {/* Canonical Tag */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Canonical Tag</span>
              {metrics.canonical.present ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Configured
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Missing
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate font-mono">
              {metrics.canonical.url || 'No rel="canonical" declared'}
            </p>
          </div>

          {/* Robots Tag & Indexability */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Robots Indexability</span>
              {!metrics.robots.isNoindex ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Indexable
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Noindex Alert
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {metrics.robots.content ? `Directive: ${metrics.robots.content}` : 'Default (index, follow)'}
            </p>
          </div>

          {/* Mobile Viewport */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Mobile Viewport Tag</span>
              {metrics.technical.hasViewport ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Responsive
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Missing Viewport
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono truncate">
              {metrics.technical.viewportContent || 'No viewport tag detected'}
            </p>
          </div>

          {/* Structured Data (JSON-LD) */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Schema.org Structured Data (JSON-LD)</span>
              {metrics.structuredData.hasJsonLd ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {metrics.structuredData.schemaTypes.length} Schemas Found
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> No Schema Found
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex flex-wrap gap-2">
              {metrics.structuredData.schemaTypes.length > 0 ? (
                metrics.structuredData.schemaTypes.map((type, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-emerald-300 font-mono text-[11px]">
                    @{type}
                  </span>
                ))
              ) : (
                <span>Adding Schema markup enables rich snippet stars, organization info, and search sitelinks in Google.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Headings */}
      {activeSubTab === 'headings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-xs text-slate-400 font-mono block">H1 Headings</span>
              <span className={`text-2xl font-bold font-mono tabular-nums ${metrics.headings.h1.length === 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {metrics.headings.h1.length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-xs text-slate-400 font-mono block">H2 Subheadings</span>
              <span className="text-2xl font-bold font-mono text-slate-200 tabular-nums">
                {metrics.headings.h2Count}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-xs text-slate-400 font-mono block">H3 Sections</span>
              <span className="text-2xl font-bold font-mono text-slate-200 tabular-nums">
                {metrics.headings.h3Count}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-xs text-slate-400 font-mono block">H4 Details</span>
              <span className="text-2xl font-bold font-mono text-slate-200 tabular-nums">
                {metrics.headings.h4Count}
              </span>
            </div>
          </div>

          {/* Heading issues banner */}
          {metrics.headings.issues.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Heading Hierarchy Alerts
              </span>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {metrics.headings.issues.map((iss, i) => (
                  <li key={i}>{iss}</li>
                ))}
              </ul>
            </div>
          )}

          {/* H1 list */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">H1 Content</span>
            {metrics.headings.h1.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/50 text-rose-300 text-xs font-mono">
                No &lt;h1&gt; found on the page! Search crawlers rely on H1 as the primary page theme indicator.
              </div>
            ) : (
              metrics.headings.h1.map((h1, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
                  &lt;h1&gt; {h1} &lt;/h1&gt;
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Subtab 4: Images & Alt */}
      {activeSubTab === 'images' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xs text-slate-400">Total Images</span>
              <span className="text-2xl font-bold font-mono text-slate-200 block tabular-nums">
                {metrics.images.total}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xs text-slate-400">With Alt Text</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 block tabular-nums">
                {metrics.images.withAlt}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xs text-slate-400">Missing Alt Text</span>
              <span className={`text-2xl font-bold font-mono block tabular-nums ${metrics.images.missingAlt > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {metrics.images.missingAlt}
              </span>
            </div>
          </div>

          {/* Missing ALT samples */}
          {metrics.images.sampleMissingAlt.length > 0 ? (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Sample Images Missing Alt Text & AI Suggestions
              </span>
              <div className="rounded-xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden bg-slate-900/40">
                {metrics.images.sampleMissingAlt.map((img, i) => (
                  <div key={i} className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <span className="font-mono text-slate-400 truncate max-w-sm" title={img.src}>
                      {img.src}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-800/80 text-emerald-300 font-mono text-[11px] shrink-0">
                      Suggested: alt="{img.suggestedAlt}"
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs">
              All inspected images include alternative text! Great for search rankings and screen-reader accessibility.
            </div>
          )}
        </div>
      )}

      {/* Subtab 5: Keyword Density */}
      {activeSubTab === 'keywords' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Total Word Count: <strong className="text-white font-mono">{metrics.content.wordCount.toLocaleString()}</strong> words
            </span>
            <span>
              Estimated Read Time: <strong className="text-white font-mono">{metrics.content.readingTimeMin} min</strong>
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3">Keyword</th>
                  <th className="px-4 py-3 text-right">Occurrences</th>
                  <th className="px-4 py-3 text-right">Density %</th>
                  <th className="px-4 py-3">Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.content.topKeywords.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-200 capitalize">{kw.word}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-300">{kw.count}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums text-emerald-400">{kw.density}%</td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {kw.density > 4 ? (
                        <span className="text-amber-400">High (watch for keyword stuffing)</span>
                      ) : kw.density < 0.5 ? (
                        <span className="text-slate-500">Low prominence</span>
                      ) : (
                        <span className="text-emerald-400">Optimal density (1-3%)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
