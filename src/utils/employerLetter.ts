import { format, isAfter, startOfDay } from 'date-fns';

import { LeaveBlock, LeaveScenarioConfig, countCalendarDays } from './paternityLeave';
import { SupplementaryLeaveDuration, SupplementaryLeaveMode } from './supplementaryBirthLeave';

export interface EmployerLetterIdentity {
  lieu: string;
  dateRedaction: string;
  nom: string;
  prenom: string;
  adresse: string;
  fonction: string;
}

export interface GenerateEmployerLetterInput {
  birthDate: Date;
  currentDate?: Date;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  scenario: LeaveScenarioConfig;
  supplementaryLeavePeriods?: LeaveBlock[];
  supplementaryLeaveDuration?: SupplementaryLeaveDuration;
  supplementaryLeaveMode?: SupplementaryLeaveMode;
  identity: EmployerLetterIdentity;
}

function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

function valueOrPlaceholder(value: string, placeholder: string): string {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : `[${placeholder}]`;
}

function formatCalendarDays(days: number): string {
  return `${days} jour${days > 1 ? 's' : ''} calendaire${days > 1 ? 's' : ''}`;
}

function formatPeriod(block: LeaveBlock): string {
  return `du ${formatDate(block.start)} au ${formatDate(block.end)}, soit ${formatCalendarDays(countCalendarDays(block.start, block.end))}`;
}

function buildHeader(identity: EmployerLetterIdentity): string {
  const dateRedaction = valueOrPlaceholder(identity.dateRedaction, 'Date de rédaction');
  const lieu = valueOrPlaceholder(identity.lieu, 'Lieu');
  const fullName = `${valueOrPlaceholder(identity.prenom, 'Prénom')} ${valueOrPlaceholder(identity.nom, 'Nom')}`;
  const adresse = valueOrPlaceholder(identity.adresse, 'Adresse');
  const fonction = valueOrPlaceholder(identity.fonction, 'Fonction');

  return `${lieu}, le ${dateRedaction}\n${fullName}\n${adresse}\n${fonction}`;
}

function buildEventSentence(
  birthDate: Date,
  currentDate: Date,
  scenario: LeaveScenarioConfig
): string {
  const date = formatDate(birthDate);

  if (scenario.id === 'adoption') {
    return `J'ai le plaisir de vous informer que mon enfant est arrivé au foyer le ${date}.`;
  }

  if (isAfter(startOfDay(birthDate), startOfDay(currentDate))) {
    return `J'ai le plaisir de vous informer que mon enfant doit naître le ${date}.`;
  }

  return `J'ai le plaisir de vous informer que mon enfant est né le ${date}.`;
}

function buildSupportDocumentSentence(
  birthDate: Date,
  currentDate: Date,
  scenario: LeaveScenarioConfig
): string {
  if (scenario.id === 'adoption') {
    return "Vous trouverez ci-joint le justificatif d'adoption ou d'arrivée au foyer de l'enfant.";
  }

  if (isAfter(startOfDay(birthDate), startOfDay(currentDate))) {
    return 'Vous trouverez ci-joint le certificat médical attestant la date prévue de la naissance.';
  }

  return "Vous trouverez ci-joint l'acte de naissance ou le livret de famille mis à jour.";
}

