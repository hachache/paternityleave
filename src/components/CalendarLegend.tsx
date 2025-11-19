const legendItems = [
  { label: 'Date de naissance', color: 'bg-slate-900 shadow-sm' },
  { label: 'Congé de naissance (3j)', color: 'bg-brand-300' },
  { label: 'Période obligatoire (4j)', color: 'bg-brand-600 shadow-sm' },
  { label: 'Jours à planifier', color: 'bg-success-500 shadow-sm' }
] as const;

export function CalendarLegend() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {legendItems.map(item => (
        <div key={item.label} className="flex items-center gap-2.5 group">
          <span
            className={`inline-flex h-3 w-3 rounded-full ring-2 ring-white ${item.color}`}
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
