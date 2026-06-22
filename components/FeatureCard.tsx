import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
  index: number;
}

export default function FeatureCard({ title, description, items, icon: Icon, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-surface/40 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-500 h-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      tabIndex={0}
    >
      {/* Decorative Border Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-accent/5 flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:scale-110 transition-all duration-500 border border-accent/10">
          <Icon className="text-accent w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-primary-text mb-3 group-hover:text-accent transition-colors duration-300">{title}</h3>
        <p className="text-secondary-text text-sm mb-6 leading-relaxed">{description}</p>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start text-xs text-secondary-text/80 font-medium">
              <span className="mr-3 text-accent flex-shrink-0 mt-1">
                <div className="w-1 h-1 rounded-full bg-accent shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
