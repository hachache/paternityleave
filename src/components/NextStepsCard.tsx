interface NextStepsCardProps {
  planningStep: number;
  totalPlannedDays: number;
  hasBirthDate: boolean;
  hasMandatory: boolean;
  remainingBlocks: number;
}

export function NextStepsCard({ planningStep, totalPlannedDays, hasBirthDate, hasMandatory, remainingBlocks }: NextStepsCardProps) {
  const checklist = buildChecklist({ planningStep, totalPlannedDays, hasBirthDate, hasMandatory, remainingBlocks });

  return (
    <ol className="space-y-3 text-sm text-slate-700">
      {checklist.map(item => (
        <li key={item.label} className="flex items-start gap-2">
          <span
            className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              item.status === 'done' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {item.status === 'done' ? '✓' : item.index}
          </span>
          <div>
            <p className="font-medium text-slate-900">{item.label}</p>
            {item.hint && <p className="text-xs text-slate-500 mt-0.5">{item.hint}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

type ChecklistArgs = Required<Pick<NextStepsCardProps, 'planningStep' | 'totalPlannedDays' | 'hasBirthDate' | 'hasMandatory' | 'remainingBlocks'>>;

function buildChecklist({ planningStep, totalPlannedDays, hasBirthDate, hasMandatory, remainingBlocks }: ChecklistArgs) {
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

  const hasAllBlocks = totalPlannedDays === 21;

  steps.push({
    label: 'Planifier vos 21 jours fractionnables',
    hint: remainingBlocks === 0 ? 'Placez vos blocs en respectant minimum 5 jours' : 'Cliquez sur un bloc vert pour le modifier',
    status: hasAllBlocks ? 'done' : remainingBlocks > 0 ? 'pending' : 'pending',
    index: 3
  });

  steps.push({
    label: 'Générer votre lettre de demande',
    hint: 'Remplissez les champs puis copiez le texte à envoyer à votre employeur',
    status: hasAllBlocks ? 'pending' : 'pending',
    index: 4
  });

  return steps;
}