function buildPaternityParagraphs(input: GenerateEmployerLetterInput): string[] {
  const paragraphs: string[] = [];
  const isAdoption = input.scenario.id === 'adoption';
  const leaveName = isAdoption
    ? "congé lié à l'accueil de l'enfant"
    : "congé de paternité et d'accueil de l'enfant";
  const employerLabel = isAdoption
    ? "Congé lié à l'arrivée de l'enfant à la charge de l'employeur"
    : "Congé de naissance à la charge de l'employeur";

  paragraphs.push(
    `Pour cette occasion, je souhaite bénéficier du ${leaveName}, selon le planning suivant :`
  );

  if (input.employerPeriod) {
    paragraphs.push(
      `${employerLabel} : 3 jours ouvrables, du ${formatDate(input.employerPeriod.start)} au ${formatDate(input.employerPeriod.end)}.`
    );
  }

  if (input.mandatoryPeriod) {
    paragraphs.push(
      `Période obligatoire de 4 jours calendaires, ${formatPeriod(input.mandatoryPeriod)}.`
    );
  }

  if (input.remainingBlocks.length > 0) {
    const totalFractionableDays = input.scenario.fractionableDays;
    const totalPlacedDays = input.remainingBlocks.reduce(
      (sum, block) => sum + countCalendarDays(block.start, block.end),
      0
    );

    // When there's only one block covering all days, don't repeat the total
    if (input.remainingBlocks.length === 1 && totalPlacedDays >= totalFractionableDays) {
      paragraphs.push(
        `Période fractionnable de ${totalFractionableDays} jours calendaires, ${formatPeriod(input.remainingBlocks[0])}.`
      );
    } else {
      const blocks = input.remainingBlocks
        .map((block, index) => `Période ${index + 1} : ${formatPeriod(block)}.`)
        .join('\n');

      paragraphs.push(
        `Période fractionnable : ${totalFractionableDays} jours calendaires au total, répartis comme suit :\n${blocks}`
      );
    }
  } else {
    paragraphs.push(
      `Période fractionnable : ${input.scenario.fractionableDays} jours calendaires au total, dont les dates restent à préciser.`
    );
  }

  return paragraphs;
}

function buildSupplementaryParagraph(
  periods: LeaveBlock[],
  duration?: SupplementaryLeaveDuration,
  mode?: SupplementaryLeaveMode
): string | null {
  if (periods.length === 0) {
    return null;
  }

  const selectedDuration = duration ?? (periods.length > 1 ? 2 : 1);
  const durationText = selectedDuration === 1 ? "d'un mois" : 'de deux mois';
  const modeText =
    mode === 'split' && periods.length > 1
      ? "fractionné en deux périodes d'un mois chacune"
      : 'pris en une seule période';
  const periodLines = periods
    .map((period, index) => `Période ${index + 1} : ${formatPeriod(period)}.`)
    .join('\n');

  return [
    `Par ailleurs, conformément aux articles L. 1225-46-2 et suivants du Code du travail (LFSS 2026, art. 99-V), je souhaite bénéficier du congé supplémentaire de naissance pour une durée ${durationText}, ${modeText}.`,
    periodLines
  ].join('\n');
}

function buildNoticeParagraph(input: GenerateEmployerLetterInput, hasSupplementary: boolean): string {
  const isAdoption = input.scenario.id === 'adoption';
  const leaveName = isAdoption
    ? "du congé lié à l'accueil de l'enfant"
    : "du congé de paternité et d'accueil de l'enfant";

  let notice = `Conformément aux dispositions légales en vigueur, je vous informe au moins un mois avant le début ${leaveName}.`;

  if (hasSupplementary) {
    notice += ` Pour le congé supplémentaire de naissance, le délai de prévenance est d'un mois (ou de 15 jours en cas de succession immédiate avec le congé initial), conformément aux articles L. 1225-46-2 et suivants du Code du travail.`;
  }

  return notice;
}

export function generateEmployerLetter(input: GenerateEmployerLetterInput): string {
  const currentDate = input.currentDate ?? new Date();
  const supplementaryPeriods = input.supplementaryLeavePeriods ?? [];
  const paragraphs = [
    buildHeader(input.identity),
    'Madame, Monsieur,',
    buildEventSentence(input.birthDate, currentDate, input.scenario),
    ...buildPaternityParagraphs(input)
  ];

  const supplementaryParagraph = buildSupplementaryParagraph(
    supplementaryPeriods,
    input.supplementaryLeaveDuration,
    input.supplementaryLeaveMode
  );

  if (supplementaryParagraph) {
    paragraphs.push(supplementaryParagraph);
  }

  paragraphs.push(buildNoticeParagraph(input, Boolean(supplementaryParagraph)));

  paragraphs.push(
    buildSupportDocumentSentence(input.birthDate, currentDate, input.scenario),
    "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée."
  );

  return paragraphs.join('\n\n');
}
