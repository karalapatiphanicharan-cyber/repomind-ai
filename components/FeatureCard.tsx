import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
}

export default function FeatureCard({ title, description, items, icon: Icon }: FeatureCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
        <Icon className="text-accent w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-primary-text mb-2">{title}</h3>
      <p className="text-secondary-text text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start text-sm text-secondary-text">
            <span className="mr-2 text-accent">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
