interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: 'brand' | 'slate';
  icon?: React.ReactNode;
}

export function SectionCard({ title, description, children, accent = 'slate', icon }: SectionCardProps) {
  // On applique des styles conditionnels pour l'accentuation
  const accentStyle = accent === 'brand' 
    ? 'shadow-brand-500/10 border-brand-100/50' 
    : 'shadow-slate-200/50 border-white/60';

  return (
    <section className={`premium-card p-4 sm:p-8 ${accentStyle}`}>
      <header className="mb-3 sm:mb-6 relative z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          {icon && (
            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm text-brand-600 border border-white/50">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-lg sm:text-2xl font-bold font-display text-slate-900 tracking-tight">{title}</h2>
            {description && <p className="mt-0.5 text-sm sm:mt-1.5 sm:text-base text-slate-500 font-medium leading-relaxed">{description}</p>}
          </div>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
