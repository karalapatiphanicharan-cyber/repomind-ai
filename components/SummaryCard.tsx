import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Code2,
  ShieldAlert,
  Layout,
  AlertTriangle,
  Zap,
  TrendingUp,
  Search,
  BookOpen,
  ClipboardList,
  AlertCircle,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { AnalysisSummary } from '@/types/analysis';

interface SummaryCardProps {
  summary: AnalysisSummary;
  onReset: () => void;
}

export default function SummaryCard({ summary, onReset }: SummaryCardProps) {
  const aiReport = summary.ai_report;
  const aiError = summary.ai_error;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Global Status Banner for AI Error */}
      {aiError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 text-red-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-text">AI Service Temporarily Unavailable</h3>
              <p className="text-sm text-secondary-text">RepoMind successfully processed your repository, but the AI analysis encountered an issue.</p>
              <p className="text-xs text-red-400 mt-1 font-medium">Reason: {aiError}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onReset}
              className="flex-grow sm:flex-grow-0 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Retry Analysis
            </button>
            <button
              onClick={onReset}
              className="flex-grow sm:flex-grow-0 px-6 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold hover:border-accent transition-all active:scale-95"
            >
              Analyze Another
            </button>
          </div>
        </motion.div>
      )}

      {/* Overview Header - Always visible if preprocessing succeeded */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-[2rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className={`absolute top-0 left-0 w-full h-1 ${aiReport ? 'bg-green-500/30' : 'bg-yellow-500/30'}`}></div>

        <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle2 className="text-green-500 w-6 h-6" />
              <h2 className="text-2xl font-bold text-primary-text">Project Processed Successfully</h2>
            </div>
            <p className="text-secondary-text">Metadata extracted for <span className="text-primary-text font-semibold">{summary.project_name}</span></p>
          </div>
          {!aiError && (
            <button
              onClick={onReset}
              className="px-6 py-2 rounded-xl bg-surface border border-border text-sm font-semibold hover:border-accent hover:text-accent transition-all duration-300 active:scale-95"
            >
              Analyze Another
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-background/40 border border-border/40 rounded-2xl p-6 text-center">
             <p className="text-xs font-bold text-secondary-text/60 uppercase tracking-tighter mb-2">Analysis Score</p>
             <div className={`text-4xl font-black ${aiReport ? getScoreColor(aiReport.overall_score) : 'text-secondary-text/40'}`}>
               {aiReport ? aiReport.overall_score : 'N/A'}
               {aiReport && <span className="text-lg font-normal opacity-40">/100</span>}
             </div>
          </div>
          <div className="bg-background/40 border border-border/40 rounded-2xl p-6 text-center">
            <p className="text-xs font-bold text-secondary-text/60 uppercase tracking-tighter mb-2">Files Scanned</p>
            <p className="text-3xl font-bold text-primary-text">{summary.files_scanned}</p>
          </div>
          <div className="bg-background/40 border border-border/40 rounded-2xl p-6 text-center">
            <p className="text-xs font-bold text-secondary-text/60 uppercase tracking-tighter mb-2">Key Languages</p>
            <div className="flex flex-wrap justify-center gap-1">
              {summary.languages.slice(0, 3).map(lang => (
                <span key={lang} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-background/40 border border-border/40 rounded-2xl p-6 text-center">
            <p className="text-xs font-bold text-secondary-text/60 uppercase tracking-tighter mb-2">Structure</p>
            <div className="flex items-center justify-center space-x-1 text-accent">
               <FolderOpen className="w-4 h-4" />
               <span className="text-sm font-bold uppercase tracking-tighter">{summary.top_level_directories.length} Root Dirs</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Analysis Result */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border rounded-[2rem] p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-primary-text">Code Analysis</h3>
            </div>
            {aiReport && (
              <div className={`text-2xl font-bold ${getScoreColor(aiReport.code_analysis.score)}`}>
                {aiReport.code_analysis.score}%
              </div>
            )}
          </div>

          {aiReport ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-secondary-text/40 mb-3 flex items-center">
                  <Layout className="w-3 h-3 mr-2" /> Architecture
                </h4>
                <p className="text-sm text-secondary-text leading-relaxed">{aiReport.code_analysis.architecture}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-green-500/60 mb-2">Strengths</h4>
                  <ul className="space-y-1.5">
                    {aiReport.code_analysis.strengths.map((s, i) => (
                      <li key={i} className="text-[11px] text-secondary-text flex items-start">
                        <span className="text-green-500 mr-2">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-500/60 mb-2">Weaknesses</h4>
                  <ul className="space-y-1.5">
                    {aiReport.code_analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-[11px] text-secondary-text flex items-start">
                        <span className="text-red-500 mr-2">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-secondary-text/40 mb-2">Status: Analysis unavailable</p>
              <p className="text-xs text-secondary-text/60 italic">AI service was unable to generate findings.</p>
            </div>
          )}
        </motion.div>

        {/* Security Agent Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border rounded-[2rem] p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-primary-text">Security Review</h3>
            </div>
            {aiReport && (
              <div className={`text-2xl font-bold ${getScoreColor(aiReport.security_review.score)}`}>
                {aiReport.security_review.score}%
              </div>
            )}
          </div>

          {aiReport ? (
            <div className="space-y-6">
               <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-secondary-text/40 mb-3 flex items-center">
                  <Search className="w-3 h-3 mr-2" /> Risk Summary
                </h4>
                <p className="text-sm text-secondary-text leading-relaxed">{aiReport.security_review.risk_summary}</p>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-500/60">Key Findings</h4>
                 {aiReport.security_review.findings.length > 0 ? (
                   aiReport.security_review.findings.slice(0, 3).map((f, i) => (
                     <div key={i} className="p-3 rounded-xl border border-border/40 bg-background/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getSeverityColor(f.severity)}`}>
                            {f.severity}
                          </span>
                          <span className="text-[10px] text-primary-text font-bold uppercase tracking-tighter">Issue #{i+1}</span>
                        </div>
                        <p className="text-[11px] text-primary-text font-semibold mb-1">{f.issue}</p>
                        <p className="text-[10px] text-secondary-text italic">Fix: {f.fix}</p>
                     </div>
                   ))
                 ) : (
                   <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-center text-[11px] text-green-500 font-bold">
                     No critical security issues detected.
                   </div>
                 )}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-secondary-text/40 mb-2">Status: Analysis unavailable</p>
              <p className="text-xs text-secondary-text/60 italic">AI service was unable to generate findings.</p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Documentation Results */}
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-[2rem] p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-primary-text">Documentation</h3>
            </div>
            {aiReport && (
              <div className={`text-2xl font-bold ${getScoreColor(aiReport.documentation_review.score)}`}>
                {aiReport.documentation_review.score}%
              </div>
            )}
          </div>

          {aiReport ? (
            <div className="space-y-6">
               <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-secondary-text/40 mb-3 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-2" /> Assessment
                </h4>
                <p className="text-sm text-secondary-text leading-relaxed">{aiReport.documentation_review.assessment}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-xl bg-background/20 border border-border/40">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500/60 mb-2">Missing Info</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiReport.documentation_review.missing_sections.map((m, i) => (
                      <span key={i} className="text-[10px] font-medium text-secondary-text bg-surface border border-border/60 px-2 py-0.5 rounded-md">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-secondary-text/40 mb-2">Status: Analysis unavailable</p>
              <p className="text-xs text-secondary-text/60 italic">AI service was unable to generate findings.</p>
            </div>
          )}
        </motion.div>

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-[2rem] p-8 shadow-xl"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-primary-text">Engineering Action Plan</h3>
          </div>

          {aiReport ? (
            <div className="space-y-4">
              {Object.entries(aiReport.action_plan).map(([priority, items]) => {
                if (!items.length) return null;
                return (
                  <div key={priority} className="relative pl-4 border-l-2 border-border">
                     <div className={`absolute top-0 left-[-2px] w-0.5 h-4 ${
                       priority === 'critical' ? 'bg-red-500' :
                       priority === 'high' ? 'bg-orange-500' :
                       priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                     }`}></div>
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-text/40 mb-2 flex items-center">
                       {priority} Priority
                     </h4>
                     <ul className="space-y-1.5">
                       {items.slice(0, 2).map((item, i) => (
                         <li key={i} className="text-[11px] text-primary-text font-medium flex items-start">
                           <Zap className="w-3 h-3 mr-2 mt-0.5 text-accent flex-shrink-0" />
                           {item}
                         </li>
                       ))}
                     </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-secondary-text/40 mb-2">Status: Analysis unavailable</p>
              <p className="text-xs text-secondary-text/60 italic">AI service was unable to generate findings.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Strategic Recommendation */}
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className={`bg-accent/5 border border-accent/10 rounded-[2rem] p-8 ${!aiReport ? 'opacity-50' : ''}`}
      >
         <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
               <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-primary-text">Strategic Recommendation</h3>
               <p className="text-xs text-secondary-text">
                 {aiReport ? 'Guidance for project evolution' : 'Strategic advice unavailable'}
               </p>
            </div>
         </div>
         {aiReport ? (
           <p className="text-sm text-primary-text/80 leading-relaxed italic border-l-4 border-accent/20 pl-6 py-2">
              &quot;{aiReport.overall_recommendation}&quot;
           </p>
         ) : (
           <div className="border-l-4 border-border/20 pl-6 py-2">
              <p className="text-sm text-secondary-text italic">The AI could not provide a strategic recommendation at this time.</p>
           </div>
         )}
      </motion.div>
    </div>
  );
}
