'use client';

import { Code2, ShieldAlert, FileText, Lightbulb, Github, FileArchive } from 'lucide-react';
import { useState, useRef } from 'react';
import { AnalysisSummary } from '@/types/analysis';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import UploadCard from '@/components/UploadCard';
import SummaryCard from '@/components/SummaryCard';
import HowItWorks from '@/components/HowItWorks';
import Agents from '@/components/Agents';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import BackgroundEffects from '@/components/BackgroundEffects';
import CursorGlow from '@/components/CursorGlow';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisSummary | null>(null);
  const [analysisDuration, setAnalysisDuration] = useState<number | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  const handleAnalyzeComplete = (data: AnalysisSummary) => {
    if (startTimeRef.current) {
      setAnalysisDuration((Date.now() - startTimeRef.current) / 1000);
    }
    setAnalysisResult(data);
  };

  const handleStartAnalysis = () => {
    startTimeRef.current = Date.now();
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setAnalysisDuration(null);
    startTimeRef.current = null;
    setRetryTrigger(0);
  };

  const handleRetry = () => {
    setAnalysisResult(null);
    setRetryTrigger(prev => prev + 1);
  };

  const features = [
    {
      title: "Multi-Agent Analysis",
      description: "Collaborative AI agents work together to understand your code.",
      items: ["Specialized expertise for every domain", "Cross-agent consensus for high accuracy"],
      icon: Code2
    },
    {
      title: "Security Review",
      description: "Identify vulnerabilities before they become problems.",
      items: ["Secret detection", "Risk assessment of dependencies"],
      icon: ShieldAlert
    },
    {
      title: "Documentation Intel",
      description: "Deep insights into your project's documentation quality.",
      items: ["README effectiveness", "Architecture clarity analysis"],
      icon: FileText
    },
    {
      title: "Action Plan",
      description: "Concrete engineering steps to improve your codebase.",
      items: ["Prioritized recommendations", "Estimated impact of changes"],
      icon: Lightbulb
    },
    {
      title: "GitHub Support",
      description: "Seamlessly analyze any public repository.",
      items: ["Instant cloning and scanning", "Historical context awareness"],
      icon: Github
    },
    {
      title: "ZIP Upload",
      description: "Local-first analysis for your private work.",
      items: ["Secure temporary processing", "Supports standard project structures"],
      icon: FileArchive
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundEffects />
      <CursorGlow />

      <Navbar />

      <main className="flex-grow">
        <Hero />

        <section id="analyze" className="pb-24 sm:pb-32 relative z-10">
          <div className="max-w-5xl mx-auto px-4">
            <AnimatePresence mode="wait">
              {!analysisResult ? (
                <motion.div
                  key={`upload-${retryTrigger}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <UploadCard
                    onAnalyze={handleAnalyzeComplete}
                    onStart={handleStartAnalysis}
                    autoRetry={retryTrigger > 0}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                >
                  <SummaryCard
                    summary={analysisResult}
                    duration={analysisDuration}
                    onReset={handleReset}
                    onRetry={handleRetry}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <HowItWorks />

        <Agents />

        <section className="py-24 sm:py-32 relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-extrabold text-primary-text mb-4"
              >
                Powerful Analysis Features
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-secondary-text max-w-2xl mx-auto"
              >
                Advanced AI agents specialized in different aspects of your codebase, providing deep engineering insights.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
