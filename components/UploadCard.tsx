'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Zap,
  Code2,
  FileJson,
  AlertCircle,
  Brain,
  Clock,
  XCircle,
  RefreshCw,
  Layout,
  Check,
  Search,
  Globe,
  LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisSummary } from '@/types/analysis';

type SourceType = 'github' | 'zip' | null;

interface LoadingStage {
  id: string;
  label: string;
  icon: LucideIcon;
  percentage: number;
}

const GITHUB_STAGES: LoadingStage[] = [
  { id: 'received', label: 'Validating URL', icon: Globe, percentage: 10 },
  { id: 'cloning', label: 'Cloning repository', icon: RefreshCw, percentage: 25 },
  { id: 'extracting', label: 'Reading files', icon: Search, percentage: 40 },
  { id: 'languages', label: 'Detecting languages', icon: Code2, percentage: 55 },
  { id: 'map', label: 'Building project map', icon: Layout, percentage: 70 },
  { id: 'agents', label: 'Running AI analysis', icon: Brain, percentage: 85 },
  { id: 'final', label: 'Finalizing report', icon: Zap, percentage: 100 }
];

const ZIP_STAGES: LoadingStage[] = [
  { id: 'received', label: 'Uploading archive', icon: Upload, percentage: 15 },
  { id: 'extracting', label: 'Extracting ZIP', icon: FileJson, percentage: 35 },
  { id: 'languages', label: 'Detecting languages', icon: Code2, percentage: 50 },
  { id: 'map', label: 'Building project map', icon: Layout, percentage: 65 },
  { id: 'agents', label: 'Running AI analysis', icon: Brain, percentage: 80 },
  { id: 'final', label: 'Finalizing report', icon: Zap, percentage: 100 }
];

