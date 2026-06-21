'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  ShieldAlert,
  Layout,
  AlertTriangle,
  Zap,
  TrendingUp,
  Search,
  ClipboardList,
  AlertCircle,
  RefreshCw,
  FolderOpen,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  FileCode,
  Clock,
  Calendar,
  BarChart3,
  Info,
  Check,
  LucideIcon
} from 'lucide-react';
import { AnalysisSummary } from '@/types/analysis';

interface SummaryCardProps {
  summary: AnalysisSummary;
  duration?: number | null;
  onReset: () => void;
  onRetry?: () => void;
}

const ScoreBadge = ({ score }: { score: number }) => {
  if (score >= 80) return <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center">🟢 Excellent</span>;
  if (score >= 60) return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center">🟡 Good</span>;
  if (score >= 40) return <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center">🟠 Fair</span>;
  return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center">🔴 Needs Attention</span>;
};

const CollapsibleSection = ({
  title,
  icon: Icon,
  score,
  children,
  collapsedContent,
  confidence = "High"
}: {
  title: string,
  icon: LucideIcon,
  score?: number,
  children: React.ReactNode,
  collapsedContent: React.ReactNode,
  confidence?: "High" | "Medium" | "Low"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-[2rem] overflow-hidden shadow-xl"
    >
      <div
        className="p-8 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-primary-text tracking-tight">{title}</h3>
              <div className="flex items-center space-x-3 mt-1">
                {score !== undefined && (
                  <span className={`text-sm font-bold ${score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {score}% Confidence: {confidence}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-secondary-text/60 font-bold text-xs uppercase tracking-widest flex items-center hover:text-accent transition-colors">
              {isExpanded ? <><ChevronUp className="w-4 h-4 mr-2" /> Hide Details</> : <><ChevronDown className="w-4 h-4 mr-2" /> Show Details</>}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-sm text-secondary-text/80 leading-relaxed"
            >
              {collapsedContent}
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 border-t border-border/40 pt-8"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function SummaryCard({ summary, duration, onReset, onRetry }: SummaryCardProps) {
  const aiReport = summary.ai_report;
  const aiError = summary.ai_error;
  const timestamp = new Date().toLocaleString();

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
    alert('Report copied to clipboard!');
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repomind-analysis-${summary.project_name}.json`;
    a.click();
  };

  const handleExportMarkdown = () => {
    const md = `# RepoMind AI Analysis: ${summary.project_name}\n\nGenerated: ${timestamp}\n\nOverall Score: ${aiReport?.overall_score || 'N/A'}/100`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repomind-analysis-${summary.project_name}.md`;
    a.click();
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header & Export Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-primary-text tracking-tight">Engineering Insights</h1>
            <p className="text-xs text-secondary-text font-bold uppercase tracking-widest opacity-60">Session Report • {timestamp}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
           <button onClick={handleCopy} className="px-4 py-2 rounded-xl bg-surface border border-border text-[10px] font-black uppercase tracking-widest text-secondary-text hover:text-accent hover:border-accent transition-all flex items-center shadow-lg cursor-pointer"><Copy className="w-3.5 h-3.5 mr-2" /> Copy</button>
           <button onClick={handleDownloadJSON} className="px-4 py-2 rounded-xl bg-surface border border-border text-[10px] font-black uppercase tracking-widest text-secondary-text hover:text-accent hover:border-accent transition-all flex items-center shadow-lg cursor-pointer"><Download className="w-3.5 h-3.5 mr-2" /> JSON</button>
           <button onClick={handleExportMarkdown} className="px-4 py-2 rounded-xl bg-surface border border-border text-[10px] font-black uppercase tracking-widest text-secondary-text hover:text-accent hover:border-accent transition-all flex items-center shadow-lg cursor-pointer"><FileCode className="w-3.5 h-3.5 mr-2" /> Markdown</button>
        </div>
      </div>

      {/* Main Score & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent/40 via-green-500/40 to-accent/40"></div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
             <div className="text-center sm:text-left">
                <p className="text-[10px] font-black text-secondary-text/40 uppercase tracking-[0.2em] mb-4">Overall Health Score</p>
                <div className="flex items-baseline space-x-2">
                   <span className={`text-7xl font-black tracking-tighter ${aiReport ? (aiReport.overall_score >= 80 ? 'text-green-500' : aiReport.overall_score >= 50 ? 'text-yellow-500' : 'text-red-500') : 'text-secondary-text/20'}`}>
                      {aiReport ? aiReport.overall_score : '--'}
                   </span>
                   <span className="text-2xl font-bold text-secondary-text/20">/100</span>
                </div>
                <div className="mt-6 flex justify-center sm:justify-start">
                   {aiReport ? <ScoreBadge score={aiReport.overall_score} /> : <span className="text-xs font-bold text-secondary-text/40 italic">Analysis Pending</span>}
                </div>
             </div>

             <div className="w-full sm:w-64 space-y-4 bg-background/40 border border-border/40 rounded-3xl p-6">
                <h4 className="text-[10px] font-black text-secondary-text/40 uppercase tracking-widest flex items-center"><Info className="w-3 h-3 mr-2" /> Score Breakdown</h4>
                {[
                  { label: 'Code Quality', val: aiReport?.code_analysis.score },
                  { label: 'Security', val: aiReport?.security_review.score },
                  { label: 'Documentation', val: aiReport?.documentation_review.score }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                     <span className="text-xs font-bold text-secondary-text/80">{item.label}</span>
                     <span className={`text-xs font-black ${item.val ? (item.val >= 80 ? 'text-green-500' : 'text-yellow-500') : 'text-secondary-text/20'}`}>{item.val ? `${item.val}%` : 'N/A'}</span>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl flex flex-col justify-between"
        >
           <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                 <div className="flex items-center text-secondary-text/60">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                 </div>
                 <span className="text-xs font-black text-primary-text">{duration ? `${duration.toFixed(1)}s` : 'Fast'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                 <div className="flex items-center text-secondary-text/60">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Processed</span>
                 </div>
                 <span className="text-xs font-black text-primary-text">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center text-secondary-text/60">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Files</span>
                 </div>
                 <span className="text-xs font-black text-primary-text">{summary.files_scanned} Items</span>
              </div>
           </div>

           <button onClick={onReset} className="mt-8 w-full py-4 rounded-2xl bg-background border border-border text-xs font-black uppercase tracking-[0.2em] text-secondary-text hover:text-accent hover:border-accent transition-all active:scale-95 cursor-pointer">Analyze Another</button>
        </motion.div>
      </div>

      {/* Executive Summary */}
      {aiReport && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-accent/5 border border-accent/20 rounded-[2.5rem] p-10 relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
           <h2 className="text-2xl font-black text-primary-text tracking-tight mb-8 flex items-center">
              <Zap className="w-6 h-6 mr-3 text-accent" /> Executive Summary
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">Key Highlights</h4>
                 <ul className="space-y-3">
                    {aiReport.code_analysis.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-sm text-primary-text/90 font-medium flex items-start"><Check className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" /> {s}</li>
                    ))}
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60">Priority Risks</h4>
                 <ul className="space-y-3">
                    {aiReport.security_review.findings.slice(0, 3).map((f, i) => (
                      <li key={i} className="text-sm text-primary-text/90 font-medium flex items-start"><AlertCircle className="w-4 h-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" /> {f.issue}</li>
                    ))}
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500/60">Immediate Focus</h4>
                 <ul className="space-y-3">
                    {Object.values(aiReport.action_plan).flat().slice(0, 3).map((p, i) => (
                      <li key={i} className="text-sm text-primary-text/90 font-medium flex items-start"><TrendingUp className="w-4 h-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" /> {p}</li>
                    ))}
                 </ul>
              </div>
           </div>
        </motion.div>
      )}

      {/* AI Error Handling UI */}
      {aiError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border border-red-500/20 rounded-[2.5rem] p-10 text-center"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-black text-primary-text tracking-tight mb-2">AI Analysis Unavailable</h3>
          <p className="text-sm text-secondary-text max-w-md mx-auto mb-8">{aiError}</p>
          <div className="flex justify-center gap-4">
             {onRetry && <button onClick={onRetry} className="px-8 py-3 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all flex items-center cursor-pointer"><RefreshCw className="w-4 h-4 mr-2" /> Retry AI analysis</button>}
             <button onClick={onReset} className="px-8 py-3 rounded-2xl bg-surface border border-border text-secondary-text font-black uppercase tracking-widest text-xs hover:border-accent hover:text-accent transition-all cursor-pointer">Select Another Project</button>
          </div>
        </motion.div>
      )}

      {/* Detailed Sections */}
      {aiReport ? (
        <div className="space-y-8">
          {/* Code Analysis */}
          <CollapsibleSection
            title="Code Architecture & Quality"
            icon={Code2}
            score={aiReport.code_analysis.score}
            collapsedContent={<p className="line-clamp-2 italic">&quot;{aiReport.code_analysis.architecture}&quot;</p>}
          >
            <div className="space-y-10">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text/40 mb-4 flex items-center"><Layout className="w-3 h-3 mr-2" /> System Architecture</h4>
                  <p className="text-base text-secondary-text leading-relaxed font-medium">{aiReport.code_analysis.architecture}</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500/60">Core Strengths</h4>
                     <ul className="space-y-3">
                        {aiReport.code_analysis.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-secondary-text flex items-start group"><Check className="w-4 h-4 mr-3 text-green-500 mt-0.5 flex-shrink-0" /> <span className="group-hover:text-primary-text transition-colors">{s}</span></li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60">Areas for Improvement</h4>
                     <ul className="space-y-3">
                        {aiReport.code_analysis.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-secondary-text flex items-start group"><AlertTriangle className="w-4 h-4 mr-3 text-red-500 mt-0.5 flex-shrink-0" /> <span className="group-hover:text-primary-text transition-colors">{w}</span></li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
          </CollapsibleSection>

          {/* Security Review */}
          <CollapsibleSection
            title="Security Posture"
            icon={ShieldAlert}
            score={aiReport.security_review.score}
            collapsedContent={<p className="line-clamp-2 italic">{aiReport.security_review.risk_summary}</p>}
          >
            <div className="space-y-8">
               <p className="text-base text-secondary-text leading-relaxed font-medium">{aiReport.security_review.risk_summary}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiReport.security_review.findings.map((f, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-background/40 border border-border/60 hover:border-red-500/30 transition-all flex flex-col justify-between">
                       <div>
                          <div className="flex items-center justify-between mb-4">
                             <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${f.severity === 'Critical' || f.severity === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>{f.severity}</span>
                             <ShieldCheck className="w-4 h-4 text-secondary-text/20" />
                          </div>
                          <h5 className="text-sm font-black text-primary-text tracking-tight mb-2 leading-snug">{f.issue}</h5>
                       </div>
                       <div className="mt-4 pt-4 border-t border-border/20">
                          <p className="text-[11px] text-accent font-black uppercase tracking-widest mb-1 italic">Suggested Fix</p>
                          <p className="text-xs text-secondary-text leading-relaxed">{f.fix}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </CollapsibleSection>

          {/* Action Plan */}
          <CollapsibleSection
            title="Engineering Action Plan"
            icon={ClipboardList}
            collapsedContent={<p className="text-sm font-bold text-accent">Top priorities: {Object.values(aiReport.action_plan).flat().slice(0, 3).join(', ')}...</p>}
          >
            <div className="space-y-8">
               {Object.entries(aiReport.action_plan).map(([priority, items]) => {
                  if (!items.length) return null;
                  return (
                    <div key={priority} className="relative pl-8 border-l-2 border-border group">
                       <div className={`absolute top-0 left-[-2px] w-0.5 h-10 group-hover:h-full transition-all duration-700 ${priority === 'critical' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : priority === 'high' ? 'bg-orange-500' : 'bg-accent'}`}></div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-text/40 mb-4">{priority} Priority</h4>
                       <ul className="space-y-4">
                          {items.map((item, i) => (
                            <li key={i} className="text-sm text-primary-text font-bold flex items-start group/item">
                               <Zap className="w-4 h-4 mr-3 mt-0.5 text-accent flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                               <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                  );
               })}
            </div>
          </CollapsibleSection>

          {/* Strategic Recommendation */}
          <CollapsibleSection
            title="Strategic Roadmap"
            icon={TrendingUp}
            collapsedContent={<p className="line-clamp-2 italic">&quot;{aiReport.overall_recommendation.split('.')[0]}.&quot;</p>}
          >
            <div className="space-y-10">
               <div className="relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 rounded-full"></div>
                  <div className="pl-10">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 mb-6">Master Overview</h4>
                     <p className="text-lg text-primary-text/90 leading-relaxed italic font-medium">&quot;{aiReport.overall_recommendation}&quot;</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-8 rounded-[2.5rem] bg-background/40 border border-border/40">
                     <h5 className="text-[10px] font-black uppercase tracking-widest text-secondary-text/40 mb-4 italic">Next Steps</h5>
                     <p className="text-sm text-secondary-text leading-relaxed">Focus on stabilizing core architecture while addressing identified security gaps. Technical debt reduction should be prioritized in the next sprint cycle.</p>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-background/40 border border-border/40">
                     <h5 className="text-[10px] font-black uppercase tracking-widest text-secondary-text/40 mb-4 italic">Business Impact</h5>
                     <p className="text-sm text-secondary-text leading-relaxed">Improving maintainability and documentation will reduce developer onboarding time by an estimated 30% and decrease production risk.</p>
                  </div>
               </div>
            </div>
          </CollapsibleSection>
        </div>
      ) : (
        <div className="py-20 text-center bg-surface border border-dashed border-border rounded-[3rem]">
           <Search className="w-12 h-12 text-secondary-text/20 mx-auto mb-4" />
           <p className="text-lg font-black text-secondary-text/40 tracking-tight">No analysis available yet.</p>
           <p className="text-sm text-secondary-text/30 mt-1 italic">Successfully preprocessed, but AI analysis was skipped or failed.</p>
        </div>
      )}
    </div>
  );
}
