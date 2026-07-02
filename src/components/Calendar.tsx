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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getFrenchHolidays, isFrenchHoliday, isWeekend } from '../utils/holidays';
import {
  LeaveBlock,
  LeaveScenarioConfig,
  getLimitDate,
  isDateInBlock,
  isDateInRange
} from '../utils/paternityLeave';
import { CalendarDayMetadata, CalendarDayType, buildCalendarDayAriaLabel, getInitialEventDateMetadata } from '../utils/calendarDay';
import { getScenarioVocabulary } from '../utils/scenarioVocabulary';
import { useAppMotion } from '../lib/motion';

interface CalendarProps {
  birthDate: Date | null;
  onSelectBirthDate: (date: Date) => void;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  onSelectRemainingDay: (date: Date) => void;
  onRemoveBlock: (index: number) => void;
  scenario: LeaveScenarioConfig;
}

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const Calendar = memo(function Calendar({
  birthDate,
  onSelectBirthDate,
  employerPeriod,
  mandatoryPeriod,
  remainingBlocks,
  onSelectRemainingDay,
  onRemoveBlock,
  scenario
}: CalendarProps) {
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [focusedDate, setFocusedDate] = useState<Date>(() => startOfDay(new Date()));
  const [pressedDayKey, setPressedDayKey] = useState<number | null>(null);
  const dayRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const pressedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const today = useMemo(() => startOfDay(new Date()), []);
  const vocabulary = useMemo(() => getScenarioVocabulary(scenario), [scenario]);
  const { shouldReduce } = useAppMotion();

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

  const focusFocusedDay = useCallback(() => {
    if (isCoarsePointer) return;
    const key = startOfDay(focusedDate).getTime();
    const target = dayRefs.current[key];
    if (!target || document.activeElement === target) return;

    try {
      target.focus({ preventScroll: true } as FocusOptions);
    } catch {
      target.focus();
    }
  }, [focusedDate, isCoarsePointer]);

  useEffect(() => {
    if (!birthDate) {
      return;
    }
    const normalized = startOfDay(birthDate);
    setCurrentMonth(startOfMonth(normalized));
    setFocusedDate(normalized);
  }, [birthDate]);

  useEffect(() => {
    focusFocusedDay();
  }, [focusFocusedDay, currentMonth]);

  useEffect(() => {
    return () => {
      if (pressedTimerRef.current) {
        clearTimeout(pressedTimerRef.current);
      }
    };
  }, []);

  const getDayType = useCallback(
    (date: Date): CalendarDayType => {
      if (!birthDate) return null;
      if (isSameDay(date, birthDate)) return 'birth';
      if (employerPeriod && isDateInBlock(date, employerPeriod)) return 'employer';
      if (mandatoryPeriod && isDateInBlock(date, mandatoryPeriod)) return 'mandatory';
      for (const block of remainingBlocks) {
        if (isDateInBlock(date, block)) return 'remaining';
      }
      return null;
    },
    [birthDate, employerPeriod, mandatoryPeriod, remainingBlocks]
  );

  const describeDay = useCallback(
    (rawDate: Date): CalendarDayMetadata => {
      const date = startOfDay(rawDate);
      const type = getDayType(date);

      if (!birthDate) {
        return getInitialEventDateMetadata(vocabulary.eventDateActionLabel);
      }

      if (type === 'birth') return { type, selectable: false, reason: vocabulary.eventDateLabel, action: 'static' };
      if (type === 'employer') return { type, selectable: false, reason: 'Période employeur', action: 'static' };
      if (type === 'mandatory') return { type, selectable: false, reason: 'Période obligatoire', action: 'static' };
      if (type === 'remaining') return { type, selectable: true, reason: 'Bloc planifié', action: 'remove' };
      if (employerPeriod && isDateInRange(date, employerPeriod.start, employerPeriod.end)) {
        return { type: null, selectable: false, reason: 'Intervalle du congé employeur', action: 'static' };
      }

      if (isBefore(date, birthDate)) {
        return { type: null, selectable: false, reason: vocabulary.afterEventReason, action: 'static' };
      }

      if (usageLimit && isAfter(date, usageLimit)) {
        return { type: null, selectable: false, reason: 'Au-delà du délai légal', action: 'static' };
      }

      return { type: null, selectable: true, action: 'select' };
    },
    [birthDate, employerPeriod, getDayType, usageLimit, vocabulary]
  );

  const focusDate = useCallback(
    (date: Date) => {
      const normalized = startOfDay(date);
      setFocusedDate(normalized);
      if (!isSameMonth(normalized, currentMonth)) {
        const targetMonth = startOfMonth(normalized);
        setCurrentMonth(targetMonth);
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
          const targetMonth = startOfMonth(next);
          setCurrentMonth(targetMonth);
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
    (date: Date, metadata?: CalendarDayMetadata) => {
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
    const m = new Map<number, CalendarDayMetadata>();
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
      if (meta?.selectable) {
        setPressedDayKey(ts);
        if (pressedTimerRef.current) clearTimeout(pressedTimerRef.current);
        pressedTimerRef.current = setTimeout(() => {
          setPressedDayKey(null);
          pressedTimerRef.current = null;
        }, 180);
      }
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
        case 'Enter':
        case ' ':
          event.preventDefault();
          {
            const key = startOfDay(focusedDate).getTime();
            const meta = describeDay(focusedDate);
            if (meta?.selectable) {
              setPressedDayKey(key);
              if (pressedTimerRef.current) clearTimeout(pressedTimerRef.current);
              pressedTimerRef.current = setTimeout(() => {
                setPressedDayKey(null);
                pressedTimerRef.current = null;
              }, 180);
            }
          }
          handleDayInteraction(focusedDate);
          break;
        default: break;
      }
    },
    [describeDay, focusDate, focusedDate, handleDayInteraction, moveFocusBy]
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
    (date: Date, metadata: CalendarDayMetadata) => {
      const isCurrentMonthDay = isSameMonth(date, currentMonth);
      const holiday = isFrenchHoliday(date, holidays);
      const weekend = isWeekend(date);

      // Classe de base
      let classes = 'relative flex h-11 sm:h-14 lg:h-16 w-full min-w-0 flex-col items-center justify-center text-base sm:text-lg rounded-xl font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 border border-transparent transition-all duration-200 touch-manipulation select-none ';

      if (!isCurrentMonthDay) {
        classes += ' text-surface-300 opacity-30';
      }

      if (metadata.type === 'birth') {
        classes += ' bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/30 ring-2 ring-slate-900 ring-offset-2 scale-[1.02] z-10';
      } else if (metadata.type === 'employer') {
        classes += ' bg-brand-100 text-brand-800 shadow-sm bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(37,99,235,0.12)_2px,rgba(37,99,235,0.12)_4px)] border-brand-200/50';
      } else if (metadata.type === 'mandatory') {
        classes += ' bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/25 border-brand-400/30 ring-2 ring-inset ring-white/20';
      } else if (metadata.type === 'remaining') {
        classes += ' bg-gradient-to-br from-success-500 to-success-600 text-white shadow-md shadow-success-500/25' + (isCoarsePointer ? '' : ' hover:shadow-lg hover:shadow-success-500/30') + ' scale-[1.02] font-semibold hover:scale-[1.06] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:6px_6px]';
      } else if (metadata.selectable && isCurrentMonthDay) {
        classes += ' cursor-pointer text-slate-700' + (isCoarsePointer ? '' : ' hover:bg-brand-50 hover:text-brand-700 hover:shadow-sm hover:border-brand-100 hover:scale-105');
      } else {
        classes += ' cursor-default';
        if (isCurrentMonthDay) classes += ' opacity-35';
      }

      if (!['birth', 'employer', 'mandatory', 'remaining'].includes(metadata.type || '') && (weekend || holiday) && isCurrentMonthDay) {
        classes += ' bg-slate-50 text-slate-500';
      }

      return classes;
    },
    [currentMonth, holidays, isCoarsePointer]
  );

  return (
    <div className="rounded-card border border-surface-200/40 bg-white/90 backdrop-blur-sm p-5 sm:p-8 lg:p-10 shadow-depth-md relative">
      {!birthDate && (
        <div className="reveal-subtle mb-6 sm:mb-8 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-50/50 p-5 sm:p-6 border border-brand-100/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center text-lg shadow-md shadow-brand-500/20">
              📅
            </div>
            <div>
              <p className="text-sm sm:text-base text-brand-900 font-bold font-display">
                Sélectionnez la {vocabulary.eventDateActionLabel} pour commencer
              </p>
              <p className="text-xs sm:text-sm text-brand-600 font-medium mt-1">
                C'est la première étape pour calculer votre planning personnalisé.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation mois */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <button
          type="button"
          onClick={previousMonth}
          className="p-2.5 rounded-xl text-slate-400 hover:bg-brand-50 hover:text-brand-600 hover:shadow-sm transition-all active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>

        <button
          type="button"
          onClick={nextMonth}
          className="p-2.5 rounded-xl text-slate-400 hover:bg-brand-50 hover:text-brand-600 hover:shadow-sm transition-all active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-0.5 min-[380px]:gap-1 sm:gap-2 mb-4 sm:mb-5">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[11px] sm:text-xs uppercase tracking-wider font-bold text-surface-400 py-1 sm:py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div
        key={format(currentMonth, 'yyyy-MM')}
        role="grid"
        className={`grid grid-cols-7 gap-0.5 min-[380px]:gap-1 sm:gap-2 ${shouldReduce ? '' : 'reveal-subtle'}`}
        onAnimationEnd={focusFocusedDay}
        onKeyDown={handleGridKeyDown}
        onClick={handleGridClick}
      >
        {days.map(day => {
          const dayStart = startOfDay(day);
          const dayKey = dayStart.getTime();
          const metadata = metadataByKey.get(dayKey) ?? { type: null, selectable: true, action: 'select' };
          const isFocused = dayKey === startOfDay(focusedDate).getTime();
          const isTodayDate = isSameDay(dayStart, today);
          const ariaLabel = buildCalendarDayAriaLabel(dayStart, metadata, {
            eventDateLabel: vocabulary.eventDateLabel,
            eventDateActionLabel: vocabulary.eventDateActionLabel,
            selectActionLabel: birthDate
              ? 'ajouter une période à partir de cette date'
              : `sélectionner cette date comme ${vocabulary.eventDateActionLabel}`
          });

          const typeLetter =
            metadata.type === 'employer' ? 'E' :
            metadata.type === 'mandatory' ? 'O' :
            metadata.type === 'remaining' ? 'P' :
            metadata.type === 'birth' ? 'N' :
            '';

          return (
            <button
              key={dayKey}
              ref={registerDayRef(dayKey)}
              type="button"
              data-date={dayKey}
              data-day-type={metadata.type || 'none'}
              className={`${getDayClasses(dayStart, metadata)} ${pressedDayKey === dayKey ? 'ring-2 ring-brand-400 ring-offset-1 scale-105' : ''}`}
              tabIndex={isFocused ? 0 : -1}
              title={metadata.reason}
              aria-label={ariaLabel}
              aria-disabled={!metadata.selectable && metadata.action === 'static'}
              aria-current={isTodayDate ? 'date' : undefined}
              onFocus={handleCellFocus}
            >
              <span className="relative z-10">{dayStart.getDate()}</span>
              {typeLetter && (
                <span
                  className="absolute -bottom-[1px] text-[6px] sm:text-[7px] font-bold opacity-60 leading-none select-none tracking-wider uppercase"
                  aria-hidden="true"
                >
                  {typeLetter}
                </span>
              )}
              {isTodayDate && (
                <span className="absolute -bottom-[2px] sm:-bottom-1 w-[3px] h-[3px] sm:w-1 sm:h-1 rounded-full bg-brand-400 shadow-sm shadow-brand-400/50"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
