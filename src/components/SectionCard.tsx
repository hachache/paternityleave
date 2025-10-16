interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: 'teal' | 'slate';
}

const accentClasses: Record<NonNullable<SectionCardProps['accent']>, string> = {
  teal: 'border-teal-200 bg-teal-50/60',
  slate: 'border-slate-200 bg-white'
};

export function SectionCard({ title, description, children, accent = 'slate' }: SectionCardProps) {
  return (
    <section className={`rounded-3xl border p-6 sm:p-7 shadow-lg transition-apple-smooth ${accentClasses[accent]}`}>
      <header className="mb-5">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </header>
      <div>{children}</div>
    </section>
  );
}
