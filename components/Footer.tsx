import { Brain } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 relative z-10 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center space-x-3 mb-8 group">
            <Brain className="w-10 h-10 text-accent group-hover:scale-110 transition-transform duration-500" />
            <span className="text-3xl font-black text-primary-text tracking-tighter">
              RepoMind <span className="text-accent">AI</span>
            </span>
          </div>

          <p className="text-secondary-text text-lg mb-10 max-w-xl leading-relaxed">
            Revolutionizing repository analysis through specialized multi-agent AI collaboration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-secondary-text/50 text-sm font-semibold mb-16 uppercase tracking-[0.1em]">
            <span className="hover:text-accent transition-colors cursor-default">Multi-Agent Architecture</span>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <span className="hover:text-accent transition-colors cursor-default">Privacy First</span>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <span className="hover:text-accent transition-colors cursor-default">Cloud Native</span>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent mb-12" />

          <p className="text-secondary-text/30 text-[10px] font-bold uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} RepoMind AI • Engineered for Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
