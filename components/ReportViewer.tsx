import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, CheckCheck, Loader2, Download } from 'lucide-react';

interface ReportViewerProps {
  report: string;
  isGenerating: boolean;
  onGenerate: () => void;
  hasNotes: boolean;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ 
  report, 
  isGenerating, 
  onGenerate,
  hasNotes 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bug_report_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">Generated Document</h2>
        <div className="flex space-x-2">
          {report && !isGenerating && (
            <>
              <button
                onClick={handleCopy}
                className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                title="Copy to Clipboard"
              >
                {copied ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                title="Download Markdown"
              >
                <Download className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-6 relative">
        {!report && !isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ready to Generate</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Add your observations on the left, then click the button below to create your professional document.
            </p>
            <button
              onClick={onGenerate}
              disabled={!hasNotes}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center"
            >
              Generate Document
            </button>
          </div>
        ) : isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">
              Refining with Gemini AI...
            </p>
          </div>
        ) : (
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
            <ReactMarkdown
              components={{
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
              }}
            >
              {report}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Footer Action (Only if report exists) */}
      {report && !isGenerating && (
         <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 flex justify-end">
            <button
              onClick={onGenerate}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Regenerate Document
            </button>
         </div>
      )}
    </div>
  );
};