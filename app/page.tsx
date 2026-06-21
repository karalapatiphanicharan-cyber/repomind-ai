'use client';

import { Code2, ShieldAlert, FileText, Lightbulb } from 'lucide-react';
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
    // We clear the result but keep the trigger to tell UploadCard to try again with its existing state
    setAnalysisResult(null);
    setRetryTrigger(prev => prev + 1);
  };

  const features = [
    {
      title: "Code Analysis",
      description: "Deep structural understanding of your project.",
      items: ["Understand project architecture", "Detect frameworks and languages"],
      icon: Code2
    },
    {
      title: "Security Review",
      description: "Keep your codebase safe and secure.",
      items: ["Find secrets", "Identify risky patterns"],
      icon: ShieldAlert
    },
    {
      title: "Documentation Review",
      description: "Improve maintainability with better docs.",
      items: ["Evaluate README quality", "Suggest improvements"],
      icon: FileText
    },
    {
      title: "Action Plan",
      description: "Concrete steps to improve your code.",
      items: ["Prioritized engineering recommendations"],
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Hero />

        <section id="analyze" className="pb-24 sm:pb-32">
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

        <section className="py-24 sm:py-32 bg-background border-t border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-text mb-4">Powerful Analysis Features</h2>
              <p className="text-secondary-text max-w-2xl mx-auto">Advanced AI agents specialized in different aspects of your codebase.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
