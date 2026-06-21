'use client';

import { motion } from 'framer-motion';
import { Upload, Search, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      title: "Step 1",
      subtitle: "Upload ZIP or Paste GitHub URL",
      description: "Provide your codebase via a direct ZIP upload or a public repository link.",
      icon: Upload
    },
    {
      title: "Step 2",
      subtitle: "RepoMind Orchestrator Reads Project",
      description: "Our core agent scans the structure and prepares it for deep analysis.",
      icon: Search
    },
    {
      title: "Step 3",
      subtitle: "Specialized AI Agents Analyze",
      description: "Agents specialized in Security, Code Quality, and Docs process the code.",
      icon: ShieldCheck
    },
    {
      title: "Step 4",
      subtitle: "Generate Intelligent Report",
      description: "Receive a comprehensive report with prioritized engineering insights.",
      icon: FileSpreadsheet
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-text mb-4">How It Works</h2>
          <p className="text-secondary-text max-w-2xl mx-auto">From raw code to intelligent insights in four simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group bg-surface border border-border/60 rounded-2xl p-8 h-full hover:border-accent/40 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-6 relative z-10 group-hover:bg-accent/10 transition-all duration-300">
                <step.icon className="w-7 h-7 text-accent" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold text-accent">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-accent font-bold text-[10px] uppercase tracking-[0.2em] mb-3">{step.title}</h3>
              <h4 className="text-primary-text font-bold text-lg mb-4 leading-tight">{step.subtitle}</h4>
              <p className="text-secondary-text text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
