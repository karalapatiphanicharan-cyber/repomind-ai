export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-xl font-bold text-primary-text mb-4">
          RepoMind <span className="text-accent">AI</span>
        </div>
        <p className="text-secondary-text text-sm">
          Built for intelligent repository analysis.
        </p>
        <p className="mt-8 text-xs text-secondary-text opacity-50">
          © {new Date().getFullYear()} RepoMind AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
