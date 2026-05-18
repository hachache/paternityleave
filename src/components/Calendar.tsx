import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getFrenchHolidays, isFrenchHoliday, isWeekend } from '../utils/holidays';
import {
  LeaveBlock,
  LeaveScenarioConfig,
  getLimitDate,
  isDateInBlock,
  isDateInRange
} from '../utils/paternityLeave';

type DayType = 'birth' | 'employer' | 'mandatory' | 'remaining' | 'supplementary' | null;
type DayAction = 'select' | 'remove' | 'static';

interface DayMetadata {
  type: DayType;
  selectable: boolean;
  reason?: string;
  action: DayAction;
}

interface CalendarProps {
  birthDate: Date | null;
  onSelectBirthDate: (date: Date) => void;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  supplementaryPeriod: LeaveBlock | null;
  onSelectRemainingDay: (date: Date) => void;
  onRemoveBlock: (index: number) => void;
  scenario: LeaveScenarioConfig;
}

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function Calendar({
  birthDate,
  onSelectBirthDate,
  employerPeriod,
  mandatoryPeriod,
  remainingBlocks,
  supplementaryPeriod,
  onSelectRemainingDay,
  onRemoveBlock,
  scenario
}: CalendarProps) {
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [focusedDate, setFocusedDate] = useState<Date>(() => startOfDay(new Date()));
  const dayRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const today = useMemo(() => startOfDay(new Date()), []);

  const monthStart = currentMonth;
  const monthEnd = useMemo(() => endOfMonth(currentMonth), [currentMonth]);
  const calendarStart = useMemo(() => startOfWeek(monthStart, { locale: fr }), [monthStart]);
  const calendarEnd = useMemo(() => endOfWeek(monthEnd, { locale: fr }), [monthEnd]);

  const endTimestamp = calendarEnd.getTime();

  const days = useMemo(() => {
    const result: Date[] = [];
    let cursor = calendarStart;
    while (cursor.getTime() <= endTimestamp) {
      result.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return result;
  }, [calendarStart, endTimestamp]);

  const dayKeyMap = useMemo(() => {
    const m = new Map<number, Date>();
    for (const d of days) {
      const key = startOfDay(d).getTime();
      m.set(key, startOfDay(d));
    }
    return m;
  }, [days]);

  const holidays = useMemo(() => {
    const years = Array.from(new Set(days.map(date => date.getFullYear())));
    return years.flatMap(year => getFrenchHolidays(year));
  }, [days]);

  const usageLimit = useMemo(
    () => (birthDate ? getLimitDate(birthDate, scenario.limitMonthsAfterBirth) : null),
    [birthDate, scenario]
  );

  const registerDayRef = useCallback(
    (timestamp: number) => (node: HTMLButtonElement | null) => {
      if (node) {
        dayRefs.current[timestamp] = node;
      } else {
        delete dayRefs.current[timestamp];
      }
    },
    []
  );

  useEffect(() => {
    if (!birthDate) {
      return;
    }
    const normalized = startOfDay(birthDate);
    setCurrentMonth(startOfMonth(normalized));
    setFocusedDate(normalized);
  }, [birthDate]);

  useEffect(() => {
    if (isCoarsePointer) return;
    const key = startOfDay(focusedDate).getTime();
    const target = dayRefs.current[key];
    if (target && document.activeElement !== target) {
      try {
        target.focus({ preventScroll: true } as FocusOptions);
      } catch {
        target.focus();
      }
    }
  }, [focusedDate, currentMonth, isCoarsePointer]);

  const getDayType = useCallback(
    (date: Date): DayType => {
      if (!birthDate) return null;
      if (isSameDay(date, birthDate)) return 'birth';
      if (employerPeriod && isDateInBlock(date, employerPeriod)) return 'employer';
      if (mandatoryPeriod && isDateInBlock(date, mandatoryPeriod)) return 'mandatory';
      for (const block of remainingBlocks) {
        if (isDateInBlock(date, block)) return 'remaining';
      }
      if (supplementaryPeriod && isDateInBlock(date, supplementaryPeriod)) return 'supplementary';
      return null;
    },
    [birthDate, employerPeriod, mandatoryPeriod, remainingBlocks, supplementaryPeriod]
  );

  const describeDay = useCallback(
    (rawDate: Date): DayMetadata => {
      const date = startOfDay(rawDate);
      const type = getDayType(date);

      if (!birthDate) {
        if (isBefore(date, today)) {
          return {
            type,
            selectable: false,
            reason: "La date de naissance ne peut pas être antérieure à aujourd'hui",
            action: 'static'
          };
        }
        return { type, selectable: true, action: 'select' };
      }

      if (type === 'birth') return { type, selectable: false, reason: "Date de naissance", action: 'static' };
      if (type === 'employer') return { type, selectable: false, reason: 'Période employeur', action: 'static' };
      if (type === 'mandatory') return { type, selectable: false, reason: 'Période obligatoire', action: 'static' };
      if (type === 'remaining') return { type, selectable: true, reason: 'Bloc planifié', action: 'remove' };
      if (type === 'supplementary') return { type, selectable: false, reason: 'Congé supplémentaire 2026', action: 'static' };

      if (isBefore(date, birthDate)) {
        return { type: null, selectable: false, reason: 'Disponible uniquement après la naissance', action: 'static' };
      }

      if (usageLimit && isAfter(date, usageLimit)) {
        return { type: null, selectable: false, reason: `Au-delà de la limite`, action: 'static' };
      }

      return { type: null, selectable: true, action: 'select' };
    },
    [birthDate, getDayType, scenario.limitMonthsAfterBirth, usageLimit, today]
  );

  const focusDate = useCallback(
    (date: Date) => {
      const normalized = startOfDay(date);
      setFocusedDate(normalized);
      if (!isSameMonth(normalized, currentMonth)) {
        setCurrentMonth(startOfMonth(normalized));
      }
    },
    [currentMonth]
  );

  const moveFocusBy = useCallback(
    (offset: number) => {
      setFocusedDate(prev => {
        const reference = prev ?? startOfMonth(currentMonth);
        const next = startOfDay(addDays(reference, offset));
        if (!isSameMonth(next, currentMonth)) {
          setCurrentMonth(startOfMonth(next));
        }
        return next;
      });
    },
    [currentMonth]
  );

  const goToMonth = useCallback(
    (offset: number) => {
      const target = startOfMonth(addMonths(currentMonth, offset));
      setCurrentMonth(target);
      setFocusedDate(prev => {
        if (prev && isSameMonth(prev, target)) return startOfDay(prev);
        return target;
      });
    },
    [currentMonth]
  );

  const previousMonth = () => goToMonth(-1);
  const nextMonth = () => goToMonth(1);

  const handleDayInteraction = useCallback(
    (date: Date, metadata?: DayMetadata) => {
      const detail = metadata ?? describeDay(date);
      if (!birthDate) {
        if (detail.selectable) onSelectBirthDate(date);
        return;
      }
      if (detail.action === 'static') return;
      if (detail.action === 'remove') {
        const blockIndex = remainingBlocks.findIndex(block =>
          isDateInRange(date, block.start, block.end)
        );
        if (blockIndex !== -1) onRemoveBlock(blockIndex);
        return;
      }
      if (!detail.selectable) return;
      onSelectRemainingDay(date);
    },
    [birthDate, describeDay, onRemoveBlock, onSelectBirthDate, onSelectRemainingDay, remainingBlocks]
  );

  const metadataByKey = useMemo(() => {
    const m = new Map<number, DayMetadata>();
    for (const d of days) {
      const key = startOfDay(d).getTime();
      m.set(key, describeDay(d));
    }
    return m;
  }, [days, describeDay]);

  const handleGridClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = (event.target as HTMLElement).closest('button[data-date]') as HTMLButtonElement | null;
      if (!target) return;
      const ts = Number(target.getAttribute('data-date'));
      if (!ts || Number.isNaN(ts)) return;
      const date = dayKeyMap.get(ts);
      if (!date) return;
      const meta = metadataByKey.get(ts);
      handleDayInteraction(date, meta);
    },
    [dayKeyMap, metadataByKey, handleDayInteraction]
  );

  const handleGridKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!focusedDate) return;
      switch (event.key) {
        case 'ArrowUp': event.preventDefault(); moveFocusBy(-7); break;
        case 'ArrowDown': event.preventDefault(); moveFocusBy(7); break;
        case 'ArrowLeft': event.preventDefault(); moveFocusBy(-1); break;
        case 'ArrowRight': event.preventDefault(); moveFocusBy(1); break;
        case 'Home': event.preventDefault(); focusDate(startOfWeek(focusedDate, { locale: fr })); break;
        case 'End': event.preventDefault(); focusDate(endOfWeek(focusedDate, { locale: fr })); break;
        case 'PageUp': event.preventDefault(); focusDate(addMonths(focusedDate, event.shiftKey ? -12 : -1)); break;
        case 'PageDown': event.preventDefault(); focusDate(addMonths(focusedDate, event.shiftKey ? 12 : 1)); break;
        case 'Enter': case ' ': event.preventDefault(); handleDayInteraction(focusedDate); break;
        default: break;
      }
    },
    [focusDate, focusedDate, handleDayInteraction, moveFocusBy]
  );

  const handleCellFocus = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      if (isCoarsePointer) return;
      const ts = Number((event.currentTarget as HTMLButtonElement).getAttribute('data-date'));
      if (!ts || Number.isNaN(ts)) return;
      const date = dayKeyMap.get(ts);
      if (date) setFocusedDate(date);
    },
    [isCoarsePointer, dayKeyMap]
  );

  const getDayClasses = useCallback(
    (date: Date, metadata: DayMetadata) => {
      const isCurrentMonthDay = isSameMonth(date, currentMonth);
      const holiday = isFrenchHoliday(date, holidays);
      const weekend = isWeekend(date);

      let classes = 'relative aspect-square flex flex-col items-center justify-center text-sm sm:text-base rounded-xl font-medium min-h-[2.5rem] sm:min-h-[3rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)] border border-transparent transition-all duration-200 touch-manipulation active:scale-90 ';

      if (!isCurrentMonthDay) {
        // Make non-current month days much fainter
        classes += ' text-[var(--muted-2)] opacity-20';
      }

      const hasLeaveType = ['birth', 'employer', 'mandatory', 'remaining', 'supplementary'].includes(metadata.type || '');

      if (metadata.type === 'birth') {
        classes += ' bg-white text-[var(--ink)] font-bold shadow-lg shadow-white/10 ring-2 ring-white/70 ring-offset-2 ring-offset-surface-100';
      } else if (metadata.type === 'employer') {
        classes += ' bg-brand-500 text-white shadow-sm';
      } else if (metadata.type === 'mandatory') {
        classes += ' bg-brand-600 text-white shadow-md shadow-brand-600/30';
      } else if (metadata.type === 'remaining') {
        classes += ' bg-success-500 text-white cursor-pointer hover:bg-success-600 hover:-translate-y-0.5 shadow-md shadow-success-500/30';
      } else if (metadata.type === 'supplementary') {
        classes += ' bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/30';
      } else if (metadata.selectable && isCurrentMonthDay) {
        classes += ' cursor-pointer text-[var(--text)] hover:bg-brand-50/40 hover:text-brand-700 active:scale-95';
      } else {
        classes += ' cursor-not-allowed';
        if (isCurrentMonthDay) classes += ' opacity-35';
      }

      if (!hasLeaveType && (weekend || holiday) && isCurrentMonthDay) classes += ' bg-white/5 text-[var(--muted)]';

      return classes;
    },
    [currentMonth, holidays]
  );

  return (
    <div className="rounded-[2rem] border border-white/10 bg-surface-100/90 backdrop-blur-xl p-6 sm:p-8 shadow-soft relative">
      {!birthDate && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 hidden sm:block animate-bounce-subtle">
           <div className="relative bg-surface-50 px-4 py-2 rounded-full shadow-lg border border-brand-400/25 text-brand-700 font-hand text-base font-bold rotate-[-2deg]">
             Commencez ici ! 👇
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface-50 border-b border-r border-brand-400/25 transform rotate-45"></div>
           </div>
        </div>
      )}

      {!birthDate && (
        <div className="mb-6 rounded-2xl bg-brand-50/35 p-5 border border-brand-400/30 animate-fade-in-up">
          <p className="text-brand-700 text-center font-medium flex items-center justify-center gap-2">
            <span className="text-xl">👶</span>
            Sélectionnez la date de naissance pour commencer
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={previousMonth}
          className="p-2.5 rounded-xl text-[var(--muted)] hover:bg-white/10 hover:text-[var(--text)] transition-all active:scale-95"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text)] capitalize tracking-tight">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>

        <button
          type="button"
          onClick={nextMonth}
          className="p-2.5 rounded-xl text-[var(--muted)] hover:bg-white/10 hover:text-[var(--text)] transition-all active:scale-95"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs uppercase tracking-wider font-bold text-[var(--muted-2)] py-2">
            {day}
          </div>
        ))}
      </div>

      <div
        role="grid"
        className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3"
        onKeyDown={handleGridKeyDown}
        onClick={handleGridClick}
      >
        {days.map(day => {
          const dayStart = startOfDay(day);
          const dayKey = dayStart.getTime();
          const metadata = metadataByKey.get(dayKey) ?? { type: null, selectable: true, action: 'select' };
          const isFocused = dayKey === startOfDay(focusedDate).getTime();
          const isTodayDate = isSameDay(dayStart, today);
          
          return (
            <button
              key={dayKey}
              ref={registerDayRef(dayKey)}
              type="button"
              data-date={dayKey}
              className={getDayClasses(dayStart, metadata)}
              tabIndex={isFocused ? 0 : -1}
              title={metadata.reason}
              onFocus={handleCellFocus}
            >
              {dayStart.getDate()}
              {isTodayDate && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-brand-700"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
