import Link from 'next/link';
import { GitBranch } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-text tracking-tight">
              RepoMind <span className="text-accent">AI</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-surface border border-border text-secondary-text hover:text-primary-text hover:border-accent transition-colors">
              <GitBranch size={18} />
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
