import { BookOpen, Scale, AlertCircle } from 'lucide-react';
import { LEAVE_SCENARIOS } from '../utils/paternityLeave';

interface LegalInfoProps {
  onShowLegalReferences?: () => void;
}

export function LegalInfo({ onShowLegalReferences }: LegalInfoProps) {
  const standard = LEAVE_SCENARIOS.standard;
  const multiples = LEAVE_SCENARIOS['multiple-births'];
  const multiplesBonus = multiples.fractionableDays - standard.fractionableDays;

  return (
    <details className="bg-white border border-slate-200 rounded-2xl shadow-soft transition-[border-color,box-shadow] duration-200 hover:border-slate-300">
      <summary className="cursor-pointer p-6 hover:bg-slate-100 transition-colors duration-200 flex items-center gap-3 active:scale-[0.99] rounded-2xl">
        <div className="p-2 rounded-xl bg-slate-900 text-white">
          <BookOpen className="w-5 h-5 flex-shrink-0" />
        </div>
        <span className="text-base font-bold text-slate-800">Cadre légal</span>
      </summary>
      <div className="px-6 pb-6 space-y-4">
        {/* Avertissement perimetre de l'application */}
        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-semibold text-amber-900">
              Périmètre du calcul
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Le <strong>congé de paternité</strong> calculé ci-dessous suit le Code du travail
              (articles L1225-35 et suivants), donc le <strong>secteur privé</strong>. Les agents de la
              <strong> fonction publique</strong> et certains régimes spéciaux relèvent de règles
              propres ; les <strong>conventions collectives</strong> peuvent prévoir des jours
              supplémentaires.
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Le <strong>congé supplémentaire de naissance 2026</strong> (LFSS 2026, art. 99-V) est plus
              large : il couvre <strong>tous les actifs</strong> (salariés, indépendants, non-salariés
              agricoles, fonctionnaires, militaires).
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl transition-colors duration-200 hover:bg-white">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">3 jours</span>
            <div className="flex-1">
              <span className="font-medium">ouvrables à la charge de l'employeur</span>
              <p className="text-xs text-slate-500 mt-1">
                Jours ouvrables = lundi à samedi (hors dimanches et jours fériés)
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl transition-colors duration-200 hover:bg-white">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">4 jours</span>
            <div className="flex-1">
              <span className="font-medium">calendaires obligatoires immédiatement après</span>
              <p className="text-xs text-slate-500 mt-1">
                Jours calendaires = weekends et jours fériés inclus
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl transition-colors duration-200 hover:bg-white">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">{standard.fractionableDays} jours</span>
            <div className="flex-1">
              <span className="font-medium">
                calendaires fractionnables en situation standard (minimum 5 jours calendaires consécutifs), à poser dans les {standard.limitMonthsAfterBirth} mois
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Jours calendaires = incluant samedis, dimanches et jours fériés
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl transition-colors duration-200 hover:bg-white">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">+{multiplesBonus} jours</span>
            <div className="flex-1">
              <span className="font-medium">calendaires en cas de naissances multiples (soit {multiples.fractionableDays} jours fractionnables)</span>
            </div>
          </li>
          <li className="flex gap-3 items-start p-3 bg-white/60 rounded-xl transition-colors duration-200 hover:bg-white">
            <span className="font-bold text-slate-900 min-w-[4rem] text-base">Hospitalisation</span>
            <span className="font-medium">
              congé spécifique et reports possibles selon justificatifs, non calculés automatiquement ici
            </span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-amber-50/70 rounded-xl border border-amber-100">
            <span className="font-bold text-amber-900 min-w-[4rem] text-base">Adoption</span>
            <span className="font-medium text-amber-900">
              régime spécifique non simulé ici. Consultez la fiche Service-Public dédiée au congé d’adoption.
            </span>
          </li>
          <li className="flex gap-3 items-start p-3 bg-blue-50/60 rounded-xl transition-colors duration-200 hover:bg-blue-50 border border-blue-100">
            <span className="font-bold text-blue-700 min-w-[4rem] text-base">+1 à 2 mois</span>
            <div className="flex-1">
              <span className="font-medium text-blue-900">
                Congé supplémentaire de naissance 2026 (LFSS 2026, art. 99-V)
              </span>
              <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                Demande possible à partir du 1er juin 2026, avec un début effectif au plus tôt le
                1er juillet 2026, pour les enfants nés/adoptés à partir du 1er janvier 2026.
                Indemnisation : 70% du salaire net le premier mois, 60% le second (plafond SS).
                Fractionnable en 2 périodes d&apos;1 mois.
              </p>
            </div>
          </li>
        </ul>

        {onShowLegalReferences && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onShowLegalReferences}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors duration-200 font-medium text-sm"
            >
              <Scale className="w-4 h-4" />
              Consulter toutes les références légales
            </button>
            <p className="text-xs text-slate-500 text-center mt-2">
              Textes de loi, articles du Code du travail, liens vers Légifrance et Service-Public.fr
            </p>
          </div>
        )}
      </div>
    </details>
  );
}
