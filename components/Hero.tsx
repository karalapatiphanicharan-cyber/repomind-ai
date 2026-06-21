'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative pt-32 pb-16 sm:pt-48 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl font-extrabold text-primary-text tracking-tight mb-6"
        >
          Analyze Any Codebase with <span className="text-accent">AI Agents</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-secondary-text mb-10"
        >
          Upload a ZIP file or provide a public GitHub repository URL and receive an intelligent engineering report powered by specialized AI agents.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-accent text-white font-medium hover:bg-blue-600 transition-colors">
            Upload ZIP
          </button>
          <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-surface border border-border text-primary-text font-medium hover:border-accent transition-colors">
            Analyze GitHub Repository
          </button>
        </motion.div>
      </div>
    </div>
  );
}
