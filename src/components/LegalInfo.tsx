import { BookOpen, Scale, AlertCircle } from 'lucide-react';
import { LEAVE_SCENARIOS } from '../utils/paternityLeave';

interface LegalInfoProps {
  onShowLegalReferences?: () => void;
}

export function LegalInfo({ onShowLegalReferences }: LegalInfoProps) {
  const standard = LEAVE_SCENARIOS.standard;
  const multiples = LEAVE_SCENARIOS['multiple-births'];
  const hospitalized = LEAVE_SCENARIOS['hospitalized-newborn'];
  const adoption = LEAVE_SCENARIOS.adoption;
  const multiplesBonus = multiples.fractionableDays - standard.fractionableDays;

  return (
    <details className="bg-surface-100 border border-white/10 rounded-2xl shadow-md hover:shadow-lg transition-all">
      <summary className="cursor-pointer p-6 hover:bg-surface-50 transition-all flex items-center gap-3 active:scale-[0.99] rounded-2xl">
        <div className="p-2 rounded-xl bg-brand-600 text-white">
          <BookOpen className="w-5 h-5 flex-shrink-0" />
        </div>
        <span className="text-base font-bold text-[var(--text)]">Cadre légal</span>
      </summary>
      <div className="px-6 pb-6 animate-slide-in space-y-4">
        {/* Avertissement secteur public */}
        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900 mb-1">
              ⚠️ Secteur privé uniquement
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Cette application s'applique au <strong>secteur privé</strong> selon le Code du Travail (articles L1225-35 et suivants).
              Les agents de la <strong>fonction publique</strong> (État, territoriale, hospitalière) sont soumis à des règles différentes.
              Certaines <strong>conventions collectives</strong> peuvent prévoir des jours supplémentaires.
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-sm text-[var(--muted)]">
          <li className="flex gap-3 items-start p-3 bg-surface-50 rounded-xl hover:bg-surface-50/90 transition-all">
            <span className="font-bold text-[var(--text)] min-w-[4rem] text-base">3 jours</span>
            <div className="flex-1">
              <span className="font-medium text-[var(--text)]">ouvrables à la charge de l'employeur</span>
              <p className="text-xs text-[var(--muted)] mt-1">
                Jours ouvrables = lundi à samedi (hors dimanches et jours fériés)
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-surface-50 rounded-xl hover:bg-surface-50/90 transition-all">
            <span className="font-bold text-[var(--text)] min-w-[4rem] text-base">4 jours</span>
            <div className="flex-1">
              <span className="font-medium text-[var(--text)]">calendaires obligatoires immédiatement après</span>
              <p className="text-xs text-[var(--muted)] mt-1">
                Jours calendaires = weekends et jours fériés inclus
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-surface-50 rounded-xl hover:bg-surface-50/90 transition-all">
            <span className="font-bold text-[var(--text)] min-w-[4rem] text-base">{standard.fractionableDays} jours</span>
            <div className="flex-1">
              <span className="font-medium text-[var(--text)]">
                calendaires fractionnables en situation standard (minimum 5 jours calendaires consécutifs), à poser dans les {standard.limitMonthsAfterBirth} mois
              </span>
              <p className="text-xs text-[var(--muted)] mt-1">
                Jours calendaires = incluant samedis, dimanches et jours fériés
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-surface-50 rounded-xl hover:bg-surface-50/90 transition-all">
            <span className="font-bold text-[var(--text)] min-w-[4rem] text-base">+{multiplesBonus} jours</span>
            <div className="flex-1">
              <span className="font-medium text-[var(--text)]">calendaires en cas de naissances multiples (soit {multiples.fractionableDays} jours fractionnables)</span>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-surface-50 rounded-xl hover:bg-surface-50/90 transition-all">
            <span className="font-bold text-[var(--text)] min-w-[4rem] text-base">Hospitalisation</span>
            <span className="font-medium text-[var(--text)]">report possible jusqu'à {hospitalized.limitMonthsAfterBirth} mois après la naissance</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-surface-50 rounded-xl hover:bg-surface-50/90 transition-all">
            <span className="font-bold text-[var(--text)] min-w-[4rem] text-base">Adoption</span>
            <span className="font-medium text-[var(--text)]">{adoption.fractionableDays} jours calendaires fractionnables à prendre dans les {adoption.limitMonthsAfterBirth} mois suivant l'arrivée</span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-[#eef5ff] border border-[#0071e3]/20 rounded-xl">
            <span className="font-bold text-[#1d1d1f] min-w-[4rem] text-base">2026</span>
            <div className="flex-1">
              <span className="font-medium text-[#1d1d1f]">
                Congé supplémentaire de naissance: 1 ou 2 mois, accessible à partir du 1 juillet 2026 pour les enfants nés/adoptés dès le 1 janvier 2026.
              </span>
              <p className="text-xs text-[#424245] mt-1">
                Prise dans un délai de 9 mois (fenêtre transitoire jusqu’au 31 mars 2027 pour les naissances du 1er semestre 2026), sous réserve des textes d’application.
              </p>
            </div>
          </li>
        </ul>

        {onShowLegalReferences && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onShowLegalReferences}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-50/35 hover:bg-brand-50/50 text-brand-700 rounded-xl transition-all hover:shadow-md font-medium text-sm border border-brand-400/25"
            >
              <Scale className="w-4 h-4" />
              Consulter toutes les références légales
            </button>
            <p className="text-xs text-[var(--muted)] text-center mt-2">
              Textes de loi, articles du Code du Travail, liens vers Légifrance et Service-Public.fr
            </p>
          </div>
        )}
      </div>
    </details>
  );
}
