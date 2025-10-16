import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { LeaveBlock, countCalendarDays } from '../utils/paternityLeave';

interface SummaryProps {
  birthDate: Date | null;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  onRemoveBlock: (index: number) => void;
}

export function Summary({ birthDate, employerPeriod, mandatoryPeriod, remainingBlocks, onRemoveBlock }: SummaryProps) {
  if (!birthDate) {
    return null;
  }

  const totalRemainingDays = remainingBlocks.reduce((sum, block) =>
    sum + countCalendarDays(block.start, block.end), 0
  );
  const remainingDaysLeft = 21 - totalRemainingDays;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-apple-smooth card-hover-3d">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        Votre planning
      </h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3 pb-4 border-b border-slate-200 mb-4">
          <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500 mb-1">Date de naissance</p>
            <p className="text-slate-900 font-medium text-sm capitalize">
              {format(birthDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>

        {employerPeriod && (
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-5 mb-3 transition-apple-smooth hover:shadow-lg hover:scale-[1.02] animate-slide-in border border-sky-200/50">
            <p className="font-bold text-sky-900 text-base mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
              Période employeur
            </p>
            <p className="text-sm text-sky-700 mb-2 font-medium">3 jours ouvrés</p>
            <p className="text-sm text-sky-800">
              Du {format(employerPeriod.start, 'd MMM', { locale: fr })} au{' '}
              {format(employerPeriod.end, 'd MMM yyyy', { locale: fr })}
            </p>
          </div>
        )}

        {mandatoryPeriod && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 mb-3 transition-apple-smooth hover:shadow-lg hover:scale-[1.02] animate-slide-in border border-amber-200/50">
            <p className="font-bold text-amber-900 text-base mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Période obligatoire
            </p>
            <p className="text-sm text-amber-700 mb-2 font-medium">4 jours calendaires</p>
            <p className="text-sm text-amber-800">
              Du {format(mandatoryPeriod.start, 'd MMM', { locale: fr })} au{' '}
              {format(mandatoryPeriod.end, 'd MMM yyyy', { locale: fr })}
            </p>
          </div>
        )}

        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 transition-apple-smooth hover:shadow-lg hover:scale-[1.01] animate-slide-in border border-teal-200/50">
          <p className="font-bold text-teal-900 text-base mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Jours fractionnables
          </p>
          {remainingBlocks.length > 0 ? (
            <div className="space-y-3">
              {remainingBlocks.map((block, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 group hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-apple-smooth hover:shadow-md relative cursor-pointer border border-teal-200/30 hover:border-red-300" onClick={() => onRemoveBlock(index)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-teal-700 font-bold mb-2 group-hover:text-red-700 transition-apple">Bloc {index + 1}</p>
                      <p className="text-sm text-teal-900 mb-1 group-hover:text-red-900 transition-apple font-medium">
                        Du {format(block.start, 'd MMM', { locale: fr })} au{' '}
                        {format(block.end, 'd MMM yyyy', { locale: fr })}
                      </p>
                      <p className="text-xs text-teal-600 group-hover:text-red-600 transition-apple font-semibold">{countCalendarDays(block.start, block.end)} jours</p>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-red-600 font-semibold transition-apple">✕ Supprimer</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-teal-700 font-medium">Aucun bloc planifié</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 animate-pulse-subtle" />
            <div>
              <p className="text-xs text-slate-500">Jours restants</p>
              <p className="text-slate-900 font-semibold text-2xl transition-apple">
                {remainingDaysLeft}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">sur 21 jours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
