const baseLegendItems = [
  { label: 'Date de naissance', color: 'bg-white shadow-sm' },
  { label: 'Congé de naissance (3j)', color: 'bg-brand-500' },
  { label: 'Période obligatoire (4j)', color: 'bg-brand-600 shadow-sm' },
  { label: 'Jours à planifier', color: 'bg-success-500 shadow-sm' }
] as const;

interface CalendarLegendProps {
  showSupplementary?: boolean;
}

export function CalendarLegend({ showSupplementary = false }: CalendarLegendProps) {
  const legendItems = showSupplementary
    ? [...baseLegendItems, { label: 'Congé supplémentaire (2026)', color: 'bg-[#0071e3] shadow-sm' }]
    : baseLegendItems;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {legendItems.map(item => (
        <div key={item.label} className="flex items-center gap-2.5 group">
          <span
            className={`inline-flex h-3 w-3 rounded-full ring-2 ring-white ${item.color}`}
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm font-medium text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
