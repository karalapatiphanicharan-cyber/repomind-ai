import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
}

export default function FeatureCard({ title, description, items, icon: Icon }: FeatureCardProps) {
  return (
    <div
      className="bg-surface border border-border rounded-2xl p-8 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      tabIndex={0}
    >
      <div className="w-16 h-16 rounded-xl bg-accent/5 flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:scale-110 transition-all duration-300">
        <Icon className="text-accent w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold text-primary-text mb-3">{title}</h3>
      <p className="text-secondary-text text-sm mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start text-sm text-secondary-text font-medium">
            <span className="mr-3 text-accent flex-shrink-0 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
