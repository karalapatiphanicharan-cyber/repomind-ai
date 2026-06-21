'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

export default function Hero() {
  const trustIndicators = [
    "ZIP Upload",
    "Public GitHub Repositories",
    "Multi-Agent Analysis",
    "Secure Temporary Processing"
  ];

  const scrollToAnalyze = (focusType: 'zip' | 'github') => {
    const element = document.getElementById('analyze');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Dispatch a custom event to trigger focus in UploadCard
      window.dispatchEvent(new CustomEvent('repomind-focus', { detail: { type: focusType } }));
    }
  };

  const handleDemoMode = () => {
    window.dispatchEvent(new CustomEvent('repomind-demo-mode'));
    const element = document.getElementById('analyze');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-32 pb-16 sm:pt-48 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl sm:text-7xl font-extrabold text-primary-text tracking-tight mb-8 leading-[1.1]"
        >
          Analyze Any Codebase with <br className="hidden sm:block" />
          <span className="text-accent">AI Agents</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-xl sm:text-2xl text-secondary-text mb-12 leading-relaxed"
        >
          Upload a ZIP file or provide a public GitHub repository URL and receive an intelligent engineering report powered by specialized AI agents.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
        >
          <button
            onClick={() => scrollToAnalyze('zip')}
            className="w-full sm:w-auto h-14 px-10 rounded-xl bg-accent text-white font-semibold hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background cursor-pointer"
          >
            Upload ZIP
          </button>
          <button
            onClick={() => scrollToAnalyze('github')}
            className="w-full sm:w-auto h-14 px-10 rounded-xl bg-surface border border-border text-primary-text font-semibold hover:border-accent hover:bg-surface/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background cursor-pointer"
          >
            Analyze GitHub Repository
          </button>
          <button
            onClick={handleDemoMode}
            className="w-full sm:w-auto h-14 px-10 rounded-xl bg-surface border border-accent/30 text-accent font-semibold hover:bg-accent/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center group cursor-pointer"
          >
            <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin-slow" />
            ✨ View Demo Report
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4"
        >
          {trustIndicators.map((text, i) => (
            <div key={i} className="flex items-center space-x-2 text-secondary-text/80 text-sm font-medium">
              <Check className="w-4 h-4 text-accent/60" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
