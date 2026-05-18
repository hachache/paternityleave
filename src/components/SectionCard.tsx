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
    <section className={`premium-card p-6 sm:p-8 ${accentStyle}`}>
      <header className="mb-6 relative z-10">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm text-brand-600 border border-white/50">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">{title}</h2>
            {description && <p className="mt-1.5 text-base text-slate-500 font-medium leading-relaxed">{description}</p>}
          </div>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
      
      {/* Background decoration (subtle mesh gradient inside card) */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-brand-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
