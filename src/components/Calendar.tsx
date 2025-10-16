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
import { getFrenchHolidays, isFrenchHoliday, isWeekend } from '../utils/holidays';
import { LeaveBlock, getSixMonthsLimit, isDateInBlock, isDateInRange } from '../utils/paternityLeave';

type DayType = 'birth' | 'employer' | 'mandatory' | 'remaining' | null;
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
  onSelectRemainingDay: (date: Date) => void;
  onRemoveBlock: (index: number) => void;
}

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function Calendar({
  birthDate,
  onSelectBirthDate,
  employerPeriod,
  mandatoryPeriod,
  remainingBlocks,
  onSelectRemainingDay,
  onRemoveBlock
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [focusedDate, setFocusedDate] = useState<Date>(() => startOfDay(new Date()));
  const dayRefs = useRef<Record<number, HTMLButtonElement | null>>({});

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

  const holidays = useMemo(() => {
    const years = Array.from(new Set(days.map(date => date.getFullYear())));
    return years.flatMap(year => getFrenchHolidays(year));
  }, [days]);

  const sixMonthsLimit = useMemo(
    () => (birthDate ? getSixMonthsLimit(birthDate) : null),
    [birthDate]
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
    const key = startOfDay(focusedDate).getTime();
    const target = dayRefs.current[key];
    if (target) {
      target.focus();
    }
  }, [focusedDate, currentMonth]);

  const getDayType = useCallback(
    (date: Date): DayType => {
      if (!birthDate) return null;

      if (isSameDay(date, birthDate)) {
        return 'birth';
      }

      if (employerPeriod && isDateInBlock(date, employerPeriod)) {
        return 'employer';
      }

      if (mandatoryPeriod && isDateInBlock(date, mandatoryPeriod)) {
        return 'mandatory';
      }

      for (const block of remainingBlocks) {
        if (isDateInBlock(date, block)) {
          return 'remaining';
        }
      }

      return null;
    },
    [birthDate, employerPeriod, mandatoryPeriod, remainingBlocks]
  );

  const describeDay = useCallback(
    (rawDate: Date): DayMetadata => {
      const date = startOfDay(rawDate);
      const type = getDayType(date);

      if (!birthDate) {
        return { type, selectable: true, action: 'select' };
      }

      if (type === 'birth') {
        return {
          type,
          selectable: false,
          reason: "Date de naissance de l'enfant",
          action: 'static'
        };
      }

      if (type === 'employer') {
        return {
          type,
          selectable: false,
          reason: 'Période à la charge de l’employeur',
          action: 'static'
        };
      }

      if (type === 'mandatory') {
        return {
          type,
          selectable: false,
          reason: 'Période obligatoire de 4 jours',
          action: 'static'
        };
      }

      if (type === 'remaining') {
        return {
          type,
          selectable: true,
          reason: 'Bloc planifié – cliquer pour le supprimer',
          action: 'remove'
        };
      }

      if (isBefore(date, birthDate)) {
        return {
          type: null,
          selectable: false,
          reason: 'Disponible uniquement après la naissance',
          action: 'static'
        };
      }

      if (sixMonthsLimit && isAfter(date, sixMonthsLimit)) {
        return {
          type: null,
          selectable: false,
          reason: 'Au-delà des 6 mois autorisés',
          action: 'static'
        };
      }

      return { type: null, selectable: true, action: 'select' };
    },
    [birthDate, getDayType, sixMonthsLimit]
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
        if (prev && isSameMonth(prev, target)) {
          return startOfDay(prev);
        }
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
        onSelectBirthDate(date);
        return;
      }

      if (detail.action === 'static') {
        return;
      }

      if (detail.action === 'remove') {
        const blockIndex = remainingBlocks.findIndex(block =>
          isDateInRange(date, block.start, block.end)
        );
        if (blockIndex !== -1) {
          onRemoveBlock(blockIndex);
        }
        return;
      }

      if (!detail.selectable) {
        return;
      }

      onSelectRemainingDay(date);
    },
    [
      birthDate,
      describeDay,
      onRemoveBlock,
      onSelectBirthDate,
      onSelectRemainingDay,
      remainingBlocks
    ]
  );

  const handleGridKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!focusedDate) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          moveFocusBy(-7);
          break;
        case 'ArrowDown':
          event.preventDefault();
          moveFocusBy(7);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          moveFocusBy(-1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          moveFocusBy(1);
          break;
        case 'Home':
          event.preventDefault();
          focusDate(startOfWeek(focusedDate, { locale: fr }));
          break;
        case 'End':
          event.preventDefault();
          focusDate(endOfWeek(focusedDate, { locale: fr }));
          break;
        case 'PageUp':
          event.preventDefault();
          focusDate(addMonths(focusedDate, event.shiftKey ? -12 : -1));
          break;
        case 'PageDown':
          event.preventDefault();
          focusDate(addMonths(focusedDate, event.shiftKey ? 12 : 1));
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleDayInteraction(focusedDate);
          break;
        default:
          break;
      }
    },
    [focusDate, focusedDate, handleDayInteraction, moveFocusBy]
  );

  const getDayClasses = useCallback(
    (date: Date, metadata: DayMetadata) => {
      const isCurrentMonthDay = isSameMonth(date, currentMonth);
      const holiday = isFrenchHoliday(date, holidays);
      const weekend = isWeekend(date);

      let classes =
        'aspect-square flex items-center justify-center text-sm sm:text-base rounded-xl transition-colors duration-200 font-medium min-h-[2.5rem] sm:min-h-[3rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 border border-transparent';

      if (!isCurrentMonthDay) {
        classes += ' text-slate-400';
      }

      if (weekend || holiday) {
        classes += ' bg-slate-100';
      }

      if (metadata.type === 'birth') {
        classes += ' bg-slate-900 text-white font-semibold';
      } else if (metadata.type === 'employer') {
        classes += ' bg-sky-600 text-white';
      } else if (metadata.type === 'mandatory') {
        classes += ' bg-amber-500 text-white';
      } else if (metadata.type === 'remaining') {
        classes += ' bg-teal-500 text-white cursor-pointer hover:bg-teal-600';
      } else if (metadata.selectable && isCurrentMonthDay) {
        classes +=
          ' cursor-pointer text-slate-900 hover:bg-teal-50 hover:border-teal-300';
      } else {
        classes += ' cursor-not-allowed opacity-50';
      }

      return classes;
    },
    [currentMonth, holidays]
  );

  const buildAriaLabel = useCallback(
    (date: Date, metadata: DayMetadata) => {
      const base = format(date, 'EEEE d MMMM yyyy', { locale: fr });
      const details = new Set<string>();

      if (metadata.type === 'birth') details.add('date de naissance');
      if (metadata.type === 'employer') details.add('période employeur');
      if (metadata.type === 'mandatory') details.add('période obligatoire');
      if (metadata.type === 'remaining') details.add('bloc planifié');
      if (metadata.reason) details.add(metadata.reason.toLowerCase());
      if (!metadata.selectable && metadata.action !== 'remove') details.add('indisponible');
      if (metadata.action === 'remove') details.add('cliquer pour supprimer');
      if (isFrenchHoliday(date, holidays)) details.add('jour férié');
      if (isWeekend(date)) details.add('week-end');

      const detailText = Array.from(details).join(', ');
      return detailText ? `${base}, ${detailText}` : base;
    },
    [holidays]
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-lg transition-apple-smooth">
      {!birthDate && (
        <div className="mb-4 sm:mb-6 rounded-2xl border border-teal-200 bg-white p-4 sm:p-5">
          <p className="text-sm sm:text-base text-teal-800 text-center font-medium">
            👶 Sélectionnez la date de naissance pour commencer votre planification
          </p>
        </div>
      )}

      {birthDate && remainingBlocks.length === 0 && mandatoryPeriod && (
        <div className="mb-4 sm:mb-6 rounded-2xl border border-teal-200 bg-teal-50/60 p-4 sm:p-5">
          <p className="text-sm sm:text-base text-teal-900 text-center font-medium">
            👇 Choisissez où commencer vos 21 jours ou activez le mode personnalisé
          </p>
        </div>
      )}

      {birthDate && remainingBlocks.length > 0 && (
        <div className="mb-4 sm:mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
          <p className="text-sm sm:text-base text-emerald-900 text-center font-medium">
            ✓ Cliquez sur les blocs verts existants pour les retirer
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <button
          type="button"
          onClick={previousMonth}
          className="rounded-xl border border-slate-200 p-2 sm:p-3 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
        </button>

        <h2 className="text-base sm:text-xl font-semibold text-slate-900 capitalize tracking-tight">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>

        <button
          type="button"
          onClick={nextMonth}
          className="rounded-xl border border-slate-200 p-2 sm:p-3 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 mb-2 sm:mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-semibold text-slate-500">
            {day}
          </div>
        ))}
      </div>

      <div
        role="grid"
        aria-label="Calendrier des congés paternité"
        className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4"
        onKeyDown={handleGridKeyDown}
      >
        {days.map(day => {
          const metadata = describeDay(day);
          const dayKey = startOfDay(day).getTime();
          const isFocused = startOfDay(day).getTime() === startOfDay(focusedDate).getTime();
          const ariaDisabled = !metadata.selectable && metadata.action !== 'remove';

          return (
            <button
              key={dayKey}
              ref={registerDayRef(dayKey)}
              type="button"
              data-date={dayKey}
              className={getDayClasses(day, metadata)}
              tabIndex={isFocused ? 0 : -1}
              aria-label={buildAriaLabel(day, metadata)}
              aria-disabled={ariaDisabled}
              aria-selected={metadata.type === 'remaining'}
              aria-current={metadata.type === 'birth' ? 'date' : undefined}
              title={metadata.reason}
              onFocus={() => setFocusedDate(startOfDay(day))}
              onClick={() => handleDayInteraction(day, metadata)}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
