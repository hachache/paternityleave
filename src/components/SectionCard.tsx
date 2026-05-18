interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: 'brand' | 'slate';
  icon?: React.ReactNode;
}

export function SectionCard({ title, description, children, accent = 'slate', icon }: SectionCardProps) {
  const accentStyle = accent === 'brand'
    ? 'border-black/10'
    : 'border-black/10';

  return (
    <section className={`premium-card p-6 sm:p-8 ${accentStyle}`}>
      <header className="mb-6 relative z-10">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="p-3 bg-[#f5f5f7] rounded-xl text-[#1d1d1f] border border-black/10">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">{title}</h2>
            {description && <p className="mt-2 text-base text-[#424245] leading-relaxed max-w-2xl">{description}</p>}
          </div>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
