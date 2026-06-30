interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: 'brand' | 'slate';
  icon?: React.ReactNode;
}

export function SectionCard({ title, description, children, accent = 'slate', icon }: SectionCardProps) {
  const accentStyle = accent === 'brand'
    ? 'border-slate-200'
    : 'border-slate-200';

  return (
    <section className={`premium-card p-4 sm:p-5 ${accentStyle}`}>
      <header className="relative z-10 mb-3 sm:mb-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {icon && (
            <div className="rounded-lg border border-slate-200 bg-[#fafafc] p-3 text-brand-600">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-[17px] font-semibold leading-tight tracking-[-0.022em] text-[#1d1d1f] sm:text-xl">{title}</h2>
            {description && <p className="mt-1 text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-slate-500 sm:text-sm">{description}</p>}
          </div>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