export default function UploadCard({ onAnalyze }: { onAnalyze: (data: AnalysisSummary) => void }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sourceType, setSourceType] = useState<SourceType>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);

  const zipInputRef = useRef<HTMLInputElement>(null);
  const githubInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stages = sourceType === 'github' ? GITHUB_STAGES : ZIP_STAGES;

  // Simulate progress for UI feel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading && currentStage < stages.length - 1) {
      interval = setInterval(() => {
        setCurrentStage(prev => Math.min(prev + 1, stages.length - 1));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading, currentStage, stages.length]);

  useEffect(() => {
    const handleFocus = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.type === 'zip') {
        zipInputRef.current?.focus();
      } else if (detail.type === 'github') {
        githubInputRef.current?.focus();
      }
    };

    window.addEventListener('repomind-focus', handleFocus);
    return () => window.removeEventListener('repomind-focus', handleFocus);
  }, []);

  const resetState = () => {
    setIsLoading(false);
    setSourceType(null);
    setCurrentStage(0);
    setError(null);
    setIsTimeout(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    abortControllerRef.current = null;
  };

  const cancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    resetState();
  };

  const startTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsTimeout(true);
    }, 60000); // 60 seconds timeout warning
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      await uploadZip(file);
    }
  };

  const uploadZip = async (file: File) => {
    setIsLoading(true);
    setSourceType('zip');
    setCurrentStage(0);
    setError(null);
    setIsTimeout(false);
    startTimeout();

    abortControllerRef.current = new AbortController();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to upload ZIP');

      onAnalyze(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during ZIP upload');
      }
      setFileName(null);
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        resetState();
      }
    }
  };

  const analyzeGithub = async () => {
    if (!githubUrl) return;
    setIsLoading(true);
    setSourceType('github');
    setCurrentStage(0);
    setError(null);
    setIsTimeout(false);
    startTimeout();

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('http://localhost:8000/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: githubUrl }),
        signal: abortControllerRef.current.signal
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to analyze repository');

      onAnalyze(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during GitHub analysis');
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        resetState();
      }
    }
  };

  const progressPercentage = stages[currentStage].percentage;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-surface border border-border rounded-[2rem] p-10 sm:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

        <div className="space-y-10">
          {!isLoading ? (
            <>
              {/* Upload Area */}
              <div className="relative">
                <label
                  htmlFor="zip-upload"
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && (file.type === 'application/zip' || file.name.endsWith('.zip'))) {
                      setFileName(file.name);
                      uploadZip(file);
                    }
                  }}
                  className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-4 focus-within:ring-offset-background ${
                    isDragging
                      ? 'border-accent bg-accent/10 scale-[1.01]'
                      : 'border-border/60 hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-accent" />
                    </div>
                    <p className="mb-2 text-lg text-primary-text font-semibold">
                      {fileName ? 'Selected file:' : 'Drag & Drop your ZIP file here'}
                    </p>
                    <p className="text-sm text-secondary-text mb-6">
                      {fileName ? fileName : 'Supported format: .zip (max 50MB)'}
                    </p>
                    {!fileName && (
                      <div className="px-6 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold group-hover:border-accent group-hover:text-accent group-focus-within:border-accent group-focus-within:text-accent transition-all duration-300 group-active:scale-95">
                        Choose ZIP File
                      </div>
                    )}
                  </div>
                  <input
                    id="zip-upload"
                    ref={zipInputRef}
                    type="file"
                    className="sr-only"
                    accept=".zip"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-500">Analysis failed to start</p>
                        <p className="text-xs text-red-400/80 mt-1">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border/40"></div>
                <span className="flex-shrink mx-6 text-secondary-text/60 text-xs font-bold uppercase tracking-[0.2em]">or analyze via url</span>
                <div className="flex-grow border-t border-border/40"></div>
              </div>

              {/* GitHub Input */}
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-accent">
                    <LinkIcon className="h-5 w-5 text-secondary-text/60 group-focus-within:text-accent" />
                  </div>
                  <input
                    ref={githubInputRef}
                    type="text"
                    className="block w-full h-14 pl-12 pr-4 bg-background/50 border border-border/60 rounded-xl text-primary-text text-sm placeholder:text-secondary-text/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300"
                    placeholder="https://github.com/username/repository"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    aria-label="GitHub Repository URL"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={analyzeGithub}
                  disabled={!githubUrl || isLoading}
                  className="w-full h-14 rounded-xl bg-accent text-white font-bold hover:bg-blue-600 hover:scale-[1.01] transition-all duration-300 shadow-lg shadow-accent/20 flex items-center justify-center active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Repository
                </button>
              </div>
            </>
          ) : (
            /* Premium Analysis Overlay */
            <div className="py-8">
               <div className="flex flex-col items-center mb-12">
                  <div className="relative mb-8">
                     <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse"></div>
                     <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="relative w-24 h-24 rounded-3xl bg-surface border border-accent/30 flex items-center justify-center shadow-2xl"
                     >
                        <Brain className="w-12 h-12 text-accent" />
                     </motion.div>
                  </div>
                  <h2 className="text-3xl font-black text-primary-text mb-2 text-center tracking-tight">Analyzing Project</h2>
                  <p className="text-secondary-text font-medium animate-pulse text-center">{stages[currentStage].label}...</p>
               </div>

               <div className="max-w-md mx-auto space-y-8">
                  {/* Progress Bar */}
                  <div className="space-y-3">
                     <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-secondary-text/60 uppercase tracking-widest">Analysis Progress</span>
                        <span className="text-lg font-black text-accent">{progressPercentage}%</span>
                     </div>
                     <div className="h-3 w-full bg-background border border-border/40 rounded-full overflow-hidden p-0.5">
                        <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${progressPercentage}%` }}
                           transition={{ duration: 0.5 }}
                           className="h-full bg-accent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        />
                     </div>
                  </div>

                  {/* Stages List */}
                  <div className="bg-background/40 border border-border/40 rounded-2xl p-6 space-y-4">
                     {stages.map((stage, idx) => {
                        const isCompleted = idx < currentStage;
                        const isActive = idx === currentStage;
                        const StageIcon = stage.icon;
                        return (
                           <div key={stage.id} className={`flex items-center justify-between transition-all duration-500 ${isActive ? 'scale-[1.02]' : ''}`}>
                              <div className="flex items-center space-x-4">
                                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500 ${
                                    isCompleted ? 'bg-green-500/10 text-green-500' :
                                    isActive ? 'bg-accent/10 text-accent animate-pulse' :
                                    'bg-border/20 text-secondary-text/30'
                                 }`}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : <StageIcon className={`w-4 h-4 ${isActive ? 'animate-spin' : ''}`} />}
                                 </div>
                                 <span className={`text-sm font-bold transition-colors duration-500 ${
                                    isCompleted ? 'text-primary-text' :
                                    isActive ? 'text-accent' :
                                    'text-secondary-text/30'
                                 }`}>
                                    {stage.label}
                                 </span>
                              </div>
                              {isCompleted && (
                                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[10px] font-black text-green-500 uppercase tracking-tighter bg-green-500/10 px-2 py-0.5 rounded">
                                    Done
                                 </motion.div>
                              )}
                           </div>
                        );
                     })}
                  </div>

                  {/* Timeout Warning */}
                  <AnimatePresence>
                    {isTimeout && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex flex-col items-center text-center space-y-3"
                      >
                        <div className="flex items-center space-x-2 text-yellow-500">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Analysis Delay</span>
                        </div>
                        <p className="text-xs text-secondary-text">The AI service is taking longer than expected. The provider may be under heavy load.</p>
                        <div className="flex gap-2 w-full">
                           <button onClick={() => setIsTimeout(false)} className="flex-1 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-[10px] font-bold text-yellow-500 hover:bg-yellow-500/20 transition-all uppercase tracking-tighter">Continue Waiting</button>
                           <button onClick={cancelAnalysis} className="flex-1 py-2 bg-surface border border-border rounded-lg text-[10px] font-bold text-secondary-text hover:text-accent transition-all uppercase tracking-tighter">Analyze Another</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Cancel Button */}
                  <button
                    onClick={cancelAnalysis}
                    className="w-full flex items-center justify-center space-x-2 text-secondary-text/40 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest py-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Analysis</span>
                  </button>
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
