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
  FolderOpen,
  ShieldCheck,
  FileText
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
    <div className="space-y-10">
      {/* Global Status Banner for AI Error */}
      {aiError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center space-x-5 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 text-red-500 shadow-lg shadow-red-500/10">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-text mb-1">AI Service Temporarily Unavailable</h3>
              <p className="text-sm text-secondary-text max-w-lg">RepoMind successfully processed your repository, but the AI analysis encountered an issue.</p>
              <div className="flex items-center mt-2 space-x-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Error</span>
                 <p className="text-xs text-red-400 font-medium">{aiError}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onReset}
              className="flex-grow sm:flex-grow-0 px-8 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-accent/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Retry Analysis
            </button>
            <button
              onClick={onReset}
              className="flex-grow sm:flex-grow-0 px-8 py-3 rounded-xl bg-surface border border-border text-sm font-bold hover:border-accent transition-all active:scale-95"
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
        className="bg-surface border border-border rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className={`absolute top-0 left-0 w-full h-1.5 ${aiReport ? 'bg-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.3)]'}`}></div>

        <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-8">
          <div>
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-primary-text tracking-tight">Analysis Report</h2>
            </div>
            <p className="text-secondary-text text-lg">Project: <span className="text-primary-text font-bold">{summary.project_name}</span></p>
          </div>
          {!aiError && (
            <button
              onClick={onReset}
              className="px-8 py-3 rounded-2xl bg-surface border border-border text-sm font-bold hover:border-accent hover:text-accent transition-all duration-300 active:scale-95 shadow-lg"
            >
              Analyze Another
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-background/40 border border-border/40 rounded-3xl p-8 text-center group hover:border-accent/30 transition-colors">
             <p className="text-[10px] font-black text-secondary-text/40 uppercase tracking-[0.2em] mb-3">Overall Score</p>
             <div className={`text-5xl font-black ${aiReport ? getScoreColor(aiReport.overall_score) : 'text-secondary-text/20'}`}>
               {aiReport ? aiReport.overall_score : 'N/A'}
               {aiReport && <span className="text-xl font-normal opacity-30">/100</span>}
             </div>
          </div>
          <div className="bg-background/40 border border-border/40 rounded-3xl p-8 text-center group hover:border-accent/30 transition-colors">
            <p className="text-[10px] font-black text-secondary-text/40 uppercase tracking-[0.2em] mb-3">Files Scanned</p>
            <p className="text-4xl font-black text-primary-text">{summary.files_scanned}</p>
          </div>
          <div className="bg-background/40 border border-border/40 rounded-3xl p-8 text-center group hover:border-accent/30 transition-colors">
            <p className="text-[10px] font-black text-secondary-text/40 uppercase tracking-[0.2em] mb-3">Primary Tech</p>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {summary.languages.slice(0, 3).map(lang => (
                <span key={lang} className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-background/40 border border-border/40 rounded-3xl p-8 text-center group hover:border-accent/30 transition-colors">
            <p className="text-[10px] font-black text-secondary-text/40 uppercase tracking-[0.2em] mb-3">Project Scope</p>
            <div className="flex items-center justify-center space-x-2 text-accent">
               <FolderOpen className="w-5 h-5" />
               <span className="text-lg font-black tracking-tight">{summary.top_level_directories.length} Modules</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Code Analysis Result */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl hover:shadow-accent/5 transition-shadow"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                <Code2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-primary-text tracking-tight">Code Analysis</h3>
            </div>
            {aiReport && (
              <div className={`text-3xl font-black ${getScoreColor(aiReport.code_analysis.score)}`}>
                {aiReport.code_analysis.score}%
              </div>
            )}
          </div>

          {aiReport ? (
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text/40 mb-4 flex items-center">
                  <Layout className="w-3 h-3 mr-2" /> System Architecture
                </h4>
                <p className="text-[15px] text-secondary-text leading-relaxed font-medium">{aiReport.code_analysis.architecture}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-border/40">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500/60 flex items-center">
                    <Zap className="w-3 h-3 mr-2" /> Strengths
                  </h4>
                  <ul className="space-y-3">
                    {aiReport.code_analysis.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-secondary-text flex items-start group">
                        <span className="text-green-500 mr-2 font-bold">•</span>
                        <span className="group-hover:text-primary-text transition-colors">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-2" /> Weaknesses
                  </h4>
                  <ul className="space-y-3">
                    {aiReport.code_analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-secondary-text flex items-start group">
                        <span className="text-red-500 mr-2 font-bold">•</span>
                        <span className="group-hover:text-primary-text transition-colors">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center bg-background/20 rounded-[2rem] border border-dashed border-border/60">
              <Search className="w-10 h-10 text-secondary-text/20 mx-auto mb-4" />
              <p className="text-sm font-black text-secondary-text/30 uppercase tracking-widest">Analysis unavailable</p>
              <p className="text-xs text-secondary-text/40 mt-1 italic font-medium px-8">The AI engine was unable to provide structural insights for this project.</p>
            </div>
          )}
        </motion.div>

        {/* Security Agent Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl hover:shadow-accent/5 transition-shadow"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-inner">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-primary-text tracking-tight">Security Review</h3>
            </div>
            {aiReport && (
              <div className={`text-3xl font-black ${getScoreColor(aiReport.security_review.score)}`}>
                {aiReport.security_review.score}%
              </div>
            )}
          </div>

          {aiReport ? (
            <div className="space-y-8">
               <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text/40 mb-4 flex items-center">
                  <Search className="w-3 h-3 mr-2" /> Risk Posture
                </h4>
                <p className="text-[15px] text-secondary-text leading-relaxed font-medium">{aiReport.security_review.risk_summary}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60">Critical Findings</h4>
                 {aiReport.security_review.findings.length > 0 ? (
                   <div className="grid gap-4">
                     {aiReport.security_review.findings.slice(0, 3).map((f, i) => (
                       <div key={i} className="p-5 rounded-2xl border border-border/40 bg-background/20 group hover:border-red-500/30 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shadow-sm ${getSeverityColor(f.severity)}`}>
                              {f.severity}
                            </span>
                            <span className="text-[10px] text-secondary-text/30 font-black uppercase tracking-widest">Finding #{i+1}</span>
                          </div>
                          <p className="text-sm text-primary-text font-bold mb-2 tracking-tight group-hover:text-red-400 transition-colors">{f.issue}</p>
                          <div className="flex items-start space-x-2 text-xs text-secondary-text/80 leading-relaxed italic">
                             <Zap className="w-3 h-3 mt-0.5 text-accent flex-shrink-0" />
                             <span>Fix: {f.fix}</span>
                          </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="p-10 rounded-[2rem] border border-green-500/20 bg-green-500/5 text-center">
                     <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3 opacity-40" />
                     <p className="text-xs text-green-500 font-black uppercase tracking-[0.2em]">Zero Vulnerabilities Detected</p>
                   </div>
                 )}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center bg-background/20 rounded-[2rem] border border-dashed border-border/60">
              <ShieldCheck className="w-10 h-10 text-secondary-text/20 mx-auto mb-4" />
              <p className="text-sm font-black text-secondary-text/30 uppercase tracking-widest">Security unavailable</p>
              <p className="text-xs text-secondary-text/40 mt-1 italic font-medium px-8">Static analysis could not be completed for this repository.</p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Documentation Results */}
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-primary-text tracking-tight">Documentation</h3>
            </div>
            {aiReport && (
              <div className={`text-3xl font-black ${getScoreColor(aiReport.documentation_review.score)}`}>
                {aiReport.documentation_review.score}%
              </div>
            )}
          </div>

          {aiReport ? (
            <div className="space-y-8">
               <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text/40 mb-4 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-2" /> Quality Assessment
                </h4>
                <p className="text-[15px] text-secondary-text leading-relaxed font-medium">{aiReport.documentation_review.assessment}</p>
              </div>

              <div className="pt-4 border-t border-border/40">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/60 mb-4">Gaps Identified</h4>
                <div className="flex flex-wrap gap-2.5">
                  {aiReport.documentation_review.missing_sections.map((m, i) => (
                    <span key={i} className="text-[10px] font-black text-secondary-text/80 bg-background/50 border border-border/60 px-3 py-1.5 rounded-xl hover:border-orange-500/30 transition-colors">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center bg-background/20 rounded-[2rem] border border-dashed border-border/60">
              <FileText className="w-10 h-10 text-secondary-text/20 mx-auto mb-4" />
              <p className="text-sm font-black text-secondary-text/30 uppercase tracking-widest">Docs unavailable</p>
            </div>
          )}
        </motion.div>

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl"
        >
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-inner">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-primary-text tracking-tight">Action Plan</h3>
          </div>

          {aiReport ? (
            <div className="space-y-6">
              {Object.entries(aiReport.action_plan).map(([priority, items]) => {
                if (!items.length) return null;
                return (
                  <div key={priority} className="relative pl-6 border-l-2 border-border/60 group">
                     <div className={`absolute top-0 left-[-2px] w-0.5 h-6 group-hover:h-full transition-all duration-500 ${
                       priority === 'critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                       priority === 'high' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
                       priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                     }`}></div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text/40 mb-3">
                       {priority} Priority
                     </h4>
                     <ul className="space-y-3">
                       {items.slice(0, 2).map((item, i) => (
                         <li key={i} className="text-xs text-primary-text font-bold flex items-start group/item">
                           <Zap className="w-3 h-3 mr-3 mt-0.5 text-accent flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                           <span className="leading-relaxed">{item}</span>
                         </li>
                       ))}
                     </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-background/20 rounded-[2rem] border border-dashed border-border/60">
              <ClipboardList className="w-10 h-10 text-secondary-text/20 mx-auto mb-4" />
              <p className="text-sm font-black text-secondary-text/30 uppercase tracking-widest">Plan unavailable</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Strategic Recommendation */}
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className={`bg-accent/5 border border-accent/10 rounded-[2.5rem] p-10 relative overflow-hidden group ${!aiReport ? 'opacity-50' : ''}`}
      >
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

         <div className="flex items-center space-x-5 mb-6 relative z-10">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center shadow-lg shadow-accent/10 group-hover:scale-110 transition-transform duration-500">
               <TrendingUp className="w-7 h-7 text-accent" />
            </div>
            <div>
               <h3 className="text-xl font-black text-primary-text tracking-tight">Strategic Recommendation</h3>
               <p className="text-xs text-secondary-text font-bold uppercase tracking-widest opacity-60 mt-0.5">
                 {aiReport ? 'Engineering Roadmap' : 'Guidance unavailable'}
               </p>
            </div>
         </div>

         <div className="relative z-10">
            {aiReport ? (
              <div className="relative">
                 <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 rounded-full"></div>
                 <p className="text-[17px] text-primary-text/90 leading-relaxed italic pl-8 py-2 font-medium">
                    &quot;{aiReport.overall_recommendation}&quot;
                 </p>
              </div>
            ) : (
              <div className="pl-8 py-2">
                 <p className="text-sm text-secondary-text italic font-medium">The AI engine was unable to formulate a strategic roadmap for this project at this time.</p>
              </div>
            )}
         </div>
      </motion.div>
    </div>
  );
}
