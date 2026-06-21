import { Code2, ShieldAlert, FileText, Lightbulb } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import UploadCard from '@/components/UploadCard';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';

export default function Home() {
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

        <section id="analyze" className="pb-24">
          <UploadCard />
        </section>

        <section className="py-24 bg-surface/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary-text mb-4">Powerful Analysis Features</h2>
              <p className="text-secondary-text">Advanced AI agents specialized in different aspects of your codebase.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
