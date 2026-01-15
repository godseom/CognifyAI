
import React from 'react';
import { AnalysisResult } from '../types';

interface ReportViewerProps {
  data: AnalysisResult;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ data }) => {
  const formatMarkdown = (text: string) => {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html
      .replace(/^# (.*$)/gim, '<h1 class="font-display text-3xl font-bold text-emerald-900 border-b-2 border-emerald-100 pb-2 mb-6 mt-10 first:mt-0">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-stone-800 border-b border-stone-100 pb-2 mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-emerald-700 mb-3 mt-6">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold text-stone-700 mb-2 mt-4">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-900">$1</strong>')
      .replace(/^\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal text-stone-600 mb-1">$1</li>')
      .replace(/^\*\s+(.*$)/gim, '<li class="ml-4 list-disc text-stone-600 mb-1">$1</li>')
      .replace(/^\-\s+(.*$)/gim, '<li class="ml-4 list-disc text-stone-600 mb-1">$1</li>');

    html = html.replace(/(<li.*<\/li>)/gms, '<ul class="my-4 space-y-1">$1</ul>');
    
    const paragraphs = html.split(/\n\s*\n/);
    return paragraphs.map(p => {
        if (p.trim().startsWith('<h') || p.trim().startsWith('<ul') || p.trim().startsWith('<li')) return p;
        return `<p class="mb-4 text-stone-600 leading-relaxed">${p}</p>`;
    }).join('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 md:p-12">
        <div 
          className="prose prose-emerald max-w-none"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(data.report) }}
        />
      </div>

      {data.sources.length > 0 && (
        <div className="bg-white rounded-2xl p-8 border border-stone-200">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-6 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Market Intelligence Sources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start p-4 bg-stone-50 border border-stone-100 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-white border border-stone-200 rounded flex items-center justify-center text-emerald-600 font-bold text-xs mr-3 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-900 truncate group-hover:text-emerald-700">{source.title || 'Market Data'}</p>
                  <p className="text-xs text-stone-400 truncate mt-0.5">{new URL(source.uri || '').hostname}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
