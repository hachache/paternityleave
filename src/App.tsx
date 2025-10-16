import { useState } from 'react';
import { startOfDay, isSameDay, isAfter, differenceInDays } from 'date-fns';
import { Calendar } from './components/Calendar';
import { Summary } from './components/Summary';
import { LegalInfo } from './components/LegalInfo';
import { LetterGenerator } from './components/LetterGenerator';
import { ScrollIndicator } from './components/ScrollIndicator';
import {
  calculateEmployerPeriod,
  calculateMandatoryPeriod,
  validateRemainingBlock,
  calculateAutomaticRemainingPeriod,
  calculateFractionnedPeriods,
  LeaveBlock
} from './utils/paternityLeave';

function App() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [employerPeriod, setEmployerPeriod] = useState<LeaveBlock | null>(null);
  const [mandatoryPeriod, setMandatoryPeriod] = useState<LeaveBlock | null>(null);
  const [remainingBlocks, setRemainingBlocks] = useState<LeaveBlock[]>([]);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectBirthDate = (date: Date) => {
    const normalized = startOfDay(date);
    setBirthDate(normalized);

    const employer = calculateEmployerPeriod(normalized);
    setEmployerPeriod(employer);

    const mandatory = calculateMandatoryPeriod(employer.end);
    setMandatoryPeriod(mandatory);

    setRemainingBlocks([]);
    setSelectionStart(null);
    setError(null);
  };

  const handleSelectRemainingDay = (date: Date) => {
    const normalized = startOfDay(date);
    setError(null);

    if (!selectionStart) {
      setSelectionStart(normalized);
      return;
    }

    if (isSameDay(normalized, selectionStart)) {
      setSelectionStart(null);
      return;
    }

    let start = selectionStart;
    let end = normalized;

    if (isAfter(start, end)) {
      [start, end] = [end, start];
    }

    if (!birthDate) return;

    const totalUsedDays = remainingBlocks.reduce((sum, block) =>
      sum + (differenceInDays(block.end, block.start) + 1), 0
    );

    const validation = validateRemainingBlock(
      start,
      end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      remainingBlocks,
      totalUsedDays
    );

    if (!validation.valid) {
      setError(validation.error || 'Bloc invalide');
      setSelectionStart(null);
      return;
    }

    const newBlock: LeaveBlock = {
      start,
      end,
      days: 0,
      type: 'remaining'
    };

    setRemainingBlocks([...remainingBlocks, newBlock]);
    setSelectionStart(null);
  };

  const handleReset = () => {
    setBirthDate(null);
    setEmployerPeriod(null);
    setMandatoryPeriod(null);
    setRemainingBlocks([]);
    setSelectionStart(null);
    setError(null);
  };

  const handleAutomaticPlanning = () => {
    if (!birthDate || !mandatoryPeriod) return;

    const totalUsedDays = remainingBlocks.reduce((sum, block) =>
      sum + (differenceInDays(block.end, block.start) + 1), 0
    );

    const daysLeft = 21 - totalUsedDays;
    if (daysLeft < 5) {
      setError('Il ne reste pas assez de jours disponibles pour créer un bloc (minimum 5 jours)');
      return;
    }

    const autoBlock = calculateAutomaticRemainingPeriod(birthDate, mandatoryPeriod.end, daysLeft);

    if (!autoBlock) {
      setError('Impossible de planifier automatiquement : la période dépasse les 6 mois après la naissance');
      return;
    }

    setRemainingBlocks([...remainingBlocks, autoBlock]);
    setError(null);
  };

  const handleFractionnedPlanning = (config: number[]) => {
    if (!birthDate || !mandatoryPeriod) return;

    const totalUsedDays = remainingBlocks.reduce((sum, block) =>
      sum + (differenceInDays(block.end, block.start) + 1), 0
    );

    if (totalUsedDays > 0) {
      setError('Veuillez d\'abord supprimer les blocs existants pour utiliser la planification fractionnée');
      return;
    }

    const blocks = calculateFractionnedPeriods(birthDate, mandatoryPeriod.end, config);

    if (blocks.length === 0) {
      setError('Impossible de planifier : la période dépasse les 6 mois après la naissance');
      return;
    }

    setRemainingBlocks(blocks);
    setError(null);
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = remainingBlocks.filter((_, i) => i !== index);
    setRemainingBlocks(newBlocks);
  };

  const handleClearAllBlocks = () => {
    setRemainingBlocks([]);
    setSelectionStart(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <header className="mb-10 text-center animate-fade-in">
          <h1 className="text-6xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
            Congé Paternité
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Planifiez votre congé selon la législation française
          </p>
        </header>

        <ScrollIndicator show={birthDate !== null} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake max-w-2xl mx-auto shadow-sm backdrop-blur-sm">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-8 max-w-2xl mx-auto">
          <Calendar
            birthDate={birthDate}
            onSelectBirthDate={handleSelectBirthDate}
            employerPeriod={employerPeriod}
            mandatoryPeriod={mandatoryPeriod}
            remainingBlocks={remainingBlocks}
            onSelectRemainingDay={handleSelectRemainingDay}
            selectionStart={selectionStart}
            onRemoveBlock={handleRemoveBlock}
          />
        </div>

        {birthDate && mandatoryPeriod && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-apple-smooth">
              <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse-subtle"></span>
                Planification automatique
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleAutomaticPlanning}
                  className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-apple-smooth hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Planifier les jours restants en un bloc</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500">ou</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-600 mb-2">Planifier en blocs fractionnés :</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleFractionnedPlanning([10, 11])}
                      className="px-3 py-2.5 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-300 hover:border-teal-400 rounded-lg text-sm font-medium transition-apple-smooth hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    >
                      2 blocs (10j + 11j)
                    </button>
                    <button
                      onClick={() => handleFractionnedPlanning([7, 7, 7])}
                      className="px-3 py-2.5 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-300 hover:border-teal-400 rounded-lg text-sm font-medium transition-apple-smooth hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    >
                      3 blocs (7j + 7j + 7j)
                    </button>
                  </div>
                </div>

                {remainingBlocks.length > 0 && (
                  <button
                    onClick={handleClearAllBlocks}
                    className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-lg text-sm font-medium transition-apple-smooth hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Effacer tous les blocs verts
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {birthDate && (
          <>
            <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
              <Summary
                birthDate={birthDate}
                employerPeriod={employerPeriod}
                mandatoryPeriod={mandatoryPeriod}
                remainingBlocks={remainingBlocks}
                onRemoveBlock={handleRemoveBlock}
              />
            </div>

            {mandatoryPeriod && (
              <div className="max-w-2xl mx-auto mb-8 animate-fade-in-delay">
                <LetterGenerator
                  birthDate={birthDate}
                  employerPeriod={employerPeriod}
                  mandatoryPeriod={mandatoryPeriod}
                  remainingBlocks={remainingBlocks}
                />
              </div>
            )}
          </>
        )}


        {birthDate && (
          <div className="text-center mt-6 max-w-2xl mx-auto animate-fade-in-delay">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 hover:shadow-md transition-apple text-sm font-medium active:scale-[0.96] hover:scale-[1.02]"
            >
              Réinitialiser
            </button>
          </div>
        )}

        <div className="mt-16 max-w-2xl mx-auto">
          <LegalInfo />
        </div>
      </div>
    </div>
  );
}

export default App;
