'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import ScrollHint from './ScrollHint';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 0.45, 0.32, 0.9],
      },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Next-Gen Code Intelligence</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-primary-text tracking-tight leading-[1.05]"
          >
            Analyze Any Codebase <br className="hidden lg:block" />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">AI Agents</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-secondary-text leading-relaxed"
          >
            Upload a ZIP file or provide a public GitHub repository URL and receive an intelligent engineering report powered by specialized AI agents.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button
              onClick={() => scrollToAnalyze('zip')}
              className="group relative w-full sm:w-auto h-14 px-10 rounded-xl bg-accent text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center">
                Upload ZIP
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button
              onClick={() => scrollToAnalyze('github')}
              className="w-full sm:w-auto h-14 px-10 rounded-xl bg-surface/50 backdrop-blur-sm border border-border text-primary-text font-semibold hover:border-accent/50 hover:bg-surface/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background cursor-pointer"
            >
              Analyze GitHub Repository
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4"
          >
            {trustIndicators.map((text, i) => (
              <div key={i} className="flex items-center space-x-2 text-secondary-text/60 text-xs font-medium">
                <Check className="w-3.5 h-3.5 text-accent/60" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <ScrollHint />
    </div>
  );
}
