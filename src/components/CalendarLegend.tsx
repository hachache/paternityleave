const legendItems = [
  { label: 'Date de naissance', color: 'bg-slate-900 text-white' },
  { label: 'Période employeur', color: 'bg-sky-600 text-white' },
  { label: 'Période obligatoire', color: 'bg-amber-500 text-white' },
  { label: 'Bloc planifié', color: 'bg-teal-500 text-white' }
] as const;

export function CalendarLegend() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-600">
      {legendItems.map(item => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className={`inline-flex h-3 w-3 rounded-full ${item.color}`}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span className="inline-flex h-3 w-3 rounded-full border border-dashed border-slate-300" aria-hidden="true" />
        <span>Disponible</span>
      </div>
    </div>
  );
}
