interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: 'brand' | 'slate';
  icon?: React.ReactNode;
}

export function SectionCard({ title, description, children, accent = 'slate', icon }: SectionCardProps) {
  const accentStyle = accent === 'brand'
    ? 'shadow-brand-500/10 border-brand-100/50'
    : 'shadow-slate-200/50 border-white/60';

  const barColor = accent === 'brand' ? 'bg-gradient-to-b from-brand-500 to-brand-400' : 'bg-gradient-to-b from-slate-300 to-slate-200';

  return (
    <section className={`premium-card p-4 sm:p-8 relative ${accentStyle}`}>
      {/* Barre d'accent latérale pour les cartes brand */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full opacity-80 ${barColor}`}
        aria-hidden="true"
      />
      <header className="mb-3 sm:mb-6 relative z-10 pl-3 sm:pl-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {icon && (
            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm text-brand-600 border border-white/50">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-lg sm:text-2xl font-bold font-display text-slate-900 tracking-tight">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm sm:mt-1.5 sm:text-base text-slate-500 font-medium leading-relaxed">{description}</p>
            )}
          </div>
        </div>
      </header>
      <div className="relative z-10 pl-3 sm:pl-4">{children}</div>
    </section>
  );
}
