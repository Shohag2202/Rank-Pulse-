import React, { useState } from 'react';
import type { RawPageMetrics, AIEvaluation } from '../types/seo';
import { Code, Copy, Check, Sparkles, Layers } from 'lucide-react';

interface CodeFixGeneratorProps {
  metrics: RawPageMetrics;
  evaluation: AIEvaluation;
}

export const CodeFixGenerator: React.FC<CodeFixGeneratorProps> = ({
  metrics,
  evaluation,
}) => {
  const [activeSchemaType, setActiveSchemaType] = useState<'website' | 'organization' | 'saas' | 'faq'>('website');
  const [copiedHead, setCopiedHead] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const domain = new URL(metrics.finalUrl).hostname;
  const pageTitle = evaluation.optimizedHeadCode?.suggestedTitle || metrics.title.text || domain;
  const pageDesc = evaluation.optimizedHeadCode?.suggestedMetaDescription || metrics.metaDescription.text || 'Explore our platform.';

  // Dynamic schema generator based on type
  const getSchemaContent = (type: string) => {
    switch (type) {
      case 'organization':
        return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${domain}",
  "url": "${metrics.finalUrl}",
  "logo": "${metrics.openGraph.image || `${metrics.finalUrl}/logo.png`}",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
}
</script>`;

      case 'saas':
        return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "${domain}",
  "operatingSystem": "Web, Cloud",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "${pageDesc.replace(/"/g, '\\"')}"
}
</script>`;

      case 'faq':
        return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does ${domain} provide?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${pageDesc.replace(/"/g, '\\"')}"
      }
    },
    {
      "@type": "Question",
      "name": "How do I get started?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit ${metrics.finalUrl} to explore our features and create an account."
      }
    }
  ]
}
</script>`;

      case 'website':
      default:
        return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${domain}",
  "url": "${metrics.finalUrl}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "${metrics.finalUrl}?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>`;
    }
  };

  const activeSchemaJson = getSchemaContent(activeSchemaType);

  const fullHeadSnippet = `<!-- RankPulse AI-Optimized Head Section -->
<title>${pageTitle}</title>
<meta name="description" content="${pageDesc}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="${metrics.finalUrl}">

<!-- OpenGraph / Social Media -->
<meta property="og:type" content="website">
<meta property="og:url" content="${metrics.finalUrl}">
<meta property="og:title" content="${pageTitle}">
<meta property="og:description" content="${pageDesc}">
${metrics.openGraph.image ? `<meta property="og:image" content="${metrics.openGraph.image}">` : '<!-- Add <meta property="og:image" content="https://yourdomain.com/og.png"> -->'}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${pageTitle}">
<meta name="twitter:description" content="${pageDesc}">
${metrics.twitterCard.image || metrics.openGraph.image ? `<meta name="twitter:image" content="${metrics.twitterCard.image || metrics.openGraph.image}">` : ''}

<!-- Structured Data (JSON-LD) -->
${activeSchemaJson}`;

  const copyHead = () => {
    navigator.clipboard.writeText(fullHeadSnippet);
    setCopiedHead(true);
    setTimeout(() => setCopiedHead(false), 2000);
  };

  const copySchemaOnly = () => {
    navigator.clipboard.writeText(activeSchemaJson);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>One-Click Code & Schema Generator</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              Valid Schema.org
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Copy-paste production ready meta tags, canonical links, and JSON-LD structured data tailored to your site.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyHead}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all"
          >
            {copiedHead ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedHead ? 'Copied Full <head>!' : 'Copy Complete <head>'}</span>
          </button>
        </div>
      </div>

      {/* Schema selector */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>Select Schema.org Rich Snippet Model:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
            {[
              { id: 'website', label: 'WebSite + SearchBox' },
              { id: 'organization', label: 'Organization / Brand' },
              { id: 'saas', label: 'Software / SaaS' },
              { id: 'faq', label: 'FAQ Rich Snippet' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSchemaType(tab.id as any)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeSchemaType === tab.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schema Code display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">JSON-LD Structured Data</span>
            <button
              onClick={copySchemaOnly}
              className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
            >
              {copiedSchema ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedSchema ? 'Copied Schema!' : 'Copy Schema Only'}</span>
            </button>
          </div>

          <div className="rounded-lg bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
            {activeSchemaJson}
          </div>
        </div>
      </div>

      {/* Complete head block */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white flex items-center gap-2">
            <Code className="h-4 w-4 text-emerald-400" />
            <span>Complete Optimized &lt;head&gt; Block</span>
          </span>
          <button
            onClick={copyHead}
            className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
          >
            {copiedHead ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedHead ? 'Copied!' : 'Copy All'}</span>
          </button>
        </div>

        <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed max-h-96">
          {fullHeadSnippet}
        </div>
      </div>
    </div>
  );
};
