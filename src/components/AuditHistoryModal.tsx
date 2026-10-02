import React from 'react';
import type { SEOAuditResult } from '../types/seo';
import { X, Trash2, ExternalLink, ArrowRight, Clock } from 'lucide-react';

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SEOAuditResult[];
  onSelectAudit: (item: SEOAuditResult) => void;
  onClearHistory: () => void;
  onDeleteAudit: (id: string) => void;
}

export const AuditHistoryModal: React.FC<AuditHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectAudit,
  onClearHistory,
  onDeleteAudit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Audit History & Past Scans</h3>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded tabular-nums">
              {history.length} Saved
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded hover:bg-rose-950/40 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* List of items */}
        <div className="p-6 overflow-y-auto divide-y divide-slate-800/80 space-y-3">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No audit history yet. Run an audit on any website URL to automatically track its score history!
            </div>
          ) : (
            history.map((item) => {
              const score = item.aiEvaluation.overallScore;
              const grade = item.aiEvaluation.scoreGrade;
              const dateStr = new Date(item.timestamp).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="pt-3 first:pt-0 flex items-center justify-between gap-4 group"
                >
                  <div
                    onClick={() => {
                      onSelectAudit(item);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {item.url}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>{item.metrics.content.wordCount.toLocaleString()} words</span>
                      <span>·</span>
                      <span>{item.aiEvaluation.recommendations.length} recommendations</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono">
                      <span className="text-lg font-bold text-emerald-400 tabular-nums">
                        {score}
                      </span>
                      <span className="text-[10px] text-slate-500 block uppercase">Grade {grade}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectAudit(item);
                        onClose();
                      }}
                      className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Load this audit"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteAudit(item.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
