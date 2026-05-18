interface NextStepsCardProps {
  planningStep: number;
  totalPlannedDays: number;
  hasBirthDate: boolean;
  hasMandatory: boolean;
  remainingBlocks: number;
  fractionableDays: number;
}

export function NextStepsCard({ planningStep, totalPlannedDays, hasBirthDate, hasMandatory, remainingBlocks, fractionableDays }: NextStepsCardProps) {
  const checklist = buildChecklist({ planningStep, totalPlannedDays, hasBirthDate, hasMandatory, remainingBlocks, fractionableDays });

  return (
    <ol className="relative space-y-0">
      <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100" />
      {checklist.map(item => (
        <li key={item.label} className="group relative pl-12 py-4 first:pt-0 last:pb-0 transition-all duration-300">
          <span
            className={`absolute left-0 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-sm ring-4 ring-white transition-all duration-500 ${
              item.status === 'done' 
                ? 'bg-emerald-500 text-white scale-100' 
                : 'bg-white text-slate-300 border-2 border-slate-100 group-hover:border-brand-200 group-hover:text-brand-300'
            }`}
          >
            {item.status === 'done' ? '✓' : item.index}
          </span>
          <div className={`space-y-1 p-4 rounded-2xl transition-all duration-300 ${
            item.status === 'active' 
              ? 'bg-white border border-brand-100 shadow-soft scale-[1.02]' 
              : 'group-hover:bg-slate-50'
          }`}>
            <div className="flex justify-between items-start">
              <p className={`font-bold text-base ${item.status === 'done' ? 'text-slate-900' : item.status === 'active' ? 'text-brand-900' : 'text-slate-500'}`}>
                {item.label}
              </p>
              {item.index === 4 && item.status === 'active' && (
                <span className="text-brand-500 font-hand text-lg -rotate-6 animate-pulse-subtle hidden sm:inline-block">Dernière ligne droite ! 🏁</span>
              )}
            </div>
            {item.hint && <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.hint}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

type ChecklistArgs = Required<
  Pick<NextStepsCardProps, 'planningStep' | 'totalPlannedDays' | 'hasBirthDate' | 'hasMandatory' | 'remainingBlocks' | 'fractionableDays'>
>;

function buildChecklist({ planningStep, totalPlannedDays, hasBirthDate, hasMandatory, remainingBlocks, fractionableDays }: ChecklistArgs) {
  const steps: Array<{ label: string; hint?: string; status: 'pending' | 'active' | 'done'; index: number }> = [];

  const isStep1Done = hasBirthDate;
  steps.push({
    label: 'Définir la date de naissance',
    hint: "Point de départ de tout le calcul",
    status: isStep1Done ? 'done' : 'active',
    index: 1
  });

  const isStep2Done = hasMandatory || planningStep > 1;
  steps.push({
    label: 'Valider la période obligatoire',
    hint: '3 jours naissance + 4 jours obligatoires',
    status: isStep2Done ? 'done' : (isStep1Done ? 'active' : 'pending'),
    index: 2
  });

  const hasAllBlocks = totalPlannedDays >= fractionableDays;
  const remainingDays = Math.max(fractionableDays - totalPlannedDays, 0);
  
  steps.push({
    label: `Planifier vos ${fractionableDays} jours restants`,
    hint: remainingBlocks === 0
        ? 'À poser en 2 périodes minimum (min. 5j chacune)'
        : remainingDays > 0
          ? `${remainingDays} jours encore à planifier`
          : 'Planning complet !',
    status: hasAllBlocks ? 'done' : (isStep2Done ? 'active' : 'pending'),
    index: 3
  });

  steps.push({
    label: 'Générer votre lettre',
    hint: 'Modèle officiel prêt à envoyer à votre employeur',
    status: hasAllBlocks ? 'active' : 'pending', // Active only when everything else is done
    index: 4
  });

  // Add a final "done" message
  if (hasAllBlocks) {
     // No op, handled in UI
  }

  return steps;
}
