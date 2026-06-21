export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-2xl font-bold text-primary-text mb-4 tracking-tight">
          RepoMind <span className="text-accent">AI</span>
        </div>
        <p className="text-secondary-text text-base mb-6 max-w-md mx-auto">
          AI-powered repository intelligence for developers.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3 text-secondary-text/60 text-xs font-medium mb-12">
          <span>Built with a multi-agent architecture</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-border"></span>
          <span>Secure by design</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-border"></span>
          <span>Minimalist experience</span>
        </div>
        <p className="text-secondary-text/30 text-[10px] uppercase tracking-widest">
          © {new Date().getFullYear()} RepoMind AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
