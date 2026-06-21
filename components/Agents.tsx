'use client';

import { motion } from 'framer-motion';
import { Cpu, Code, Shield, FileText, LayoutList } from 'lucide-react';

export default function Agents() {
  const agents = [
    {
      title: "Orchestrator Agent",
      description: "Coordinates the complete analysis workflow between specialized agents.",
      icon: Cpu
    },
    {
      title: "Code Analysis Agent",
      description: "Understands architecture, languages, frameworks, and code quality.",
      icon: Code
    },
    {
      title: "Security Review Agent",
      description: "Detects secrets, risky patterns, and critical security concerns.",
      icon: Shield
    },
    {
      title: "Documentation Agent",
      description: "Evaluates README quality and overall documentation coverage.",
      icon: FileText
    },
    {
      title: "Planner Agent",
      description: "Creates prioritized engineering recommendations and roadmaps.",
      icon: LayoutList
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-text mb-4">Meet the AI Agents</h2>
          <p className="text-secondary-text max-w-2xl mx-auto">Our specialized multi-agent architecture ensures deep expertise in every aspect of your code.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-surface border border-border/60 rounded-2xl p-8 hover:border-accent/40 transition-all duration-300 group w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[300px] h-full"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/5 flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:scale-110 transition-all duration-300">
                <agent.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">{agent.title}</h3>
              <p className="text-secondary-text text-sm leading-relaxed">{agent.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
