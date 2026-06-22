'use client';

import { useState, useEffect } from 'react';
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
  LucideIcon,
  FileText
} from 'lucide-react';
import { AnalysisSummary } from '@/types/analysis';

interface SummaryCardProps {
  summary: AnalysisSummary;
  duration?: number | null;
  onReset: () => void;
  onRetry?: () => void;
  isDemo?: boolean;
}

const ScoreBadge = ({ score }: { score: number }) => {
  if (score >= 80) return <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm">🟢 Excellent</span>;
  if (score >= 60) return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm">🟡 Good</span>;
  if (score >= 40) return <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm">🟠 Fair</span>;
  return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm">🔴 Needs Attention</span>;
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
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-inner">
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
            <div className="text-secondary-text/60 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center hover:text-accent transition-colors">
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
              className="mt-6 text-[15px] text-secondary-text/80 leading-relaxed"
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

export default function SummaryCard({ summary, duration, onReset, onRetry, isDemo }: SummaryCardProps) {
  const aiReport = summary.ai_report;
  const aiError = summary.ai_error;
  const timestamp = new Date().toLocaleString();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCopy = () => {
    const reportText = JSON.stringify(summary, null, 2);
    navigator.clipboard.writeText(reportText);
    alert('Analysis report copied to clipboard.');
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repomind-report-${summary.project_name}.json`;
    a.click();
  };

  const handleExportMarkdown = () => {
    const md = `# RepoMind AI Analysis: ${summary.project_name}\n\nGenerated: ${timestamp}\n\nOverall Score: ${aiReport?.overall_score || 'N/A'}/100\n\n## Overview\n${aiReport?.summary.overview || 'Analysis incomplete.'}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repomind-report-${summary.project_name}.md`;
    a.click();
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header & Export Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shadow-lg shadow-accent/10 animate-in fade-in zoom-in duration-500">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-text tracking-tight flex items-center">
               {isDemo && <span className="mr-3 px-2 py-0.5 rounded-lg bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest border border-accent/20 flex items-center">✨ Demo</span>}
               {aiReport ? 'Analysis Complete' : 'Preprocessing Complete'}
            </h1>
            <p className="text-[10px] text-secondary-text font-black uppercase tracking-[0.2em] opacity-60">
              {isDemo ? 'Sample Analysis Data' : 'Session Report'} • {timestamp}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
           <button onClick={handleCopy} aria-label="Copy report to clipboard" className="px-5 py-2.5 rounded-xl bg-surface border border-border text-[10px] font-black uppercase tracking-widest text-secondary-text hover:text-accent hover:border-accent transition-all flex items-center shadow-xl cursor-pointer active:scale-95"><Copy className="w-4 h-4 mr-2" /> Copy</button>
           <button onClick={handleDownloadJSON} aria-label="Download report as JSON" className="px-5 py-2.5 rounded-xl bg-surface border border-border text-[10px] font-black uppercase tracking-widest text-secondary-text hover:text-accent hover:border-accent transition-all flex items-center shadow-xl cursor-pointer active:scale-95"><Download className="w-4 h-4 mr-2" /> JSON</button>
           <button onClick={handleExportMarkdown} aria-label="Export report as Markdown" className="px-5 py-2.5 rounded-xl bg-surface border border-border text-[10px] font-black uppercase tracking-widest text-secondary-text hover:text-accent hover:border-accent transition-all flex items-center shadow-xl cursor-pointer active:scale-95"><FileCode className="w-4 h-4 mr-2" /> Markdown</button>
        </div>
      </div>

      {/* Main Score & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[320px]"
        >
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${aiReport ? 'from-accent/40 via-green-500/40 to-accent/40 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'from-yellow-500/30 via-orange-500/30 to-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]'}`}></div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-12">
             <div className="text-center sm:text-left">
                <p className="text-[11px] font-black text-secondary-text/40 uppercase tracking-[0.3em] mb-4">Overall Health Score</p>
                <div className="flex items-baseline justify-center sm:justify-start space-x-2">
                   <span className={`text-8xl font-black tracking-tighter ${aiReport ? (aiReport.overall_score >= 80 ? 'text-green-500' : aiReport.overall_score >= 50 ? 'text-yellow-500' : 'text-red-500') : 'text-secondary-text/20'}`}>
                      {aiReport ? aiReport.overall_score : 'N/A'}
                   </span>
                   {aiReport && <span className="text-3xl font-bold text-secondary-text/20">/100</span>}
                </div>
                <div className="mt-8 flex justify-center sm:justify-start">
                   {aiReport ? <ScoreBadge score={aiReport.overall_score} /> : <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm">⚠ Analysis Unavailable</span>}
                </div>
             </div>

             <div className="w-full sm:w-72 space-y-5 bg-background/40 border border-border/40 rounded-[2rem] p-8 shadow-inner">
                <h4 className="text-[10px] font-black text-secondary-text/40 uppercase tracking-[0.2em] flex items-center mb-2"><Info className="w-3.5 h-3.5 mr-2" /> Component Breakdown</h4>
                {[
                  { label: 'Code Quality', val: aiReport?.code_analysis.score },
                  { label: 'Security', val: aiReport?.security_review.score },
                  { label: 'Documentation', val: aiReport?.documentation_review.score }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                     <span className="text-xs font-bold text-secondary-text/80 group-hover:text-primary-text transition-colors">{item.label}</span>
                     <span className={`text-xs font-black ${item.val ? (item.val >= 80 ? 'text-green-500' : item.val >= 50 ? 'text-yellow-500' : 'text-red-500') : 'text-secondary-text/20'}`}>{item.val ? `${item.val}%` : 'N/A'}</span>
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
           <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-border/40 pb-5">
                 <div className="flex items-center text-secondary-text/60">
                    <Clock className="w-4 h-4 mr-3" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Duration</span>
                 </div>
                 <span className="text-xs font-black text-primary-text">{duration ? `${duration.toFixed(1)}s` : 'Fast'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-5">
                 <div className="flex items-center text-secondary-text/60">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Processed</span>
                 </div>
                 <span className="text-xs font-black text-primary-text">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center text-secondary-text/60">
                    <FolderOpen className="w-4 h-4 mr-3" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Inventory</span>
                 </div>
                 <span className="text-xs font-black text-primary-text">{summary.files_scanned} Files</span>
              </div>
           </div>

           <button onClick={onReset} aria-label={isDemo ? "Analyze your repository" : "Start a new analysis"} className="mt-10 w-full py-4 rounded-2xl bg-background border border-border text-[10px] font-black uppercase tracking-[0.3em] text-secondary-text hover:text-accent hover:border-accent transition-all active:scale-95 shadow-lg cursor-pointer">
             {isDemo ? 'Analyze Your Repository' : 'Analyze Another'}
           </button>
        </motion.div>
      </div>

      {/* Executive Summary */}
      {aiReport && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-accent/5 border border-accent/20 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl"
        >
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[140px] rounded-full -mr-64 -mt-64"></div>
           <h2 className="text-2xl font-black text-primary-text tracking-tight mb-10 flex items-center relative z-10">
              <Zap className="w-6 h-6 mr-4 text-accent" /> Executive Summary
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent/60 flex items-center">Key Strengths</h4>
                 <ul className="space-y-4">
                    {aiReport.code_analysis.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-sm text-primary-text/90 font-medium flex items-start group"><Check className="w-4 h-4 mr-3 text-green-500 mt-0.5 flex-shrink-0" /> {s}</li>
                    ))}
                 </ul>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-500/60 flex items-center">Priority Risks</h4>
                 <ul className="space-y-4">
                    {aiReport.security_review.findings.slice(0, 3).map((f, i) => (
                      <li key={i} className="text-sm text-primary-text/90 font-medium flex items-start group"><AlertCircle className="w-4 h-4 mr-3 text-red-500 mt-0.5 flex-shrink-0" /> {f.issue}</li>
                    ))}
                 </ul>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-yellow-500/60 flex items-center">Top Priorities</h4>
                 <ul className="space-y-4">
                    {Object.values(aiReport.action_plan).flat().slice(0, 3).map((p, i) => (
                      <li key={i} className="text-sm text-primary-text/90 font-medium flex items-start group"><TrendingUp className="w-4 h-4 mr-3 text-yellow-500 mt-0.5 flex-shrink-0" /> {p}</li>
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
          className="bg-red-500/10 border border-red-500/20 rounded-[2.5rem] p-12 text-center shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-6">
             <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-primary-text tracking-tight mb-3">AI Analysis Unavailable</h3>
          <p className="text-base text-secondary-text max-w-xl mx-auto mb-10 leading-relaxed italic">{aiError}</p>
          <div className="flex flex-wrap justify-center gap-5">
             {onRetry && <button onClick={onRetry} aria-label="Retry AI analysis" className="px-10 py-3.5 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-600 transition-all flex items-center shadow-lg cursor-pointer active:scale-95"><RefreshCw className="w-4 h-4 mr-3" /> Retry Analysis</button>}
             <button onClick={onReset} aria-label="Select a different project" className="px-10 py-3.5 rounded-2xl bg-surface border border-border text-secondary-text font-black uppercase tracking-[0.2em] text-[10px] hover:border-accent hover:text-accent transition-all shadow-lg cursor-pointer active:scale-95">Select Another Project</button>
          </div>
        </motion.div>
      )}

      {/* Detailed Sections */}
      {aiReport ? (
        <div className="space-y-10">
          {/* Code Analysis */}
          <CollapsibleSection
            title="Code Architecture & Quality"
            icon={Code2}
            score={aiReport.code_analysis.score}
            collapsedContent={
               <div className="space-y-3">
                  <p className="italic mb-4">&quot;{aiReport.code_analysis.architecture.split('.')[0]}.&quot;</p>
                  <div className="flex flex-wrap gap-2">
                     {aiReport.code_analysis.strengths.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[10px] bg-green-500/5 text-green-500/80 px-2 py-0.5 rounded border border-green-500/10 flex items-center"><Check className="w-2 h-2 mr-1" /> {s}</span>
                     ))}
                  </div>
               </div>
            }
          >
            <div className="space-y-12">
               <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary-text/40 mb-5 flex items-center"><Layout className="w-3.5 h-3.5 mr-3" /> System Architecture</h4>
                  <p className="text-base text-secondary-text leading-relaxed font-medium bg-background/30 p-8 rounded-3xl border border-border/20">{aiReport.code_analysis.architecture}</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-green-500/60 flex items-center"><Zap className="w-3.5 h-3.5 mr-3" /> Core Strengths</h4>
                     <ul className="space-y-4">
                        {aiReport.code_analysis.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-secondary-text flex items-start group"><Check className="w-4 h-4 mr-4 text-green-500 mt-0.5 flex-shrink-0" /> <span className="group-hover:text-primary-text transition-colors leading-relaxed">{s}</span></li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-6">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-500/60 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-3" /> Areas for Improvement</h4>
                     <ul className="space-y-4">
                        {aiReport.code_analysis.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-secondary-text flex items-start group"><AlertTriangle className="w-4 h-4 mr-4 text-red-500 mt-0.5 flex-shrink-0" /> <span className="group-hover:text-primary-text transition-colors leading-relaxed">{w}</span></li>
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
            collapsedContent={
               <div className="space-y-3">
                  <p className="italic mb-4">{aiReport.security_review.risk_summary.split('.')[0]}.</p>
                  <div className="flex flex-wrap gap-2">
                     {aiReport.security_review.findings.slice(0, 3).map((f, i) => (
                        <span key={i} className={`text-[10px] px-2 py-0.5 rounded border flex items-center ${f.severity === 'Critical' || f.severity === 'High' ? 'bg-red-500/5 text-red-500/80 border-red-500/10' : 'bg-yellow-500/5 text-yellow-500/80 border-yellow-500/10'}`}>
                           <AlertCircle className="w-2 h-2 mr-1" /> {f.issue}
                        </span>
                     ))}
                  </div>
               </div>
            }
          >
            <div className="space-y-10">
               <p className="text-base text-secondary-text leading-relaxed font-medium bg-background/30 p-8 rounded-3xl border border-border/20">{aiReport.security_review.risk_summary}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                  {aiReport.security_review.findings.map((f, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] bg-background/40 border border-border/60 hover:border-red-500/30 transition-all flex flex-col justify-between shadow-lg group">
                       <div>
                          <div className="flex items-center justify-between mb-6">
                             <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-[0.2em] shadow-sm ${f.severity === 'Critical' || f.severity === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>{f.severity}</span>
                             <ShieldCheck className="w-5 h-5 text-secondary-text/20 group-hover:text-accent transition-colors" />
                          </div>
                          <h5 className="text-[15px] font-black text-primary-text tracking-tight mb-3 leading-tight group-hover:text-accent transition-colors">{f.issue}</h5>
                       </div>
                       <div className="mt-6 pt-6 border-t border-border/20">
                          <p className="text-[10px] text-accent font-black uppercase tracking-[0.3em] mb-2 italic">Remediation</p>
                          <p className="text-xs text-secondary-text leading-relaxed font-medium">{f.fix}</p>
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
            collapsedContent={
               <div className="flex flex-wrap gap-2">
                  {Object.values(aiReport.action_plan).flat().slice(0, 4).map((p, i) => (
                     <span key={i} className="text-[10px] bg-accent/5 text-accent/80 px-2 py-0.5 rounded border border-accent/10 flex items-center"><Zap className="w-2 h-2 mr-1" /> {p}</span>
                  ))}
               </div>
            }
          >
            <div className="space-y-10">
               {Object.entries(aiReport.action_plan).map(([priority, items]) => {
                  if (!items.length) return null;
                  return (
                    <div key={priority} className="relative pl-10 border-l-2 border-border/60 group">
                       <div className={`absolute top-0 left-[-2px] w-0.5 h-12 group-hover:h-full transition-all duration-700 ${priority === 'critical' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : priority === 'high' ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-accent shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}></div>
                       <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary-text/40 mb-6">{priority} Priority</h4>
                       <ul className="space-y-5">
                          {items.map((item, i) => (
                            <li key={i} className="text-[15px] text-primary-text/90 font-bold flex items-start group/item">
                               <Zap className="w-5 h-5 mr-4 mt-0.5 text-accent flex-shrink-0 group-hover/item:scale-125 group-hover/item:rotate-12 transition-all" />
                               <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                  );
               })}
            </div>
          </CollapsibleSection>

          {/* Strategic Roadmap */}
          <CollapsibleSection
            title="Strategic Roadmap"
            icon={TrendingUp}
            collapsedContent={<p className="line-clamp-2 italic font-medium">&quot;{aiReport.overall_recommendation.split('.')[0]}.&quot;</p>}
          >
            <div className="space-y-12">
               <div className="relative bg-background/30 p-10 rounded-[3rem] border border-border/20 shadow-inner">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-accent/30 rounded-full"></div>
                  <div className="pl-8">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent/60 mb-6 flex items-center"><Search className="w-4 h-4 mr-3" /> Master Analysis</h4>
                     <p className="text-xl text-primary-text/90 leading-relaxed italic font-medium tracking-tight">&quot;{aiReport.overall_recommendation}&quot;</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-10 rounded-[2.5rem] bg-surface border border-border/40 hover:border-accent/30 transition-colors shadow-lg">
                     <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary-text/40 mb-6 flex items-center"><Zap className="w-4 h-4 mr-3" /> Next Steps</h5>
                     <p className="text-base text-secondary-text leading-relaxed font-medium">Focus on stabilizing core architecture while addressing identified security gaps. Technical debt reduction should be prioritized in the next sprint cycle to ensure scalable growth.</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-surface border border-border/40 hover:border-accent/30 transition-colors shadow-lg">
                     <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary-text/40 mb-6 flex items-center"><TrendingUp className="w-4 h-4 mr-3" /> Business Impact</h5>
                     <p className="text-base text-secondary-text leading-relaxed font-medium">Improving maintainability and documentation will reduce developer onboarding time by an estimated 30% and significantly decrease long-term maintenance overhead.</p>
                  </div>
               </div>
            </div>
          </CollapsibleSection>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 text-center bg-surface border border-dashed border-border/60 rounded-[3rem] shadow-inner"
        >
           <div className="w-20 h-20 rounded-full bg-secondary-text/5 flex items-center justify-center mx-auto mb-6 text-secondary-text/20">
              <FileText className="w-10 h-10" />
           </div>
           <p className="text-xl font-black text-secondary-text/40 tracking-tight mb-2">No analysis report available.</p>
           <p className="text-sm text-secondary-text/30 italic max-w-sm mx-auto">Upload a ZIP file or GitHub repository to generate an automated engineering audit.</p>
        </motion.div>
      )}
    </div>
  );
}
