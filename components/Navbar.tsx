import Link from 'next/link';
import { Brain, GitBranch } from 'lucide-react';

export default function Navbar({ onViewDemo }: { onViewDemo?: () => void }) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <Brain className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold text-primary-text tracking-tight">
                RepoMind <span className="text-accent">AI</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {onViewDemo && (
              <button
                onClick={onViewDemo}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg text-accent hover:bg-accent/5 transition-all duration-300 font-bold text-sm cursor-pointer"
              >
                <span>✨ View Demo</span>
              </button>
            )}
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-surface border border-border text-secondary-text hover:text-primary-text hover:border-accent hover:bg-surface/50 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <GitBranch size={18} />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
