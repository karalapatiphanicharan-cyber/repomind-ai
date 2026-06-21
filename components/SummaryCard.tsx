import { motion } from 'framer-motion';
import { Code2, Folder, FileText, CheckCircle2 } from 'lucide-react';
import { AnalysisSummary } from '@/types/analysis';

interface SummaryCardProps {
  summary: AnalysisSummary;
  onReset: () => void;
}

export default function SummaryCard({ summary, onReset }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface border border-border rounded-[2rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-green-500/30"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle2 className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-primary-text">Project Analysis Complete</h2>
          </div>
          <p className="text-secondary-text">RepoMind AI has successfully ingested your codebase.</p>
        </div>
        <button
          onClick={onReset}
          className="px-6 py-2 rounded-xl bg-surface border border-border text-sm font-semibold hover:border-accent hover:text-accent transition-all duration-300"
        >
          Analyze Another
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Project Overview */}
        <div className="space-y-6">
          <div className="bg-background/40 border border-border/40 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-text/60 mb-4 flex items-center">
              <Folder className="w-4 h-4 mr-2" /> Project Name
            </h3>
            <p className="text-xl font-bold text-primary-text">{summary.project_name}</p>
          </div>

          <div className="bg-background/40 border border-border/40 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-text/60 mb-4 flex items-center">
              <Code2 className="w-4 h-4 mr-2" /> Languages Detected
            </h3>
            <div className="flex flex-wrap gap-2">
              {summary.languages.length > 0 ? (
                summary.languages.map((lang) => (
                  <span key={lang} className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-secondary-text text-sm">None detected</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats and Files */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/40 border border-border/40 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-primary-text mb-1">{summary.files_scanned}</p>
              <p className="text-xs font-bold text-secondary-text/60 uppercase tracking-tighter">Files Scanned</p>
            </div>
            <div className="bg-background/40 border border-border/40 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-accent mb-1">{summary.total_supported_files}</p>
              <p className="text-xs font-bold text-secondary-text/60 uppercase tracking-tighter">Supported Files</p>
            </div>
          </div>

          <div className="bg-background/40 border border-border/40 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-text/60 mb-4 flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Key Files Detected
            </h3>
            <div className="grid grid-cols-2 gap-y-3">
              {Object.entries(summary.detected_files).map(([key, detected]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${detected ? 'bg-green-500' : 'bg-border/60'}`} />
                  <span className={`text-xs font-medium ${detected ? 'text-primary-text' : 'text-secondary-text/40 line-through'}`}>
                    {key.replace('_', '.')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-accent/5 border border-accent/10 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
             <div className="w-2 h-2 rounded-full bg-accent" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary-text">Status: Ready for AI Analysis</p>
            <p className="text-xs text-secondary-text">Phase 2 complete. Agent ingestion pipeline ready.</p>
          </div>
        </div>
        <div className="hidden sm:block text-xs font-bold text-accent/60 uppercase tracking-widest">
          awaiting phase 3
        </div>
      </div>
    </motion.div>
  );
}
