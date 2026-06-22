'use client';

import Link from 'next/link';
import { Brain, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-lg rounded-full group-hover:bg-accent/40 transition-colors duration-500" />
                <Brain className="relative w-9 h-9 text-accent group-hover:scale-110 transition-transform duration-500 ease-out" />
              </div>
              <span className="text-2xl font-black text-primary-text tracking-tighter">
                RepoMind <span className="text-accent">AI</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="https://github.com" target="_blank" className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-surface/50 border border-border/60 text-secondary-text hover:text-primary-text hover:border-accent/40 hover:bg-surface/80 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group">
              <Github size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-bold tracking-tight">Star on GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
