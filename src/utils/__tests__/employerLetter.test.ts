import { addDays, startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { generateEmployerLetter, EmployerLetterIdentity } from '../employerLetter';
import {
  LEAVE_SCENARIOS,
  LeaveBlock,
  calculateEmployerPeriod,
  calculateMandatoryPeriod
} from '../paternityLeave';
import { calculateSupplementaryLeavePeriod } from '../supplementaryBirthLeave';

const identity: EmployerLetterIdentity = {
  lieu: 'Paris',
  dateRedaction: '22/05/2026',
  prenom: 'Jean',
  nom: 'Dupont',
  adresse: '1 rue Exemple, 75001 Paris',
  fonction: 'Développeur'
};

function remainingBlock(startDate: Date, days: number): LeaveBlock {
  const start = startOfDay(startDate);
  return {
    start,
    end: addDays(start, days - 1),
    days,
    type: 'remaining'
  };
}

function baseInput(overrides: Partial<Parameters<typeof generateEmployerLetter>[0]> = {}) {
  const birthDate = startOfDay(new Date(2026, 6, 1));
  const employerPeriod = calculateEmployerPeriod(birthDate);
  const mandatoryPeriod = calculateMandatoryPeriod(employerPeriod.end);

  return {
    birthDate,
    currentDate: startOfDay(new Date(2026, 4, 22)),
    employerPeriod,
    mandatoryPeriod,
    remainingBlocks: [remainingBlock(addDays(mandatoryPeriod.end, 1), 21)],
    scenario: LEAVE_SCENARIOS.standard,
    identity,
    ...overrides
  };
}

describe('generateEmployerLetter', () => {
  it('génère un courrier clair pour une naissance future standard avec 21 jours fractionnables', () => {
    const letter = generateEmployerLetter(baseInput());

    expect(letter).toContain('mon enfant doit naître le 01/07/2026');
    expect(letter).toContain("Congé de naissance à la charge de l'employeur : 3 jours ouvrables");
    expect(letter).toContain('Période obligatoire : 4 jours calendaires, du 04/07/2026 au 07/07/2026, soit 4 jours calendaires.');
    expect(letter).toContain('Période fractionnable : 21 jours calendaires au total.');
    expect(letter).toContain('Période fractionnable 1 : du 08/07/2026 au 28/07/2026, soit 21 jours calendaires.');
    expect(letter).toContain('certificat médical attestant la date prévue de la naissance');
  });

  it('adapte le vocabulaire et le justificatif pour une naissance passée', () => {
    const birthDate = startOfDay(new Date(2026, 0, 12));
    const employerPeriod = calculateEmployerPeriod(birthDate);
    const mandatoryPeriod = calculateMandatoryPeriod(employerPeriod.end);

    const letter = generateEmployerLetter(
      baseInput({
        birthDate,
        currentDate: startOfDay(new Date(2026, 4, 22)),
        employerPeriod,
        mandatoryPeriod,
        remainingBlocks: [remainingBlock(addDays(mandatoryPeriod.end, 1), 21)]
      })
    );

    expect(letter).toContain('mon enfant est né le 12/01/2026');
    expect(letter).toContain("l'acte de naissance ou le livret de famille mis à jour");
    expect(letter).not.toContain('doit naître');
  });

  it('affiche 28 jours calendaires pour une naissance multiple', () => {
    const mandatoryPeriod = baseInput().mandatoryPeriod;
    const letter = generateEmployerLetter(
      baseInput({
        scenario: LEAVE_SCENARIOS['multiple-births'],
        remainingBlocks: [remainingBlock(addDays(mandatoryPeriod.end, 1), 28)]
      })
    );

    expect(letter).toContain('Période fractionnable : 28 jours calendaires au total.');
    expect(letter).toContain('soit 28 jours calendaires.');
  });

  it('affiche le congé supplémentaire 2026 en 1 mois seulement quand il est configuré', () => {
    const supplementary = calculateSupplementaryLeavePeriod(new Date(2026, 7, 1), 1);
    const letter = generateEmployerLetter(
      baseInput({
        supplementaryLeavePeriods: [supplementary],
        supplementaryLeaveDuration: 1,
        supplementaryLeaveMode: 'consecutive'
      })
    );

    expect(letter).toContain("congé supplémentaire de naissance");
    expect(letter).toContain("bénéficier d'un mois de congé supplémentaire de naissance, pris en une seule fois");
    expect(letter).toContain('Période supplémentaire 1 : du 01/08/2026 au 31/08/2026, soit 31 jours calendaires.');
    expect(letter).toContain('le délai de prévenance applicable est fixé par les textes entre 15 jours et 1 mois');
  });

  it("affiche le congé supplémentaire 2026 en 2 mois fractionnés", () => {
    const first = calculateSupplementaryLeavePeriod(new Date(2026, 7, 1), 1);
    const second = calculateSupplementaryLeavePeriod(new Date(2026, 9, 1), 1);
    const letter = generateEmployerLetter(
      baseInput({
        supplementaryLeavePeriods: [first, second],
        supplementaryLeaveDuration: 2,
        supplementaryLeaveMode: 'split'
      })
    );

    expect(letter).toContain("bénéficier de 2 mois de congé supplémentaire de naissance, fractionné en 2 périodes d'un mois");
    expect(letter).toContain('Période supplémentaire 1 : du 01/08/2026 au 31/08/2026, soit 31 jours calendaires.');
    expect(letter).toContain('Période supplémentaire 2 : du 01/10/2026 au 31/10/2026, soit 31 jours calendaires.');
  });

  it('corrige la ponctuation pour un seul bloc et plusieurs blocs', () => {
    const oneBlockLetter = generateEmployerLetter(baseInput());
    const twoBlocksLetter = generateEmployerLetter(
      baseInput({
        remainingBlocks: [
          remainingBlock(new Date(2026, 6, 8), 10),
          remainingBlock(new Date(2026, 8, 1), 11)
        ]
      })
    );

    expect(oneBlockLetter).not.toContain(' ;');
    expect(twoBlocksLetter).not.toContain(' ;');
    expect(twoBlocksLetter).toContain('Période fractionnable 1');
    expect(twoBlocksLetter).toContain('Période fractionnable 2');
  });

  it("n'affiche pas la mention 2026 quand le congé supplémentaire n'est pas activé", () => {
    const letter = generateEmployerLetter(baseInput());

    expect(letter).not.toContain('LFSS 2026');
    expect(letter).not.toContain('Période supplémentaire');
  });

  it('utilise des placeholders explicites quand les champs utilisateur sont vides', () => {
    const letter = generateEmployerLetter(
      baseInput({
        identity: {
          lieu: '',
          dateRedaction: '',
          prenom: '',
          nom: '',
          adresse: '',
          fonction: ''
        }
      })
    );

    expect(letter.startsWith('[Lieu], le [Date de rédaction]')).toBe(true);
    expect(letter).toContain('[Prénom] [Nom]');
    expect(letter).toContain('[Adresse]');
    expect(letter).toContain('[Fonction]');
  });
});
