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
    <ol className="space-y-4 text-base text-slate-700">
      {checklist.map(item => (
        <li key={item.label} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
          <span
            className={`mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              item.status === 'done' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {item.status === 'done' ? '✓' : item.index}
          </span>
          <div className="space-y-1.5 flex-1">
            <p className="font-semibold text-slate-900 leading-relaxed">{item.label}</p>
            {item.hint && <p className="text-sm text-slate-500 leading-relaxed">{item.hint}</p>}
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
  const steps: Array<{ label: string; hint?: string; status: 'pending' | 'done'; index: number }> = [];

  steps.push({
    label: 'Définir la date de naissance',
    hint: "Cliquez sur votre date dans le calendrier",
    status: hasBirthDate ? 'done' : 'pending',
    index: 1
  });

  steps.push({
    label: 'Valider la période obligatoire (3j + 4j)',
    hint: 'Nous la proposons automatiquement juste après la naissance',
    status: hasMandatory || planningStep > 1 ? 'done' : 'pending',
    index: 2
  });

  const hasAllBlocks = totalPlannedDays >= fractionableDays;
  const remainingDays = Math.max(fractionableDays - totalPlannedDays, 0);

  steps.push({
    label: `Planifier vos ${fractionableDays} jours fractionnables`,
    hint:
      remainingBlocks === 0
        ? 'Placez vos blocs en respectant minimum 5 jours'
        : remainingDays > 0
          ? `${remainingDays} jours restants à planifier`
          : 'Cliquez sur un bloc vert pour le modifier',
    status: hasAllBlocks ? 'done' : 'pending',
    index: 3
  });

  steps.push({
    label: 'Générer votre lettre de demande',
    hint: 'Remplissez les champs puis copiez le texte à envoyer à votre employeur',
    status: hasAllBlocks ? 'done' : 'pending',
    index: 4
  });

  return steps;
}
