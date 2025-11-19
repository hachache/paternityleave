interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: 'brand' | 'slate';
  icon?: React.ReactNode;
}

const accentClasses: Record<NonNullable<SectionCardProps['accent']>, string> = {
  brand: 'border-brand-100/50 from-white to-brand-50/30',
  slate: 'border-slate-100 from-white to-slate-50/30'
};

export function SectionCard({ title, description, children, accent = 'slate', icon }: SectionCardProps) {
  return (
    <section className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 sm:p-8 shadow-soft transition-all duration-500 hover:shadow-lg ${accentClasses[accent]}`}>
      <header className="mb-6 relative z-10">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="p-3 bg-white rounded-xl shadow-sm text-brand-600 border border-slate-100">
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
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-current to-transparent opacity-[0.03] rounded-full blur-3xl pointer-events-none text-brand-500" />
    </section>
  );
}
