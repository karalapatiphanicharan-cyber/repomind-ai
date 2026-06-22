'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ScrollHint() {
  const scrollToAnalyze = () => {
    const element = document.getElementById('analyze');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
      onClick={scrollToAnalyze}
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-secondary-text mb-2 group-hover:text-accent transition-colors duration-300">
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 text-secondary-text group-hover:text-accent transition-colors duration-300" />
      </motion.div>
    </motion.div>
  );
}
