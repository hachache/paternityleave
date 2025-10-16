import { addDays, addMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isAfter, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { isWeekend, isFrenchHoliday, getFrenchHolidays } from '../utils/holidays';
import { LeaveBlock, isDateInRange } from '../utils/paternityLeave';

interface CalendarProps {
  birthDate: Date | null;
  onSelectBirthDate: (date: Date) => void;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  onSelectRemainingDay: (date: Date) => void;
  selectionStart: Date | null;
  onRemoveBlock: (index: number) => void;
}

export function Calendar({
  birthDate,
  onSelectBirthDate,
  employerPeriod,
  mandatoryPeriod,
  remainingBlocks,
  onSelectRemainingDay,
  selectionStart,
  onRemoveBlock
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: fr });
  const calendarEnd = endOfWeek(monthEnd, { locale: fr });

  const holidays = getFrenchHolidays(currentMonth.getFullYear());

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const previousMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getDayType = (date: Date): string | null => {
    if (!birthDate) return null;

    if (isSameDay(date, birthDate)) return 'birth';

    if (employerPeriod && isDateInRange(date, employerPeriod.start, employerPeriod.end)) {
      return 'employer';
    }

    if (mandatoryPeriod && isDateInRange(date, mandatoryPeriod.start, mandatoryPeriod.end)) {
      return 'mandatory';
    }

    for (const block of remainingBlocks) {
      if (isDateInRange(date, block.start, block.end)) {
        return 'remaining';
      }
    }

    if (selectionStart && !isSameDay(date, selectionStart)) {
      const start = startOfDay(selectionStart);
      const end = startOfDay(date);
      const rangeStart = isAfter(end, start) ? start : end;
      const rangeEnd = isAfter(end, start) ? end : start;
      if (isDateInRange(date, rangeStart, rangeEnd) && isSelectable(date)) {
        return 'selection';
      }
    }

    return null;
  };

  const isSelectable = (date: Date): boolean => {
    if (!birthDate) return true;

    const sixMonthsLimit = addDays(birthDate, 180);
    if (isAfter(date, sixMonthsLimit)) return false;

    if (employerPeriod && isDateInRange(date, employerPeriod.start, employerPeriod.end)) {
      return false;
    }

    if (mandatoryPeriod && isDateInRange(date, mandatoryPeriod.start, mandatoryPeriod.end)) {
      return false;
    }

    for (const block of remainingBlocks) {
      if (isDateInRange(date, block.start, block.end)) {
        return false;
      }
    }

    return true;
  };

  const handleDayClick = (date: Date) => {
    if (!birthDate) {
      onSelectBirthDate(date);
      return;
    }

    if (isSameDay(date, birthDate)) {
      return;
    }

    const blockIndex = remainingBlocks.findIndex(block =>
      isDateInRange(date, block.start, block.end)
    );

    if (blockIndex !== -1) {
      onRemoveBlock(blockIndex);
      return;
    }

    if (!isSelectable(date)) return;

    onSelectRemainingDay(date);
  };

  const getDayClasses = (date: Date): string => {
    const dayType = getDayType(date);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isHoliday = isFrenchHoliday(date, holidays);
    const isWeekendDay = isWeekend(date);
    const selectable = isSelectable(date);

    let classes = 'aspect-square flex items-center justify-center text-base rounded-lg transition-apple-smooth relative font-medium min-h-[3rem] ';

    if (!isCurrentMonth) {
      classes += 'text-gray-300 ';
    }

    if (isWeekendDay || isHoliday) {
      classes += 'bg-gray-100 ';
    }

    if (dayType === 'birth') {
      classes += 'bg-slate-900 text-white font-semibold ';
    } else if (dayType === 'employer') {
      classes += 'bg-sky-500 text-white font-medium ';
    } else if (dayType === 'mandatory') {
      classes += 'bg-amber-500 text-white font-medium ';
    } else if (dayType === 'remaining') {
      classes += 'bg-teal-500 text-white font-medium ';
    } else if (dayType === 'selection') {
      classes += 'bg-teal-100 text-teal-900 ';
    } else if (selectable && isCurrentMonth) {
      classes += 'hover:bg-slate-100 hover:shadow-sm cursor-pointer text-slate-900 active:scale-95 ';
    } else {
      classes += 'text-slate-300 ';
    }

    if (!selectable && !dayType) {
      classes += 'cursor-not-allowed opacity-50 ';
    }

    return classes;
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-apple-smooth card-hover-3d">
      {!birthDate && (
        <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 backdrop-blur-sm animate-spring-in shadow-sm">
          <p className="text-sm text-slate-700 text-center font-medium">
            Cliquez sur un jour du calendrier pour sélectionner la date de naissance
          </p>
        </div>
      )}

      {birthDate && !selectionStart && remainingBlocks.length === 0 && mandatoryPeriod && (
        <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 backdrop-blur-sm animate-spring-in shadow-sm">
          <p className="text-sm text-teal-800 text-center font-medium">
            Utilisez la planification automatique ci-dessous ou cliquez manuellement sur un jour pour commencer à sélectionner vos blocs (minimum 5 jours consécutifs)
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-apple-smooth active:scale-95 hover:shadow-md hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>

        <h2 className="text-lg font-semibold text-slate-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-apple-smooth active:scale-95 hover:shadow-md hover:scale-105"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(day)}
            className={getDayClasses(day)}
            disabled={!isSelectable(day) && getDayType(day) === null}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-slate-900 rounded"></div>
            <span className="text-slate-700 font-medium">Naissance</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-sky-500 rounded"></div>
            <span className="text-slate-700 font-medium">Employeur (3j)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-amber-500 rounded"></div>
            <span className="text-slate-700 font-medium">Obligatoire (4j)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-teal-500 rounded"></div>
            <span className="text-slate-700 font-medium">Restants</span>
          </div>
        </div>
      </div>

      {selectionStart && (
        <div className="mt-4 p-3 bg-teal-50 rounded-xl text-sm text-teal-900 backdrop-blur-sm animate-slide-in border border-teal-200">
          <p className="text-teal-800 font-medium">Cliquez sur une date de fin (minimum 5 jours calendaires)</p>
        </div>
      )}
    </div>
  );
}
