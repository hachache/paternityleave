import { addDays, addMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { isWeekend, isFrenchHoliday, getFrenchHolidays } from '../utils/holidays';
import { LeaveBlock, isDateInRange, isDateInBlock } from '../utils/paternityLeave';

interface CalendarProps {
  birthDate: Date | null;
  onSelectBirthDate: (date: Date) => void;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  onSelectRemainingDay: (date: Date) => void;
  onRemoveBlock: (index: number) => void;
}

export function Calendar({
  birthDate,
  onSelectBirthDate,
  employerPeriod,
  mandatoryPeriod,
  remainingBlocks,
  onSelectRemainingDay,
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

    let classes = 'aspect-square flex items-center justify-center text-xs sm:text-sm md:text-base rounded-xl transition-all duration-300 relative font-medium min-h-[2.5rem] sm:min-h-[3rem] touch-manipulation ripple-effect ';

    if (!isCurrentMonth) {
      classes += 'text-gray-300 ';
    }

    if (isWeekendDay || isHoliday) {
      classes += 'bg-gray-100 ';
    }

    if (dayType === 'birth') {
      classes += 'bg-slate-900 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 ';
    } else if (dayType === 'employer') {
      classes += 'bg-sky-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 ';
    } else if (dayType === 'mandatory') {
      classes += 'bg-amber-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 ';
    } else if (dayType === 'remaining') {
      classes += 'bg-teal-500 text-white font-medium cursor-pointer hover:bg-teal-600 hover:shadow-lg hover:scale-110 active:scale-95 active:bg-teal-700 shadow-md ';
    } else if (selectable && isCurrentMonth) {
      classes += 'hover:bg-gradient-to-br hover:from-teal-50 hover:to-emerald-50 hover:border-2 hover:border-teal-300 hover:shadow-md cursor-pointer text-slate-900 hover:scale-105 active:scale-95 active:bg-slate-200 pulse-glow-hover ';
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
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 p-4 sm:p-6 md:p-10 shadow-xl hover:shadow-2xl transition-apple-smooth card-hover-3d">
      {!birthDate && (
        <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/60 backdrop-blur-sm animate-spring-in shadow-md">
          <p className="text-xs sm:text-sm text-teal-900 text-center font-semibold">
            👶 Cliquez sur un jour du calendrier pour sélectionner la date de naissance
          </p>
        </div>
      )}

      {birthDate && remainingBlocks.length === 0 && mandatoryPeriod && (
        <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/60 backdrop-blur-sm animate-spring-in shadow-md">
          <p className="text-xs sm:text-sm text-teal-900 text-center font-semibold">
            👇 Cliquez sur une date du calendrier ou utilisez le mode personnalisé ci-dessous
          </p>
        </div>
      )}

      {birthDate && remainingBlocks.length > 0 && (
        <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/60 backdrop-blur-sm animate-spring-in shadow-md">
          <p className="text-xs sm:text-sm text-emerald-900 text-center font-semibold">
            ✓ Cliquez sur les blocs verts pour les supprimer
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <button
          onClick={previousMonth}
          className="p-2 sm:p-3 hover:bg-slate-100/80 rounded-xl transition-apple-smooth active:scale-95 hover:shadow-lg hover:scale-105 border border-transparent hover:border-slate-200 touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
        </button>

        <h2 className="text-base sm:text-xl font-bold text-slate-900 capitalize tracking-tight">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 sm:p-3 hover:bg-slate-100/80 rounded-xl transition-apple-smooth active:scale-95 hover:shadow-lg hover:scale-105 border border-transparent hover:border-slate-200 touch-manipulation"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 mb-2 sm:mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-semibold text-slate-600 py-1 sm:py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4">
        {days.map((day, index) => {
          const dayType = getDayType(day);
          const selectable = isSelectable(day);
          // Les jours sont cliquables si : ils sont sélectionnables OU si c'est un bloc vert (remaining) OU si c'est la date de naissance
          const isClickable = selectable || dayType === 'remaining' || (birthDate && isSameDay(day, birthDate));

          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              className={getDayClasses(day)}
              disabled={!isClickable}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 border-t border-slate-200/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-900 rounded-lg shadow-sm group-hover:scale-110 transition-apple-smooth flex-shrink-0"></div>
            <span className="text-slate-700 font-semibold leading-tight">Naissance</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-sky-500 rounded-lg shadow-sm group-hover:scale-110 transition-apple-smooth flex-shrink-0"></div>
            <span className="text-slate-700 font-semibold leading-tight">Employeur<br className="md:hidden" /><span className="text-[10px] sm:text-xs text-slate-500"> (3j ouvrés)</span></span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-lg shadow-sm group-hover:scale-110 transition-apple-smooth flex-shrink-0"></div>
            <span className="text-slate-700 font-semibold leading-tight">Obligatoire<br className="md:hidden" /><span className="text-[10px] sm:text-xs text-slate-500"> (4j)</span></span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-teal-500 rounded-lg shadow-sm group-hover:scale-110 transition-apple-smooth flex-shrink-0"></div>
            <span className="text-slate-700 font-semibold leading-tight">Fractionnables<br className="md:hidden" /><span className="text-[10px] sm:text-xs text-slate-500"> (21j max)</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
