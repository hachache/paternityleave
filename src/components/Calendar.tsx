import { addDays, addMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isAfter } from 'date-fns';
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
      classes += 'bg-teal-500 text-white font-medium cursor-pointer hover:bg-teal-600 ';
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
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 p-10 shadow-xl hover:shadow-2xl transition-apple-smooth card-hover-3d">
      {!birthDate && (
        <div className="mb-6 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/60 backdrop-blur-sm animate-spring-in shadow-md">
          <p className="text-sm text-teal-900 text-center font-semibold">
            👶 Cliquez sur un jour du calendrier pour sélectionner la date de naissance
          </p>
        </div>
      )}

      {birthDate && remainingBlocks.length === 0 && mandatoryPeriod && (
        <div className="mb-6 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/60 backdrop-blur-sm animate-spring-in shadow-md">
          <p className="text-sm text-teal-900 text-center font-semibold mb-2">
            ✨ Planifiez vos 21 jours restants
          </p>
          <p className="text-xs text-teal-700 text-center">
            Cliquez sur un jour dans le calendrier pour placer automatiquement les 21 jours à partir de cette date
          </p>
        </div>
      )}

      {birthDate && remainingBlocks.length > 0 && (
        <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/60 backdrop-blur-sm animate-spring-in shadow-md">
          <p className="text-sm text-emerald-900 text-center font-semibold">
            ✓ Vous pouvez cliquer sur les blocs verts pour les supprimer ou ajouter d'autres périodes
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={previousMonth}
          className="p-3 hover:bg-slate-100/80 rounded-xl transition-apple-smooth active:scale-95 hover:shadow-lg hover:scale-105 border border-transparent hover:border-slate-200"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 capitalize tracking-tight">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>

        <button
          onClick={nextMonth}
          className="p-3 hover:bg-slate-100/80 rounded-xl transition-apple-smooth active:scale-95 hover:shadow-lg hover:scale-105 border border-transparent hover:border-slate-200"
        >
          <ChevronRight className="w-6 h-6 text-slate-600" />
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

      <div className="mt-8 pt-6 border-t border-slate-200/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-slate-900 rounded-lg shadow-sm group-hover:scale-110 transition-apple-smooth"></div>
            <span className="text-slate-700 font-semibold">Naissance</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-sky-500 rounded-lg shadow-sm group-hover:scale-110 transition-apple-smooth"></div>
            <span className="text-slate-700 font-semibold">Employeur (3j)</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-amber-500 rounded-lg shadow-sm group-hover:scale-110 transition-apple-smooth"></div>
            <span className="text-slate-700 font-semibold">Obligatoire (4j)</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-teal-500 rounded-lg shadow-sm group-hover:scale-110 transition-apple-smooth"></div>
            <span className="text-slate-700 font-semibold">Restants</span>
          </div>
        </div>
      </div>
    </div>
  );
}
