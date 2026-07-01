import { LeaveScenarioConfig } from '../utils/paternityLeave';
import { getCalendarLegendItems } from '../utils/calendarLegend';

interface CalendarLegendProps {
  scenario: LeaveScenarioConfig;
}

export function CalendarLegend({ scenario }: CalendarLegendProps) {
  const legendItems = getCalendarLegendItems(scenario);

  return (
    <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-7">
      {legendItems.map(item => (
        <div key={item.label} className="flex items-center gap-2.5 group transition-all duration-200">
          <span
            className={`inline-flex h-3.5 w-3.5 rounded-full ring-2 ring-white shadow-sm ${item.color}`}
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm font-medium text-slate-500 group-hover:text-slate-800 transition-colors duration-200">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
