export interface RawPageMetrics {
  url: string;
  finalUrl: string;
  statusCode: number;
  responseTimeMs: number;
  pageSizeBytes: number;
  protocol: string;
  isHttps: boolean;
  
  title: {
    text: string;
    length: number;
    status: 'optimal' | 'too-short' | 'too-long' | 'missing';
  };
  
  metaDescription: {
    text: string;
    length: number;
    status: 'optimal' | 'too-short' | 'too-long' | 'missing';
  };
  
  canonical: {
    url: string | null;
    isSelfCanonical: boolean;
    present: boolean;
  };
  
  robots: {
    content: string | null;
    isNoindex: boolean;
    isNofollow: boolean;
  };
  
  openGraph: {
    present: boolean;
    title: string | null;
    description: string | null;
    image: string | null;
    url: string | null;
    type: string | null;
    siteName: string | null;
    missingTags: string[];
  };
  
  twitterCard: {
    present: boolean;
    card: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
    missingTags: string[];
  };
  
  headings: {
    h1: string[];
    h2Count: number;
    h3Count: number;
    h4Count: number;
    totalHeadings: number;
    hasSingleH1: boolean;
    issues: string[];
  };
  
  images: {
    total: number;
    withAlt: number;
    missingAlt: number;
    sampleMissingAlt: { src: string; suggestedAlt: string }[];
  };
  
  links: {
    total: number;
    internal: number;
    external: number;
    nofollow: number;
  };
  
  structuredData: {
    hasJsonLd: boolean;
    schemaTypes: string[];
    schemasDetectedCount: number;
  };
  
  technical: {
    hasViewport: boolean;
    viewportContent: string | null;
    charset: string | null;
    lang: string | null;
    hasFavicon: boolean;
  };
  
  content: {
    wordCount: number;
    readingTimeMin: number;
    textToHtmlRatio: number;
    topKeywords: { word: string; count: number; density: number }[];
  };
}

export interface SEORecommendation {
  id: string;
  title: string;
  category: 'on-page' | 'technical' | 'content' | 'social' | 'performance';
  severity: 'critical' | 'high' | 'medium' | 'opportunity';
  impact: 'High Impact' | 'Medium Impact' | 'Low Impact';
  effort: 'Quick Fix (< 15m)' | 'Moderate (1-2 hrs)' | 'Complex';
  whyItMatters: string;
  howToFix: string;
  codeSnippet?: string;
  isResolved?: boolean;
}

export interface CategoryScore {
  score: number;
  status: 'Good' | 'Fair' | 'Poor';
  summary: string;
}

export interface AIEvaluation {
  overallScore: number;
  scoreGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  executiveSummary: string;
  
  categoryScores: {
    onPage: CategoryScore;
    technical: CategoryScore;
    content: CategoryScore;
    socialAndRich: CategoryScore;
    mobileAndUx: CategoryScore;
  };
  
  recommendations: SEORecommendation[];
  
  optimizedHeadCode: {
    suggestedTitle: string;
    suggestedMetaDescription: string;
    suggestedKeywords: string[];
    suggestedJsonLdSchema: string;
    fullHeadHtmlSnippet: string;
  };
  
  searchSnippetPreview: {
    desktopUrl: string;
    displayUrl: string;
    title: string;
    snippet: string;
  };
  
  quickWins: string[];
  competitiveStrengths: string[];
}

export interface SEOAuditResult {
  id: string;
  timestamp: string;
  url: string;
  metrics: RawPageMetrics;
  aiEvaluation: AIEvaluation;
}

export interface AuditHistoryItem {
  id: string;
  url: string;
  timestamp: string;
  score: number;
  grade: string;
  issuesCount: number;
}
