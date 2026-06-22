'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function SectionScrollHint() {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex justify-center w-full py-12 relative z-10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center cursor-pointer group"
        onClick={scrollToHowItWorks}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-secondary-text mb-2 group-hover:text-accent transition-colors duration-300">
          Explore How AI Agents Work
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-secondary-text group-hover:text-accent transition-colors duration-300" />
        </motion.div>
      </motion.div>
    </div>
  );
}
