'use client';

import { motion } from 'framer-motion';
import { Upload, Search, Code2, ShieldCheck, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      title: "Step 1",
      subtitle: "Upload",
      description: "Provide your codebase via a direct ZIP upload or a public repository link.",
      icon: Upload
    },
    {
      title: "Step 2",
      subtitle: "Repository Processing",
      description: "Our orchestrator scans the structure and prepares it for deep analysis.",
      icon: Search
    },
    {
      title: "Step 3",
      subtitle: "Language Detection",
      description: "We identify programming languages and project framework patterns.",
      icon: Code2
    },
    {
      title: "Step 4",
      subtitle: "AI Agent Collaboration",
      description: "Agents specialized in Security, Code Quality, and Docs process the code.",
      icon: ShieldCheck
    },
    {
      title: "Step 5",
      subtitle: "Engineering Report",
      description: "Receive a comprehensive report with prioritized engineering insights.",
      icon: FileSpreadsheet
    }
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-primary-text mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-secondary-text max-w-2xl mx-auto"
          >
            From raw code to intelligent insights in five simple steps.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group bg-surface/50 backdrop-blur-sm border border-border/60 rounded-2xl p-8 h-full hover:border-accent/40 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-6 relative z-10 group-hover:bg-accent/10 transition-all duration-300 border border-accent/10 group-hover:scale-110">
                  <step.icon className="w-7 h-7 text-accent" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold text-accent shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-accent font-bold text-[10px] uppercase tracking-[0.2em] mb-3 group-hover:tracking-[0.25em] transition-all duration-300">
                  {step.title}
                </h3>
                <h4 className="text-primary-text font-bold text-lg mb-4 leading-tight">
                  {step.subtitle}
                </h4>
                <p className="text-secondary-text text-sm leading-relaxed">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="mt-6 lg:hidden">
                    <ArrowRight className="w-5 h-5 text-border rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
