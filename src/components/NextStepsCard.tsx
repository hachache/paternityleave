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
      <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-black/10" />
      {checklist.map(item => (
        <li key={item.label} className="group relative pl-12 py-4 first:pt-0 last:pb-0 transition-all duration-300">
          <span
            className={`absolute left-0 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shadow-sm ring-4 ring-white transition-all duration-300 ${
              item.status === 'done'
                ? 'bg-black text-white scale-100'
                : 'bg-white text-[#6e6e73] border border-black/10'
            }`}
          >
            {item.status === 'done' ? '✓' : item.index}
          </span>
          <div className={`space-y-1 p-4 rounded-2xl transition-all duration-300 ${
            item.status === 'active'
              ? 'bg-[#f5f5f7] border border-black/10'
              : 'group-hover:bg-[#f5f5f7]/80'
          }`}>
            <p className={`font-semibold text-base ${item.status === 'active' ? 'text-[#1d1d1f]' : 'text-[#424245]'}`}>
              {item.label}
            </p>
            {item.hint && <p className="text-sm text-[#6e6e73] leading-relaxed">{item.hint}</p>}
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
    hint: 'Point de départ de tout le calcul',
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
      ? 'À poser en 2 périodes minimum (min. 5 jours chacune)'
      : remainingDays > 0
        ? `${remainingDays} jours encore à planifier`
        : 'Planning complet',
    status: hasAllBlocks ? 'done' : (isStep2Done ? 'active' : 'pending'),
    index: 3
  });

  steps.push({
    label: 'Générer votre courrier',
    hint: 'Modèle prêt à transmettre à votre employeur',
    status: hasAllBlocks ? 'active' : 'pending',
    index: 4
  });

  return steps;
}
