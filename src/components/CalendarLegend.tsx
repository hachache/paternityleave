import { LeaveScenarioConfig } from '../utils/paternityLeave';
import { getCalendarLegendItems } from '../utils/calendarLegend';

interface CalendarLegendProps {
  scenario: LeaveScenarioConfig;
}

export function CalendarLegend({ scenario }: CalendarLegendProps) {
  const legendItems = getCalendarLegendItems(scenario);

  return (
    <div className="mx-auto mt-5 mb-4 flex max-w-[680px] flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 sm:mt-6 sm:mb-5 sm:gap-x-6 sm:px-0">
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
