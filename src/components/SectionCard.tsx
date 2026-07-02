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
    <section className={`premium-card p-6 sm:p-8 lg:p-10 relative ${accentStyle}`}>
      {/* Barre d'accent latérale */}
      <div
        className={`absolute left-0 top-[25%] bottom-[25%] w-[2px] rounded-r-full opacity-70 ${barColor}`}
        aria-hidden="true"
      />
      <header className="mb-5 sm:mb-6 relative z-10 pl-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {icon && (
            <div className="p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm text-brand-600 border border-white/50">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl sm:text-[1.6rem] font-bold font-display text-slate-900 tracking-tight leading-snug">{title}</h2>
            {description && (
              <p className="mt-1 text-sm sm:text-base text-slate-500 font-medium">{description}</p>
            )}
          </div>
        </div>
      </header>
      <div className="relative z-10 pl-5">{children}</div>
    </section>
  );
}
