'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Link as LinkIcon, CheckCircle2, Search, Zap, Code2, ShieldCheck, FileJson, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisSummary } from '@/types/analysis';

const LOADING_STAGES = [
  { id: 'prepare', label: 'Reading repository', icon: Search },
  { id: 'extract', label: 'Extracting files', icon: FileJson },
  { id: 'detect', label: 'Detecting languages', icon: Code2 },
  { id: 'agents', label: 'Running AI agents', icon: Zap },
  { id: 'report', label: 'Building report', icon: ShieldCheck }
];

export default function UploadCard({ onAnalyze }: { onAnalyze: (data: AnalysisSummary) => void }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const zipInputRef = useRef<HTMLInputElement>(null);
  const githubInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading && currentStage < LOADING_STAGES.length - 1) {
      interval = setInterval(() => {
        setCurrentStage(prev => Math.min(prev + 1, LOADING_STAGES.length - 1));
      }, 2500); // Simulate progress through stages
    }
    return () => clearInterval(interval);
  }, [isLoading, currentStage]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      await uploadZip(file);
    }
  };

  const uploadZip = async (file: File) => {
    setIsLoading(true);
    setCurrentStage(0);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to upload ZIP');

      onAnalyze(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during ZIP upload');
      }
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeGithub = async () => {
    if (!githubUrl) return;
    setIsLoading(true);
    setCurrentStage(0);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: githubUrl }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to analyze repository');

      onAnalyze(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during GitHub analysis');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              } ${isLoading ? 'pointer-events-none' : ''}`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-6 text-center">
                {!isLoading ? (
                  <>
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
                  </>
                ) : (
                  <div className="w-full max-w-sm space-y-8">
                     <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16 mb-6">
                           <div className="absolute inset-0 border-2 border-accent/20 rounded-full"></div>
                           <div className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                              {(() => {
                                 const Icon = LOADING_STAGES[currentStage].icon;
                                 return <Icon className="w-6 h-6 text-accent" />;
                              })()}
                           </div>
                        </div>
                        <h3 className="text-xl font-bold text-primary-text mb-2">Analyzing Project</h3>
                        <p className="text-sm text-secondary-text">This may take a minute for large repositories.</p>
                     </div>

                     <div className="space-y-3">
                        {LOADING_STAGES.map((stage, idx) => (
                           <div key={stage.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                 {idx < currentStage ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                 ) : idx === currentStage ? (
                                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                 ) : (
                                    <div className="w-4 h-4 rounded-full border border-border/60" />
                                 )}
                                 <span className={`text-xs font-medium ${idx === currentStage ? 'text-primary-text' : 'text-secondary-text/60'}`}>
                                    {stage.label}
                                 </span>
                              </div>
                              {idx < currentStage && <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Done</span>}
                           </div>
                        ))}
                     </div>
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
                className="block w-full h-14 pl-12 pr-4 bg-background/50 border border-border/60 rounded-xl text-primary-text text-sm placeholder:text-secondary-text/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 disabled:opacity-50"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                }}
                aria-label="GitHub Repository URL"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={analyzeGithub}
              disabled={isLoading || !githubUrl}
              className="w-full h-14 rounded-xl bg-accent text-white font-bold hover:bg-blue-600 hover:scale-[1.01] transition-all duration-300 shadow-lg shadow-accent/20 flex items-center justify-center active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Agent Analysis in Progress...</span>
                </div>
              ) : (
                'Analyze Repository'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
