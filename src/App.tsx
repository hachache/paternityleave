import { useState } from 'react';
import { startOfDay, differenceInDays, addDays } from 'date-fns';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSelectBirthDate = (date: Date) => {
    const normalized = startOfDay(date);
    setBirthDate(normalized);

    const employer = calculateEmployerPeriod(normalized);
    setEmployerPeriod(employer);

    const mandatory = calculateMandatoryPeriod(employer.end);
    setMandatoryPeriod(mandatory);

    setRemainingBlocks([]);
    setError(null);
  };

  const handleSelectRemainingDay = (date: Date) => {
    const normalized = startOfDay(date);
    setError(null);

    if (!birthDate || !mandatoryPeriod) return;

    // Calculer combien de jours restent à planifier
    const totalUsedDays = remainingBlocks.reduce((sum, block) =>
      sum + (differenceInDays(block.end, block.start) + 1), 0
    );
    const daysLeft = 21 - totalUsedDays;

    if (daysLeft === 0) {
      setError('Tous les 21 jours ont déjà été planifiés');
      return;
    }

    // Créer automatiquement un bloc avec les jours restants
    const autoBlock = calculateAutomaticRemainingPeriod(birthDate, normalized, daysLeft);

    if (!autoBlock) {
      setError('Impossible de planifier à partir de cette date : la période dépasse les 6 mois après la naissance');
      return;
    }

    // Vérifier qu'il n'y a pas de chevauchement
    const validation = validateRemainingBlock(
      autoBlock.start,
      autoBlock.end,
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      remainingBlocks,
      totalUsedDays
    );

    if (!validation.valid) {
      setError(validation.error || 'Bloc invalide');
      return;
    }

    setRemainingBlocks([...remainingBlocks, autoBlock]);
    setError(null);
  };

  const handleResetRequest = () => {
    if (!birthDate) return;
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    setBirthDate(null);
    setEmployerPeriod(null);
    setMandatoryPeriod(null);
    setRemainingBlocks([]);
    setError(null);
    setShowResetConfirm(false);
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
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

    // Utiliser le jour après la fin de la période obligatoire comme date de début
    const startDate = addDays(mandatoryPeriod.end, 1);
    const autoBlock = calculateAutomaticRemainingPeriod(birthDate, startDate, daysLeft);

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
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <header className="mb-12 text-center animate-fade-in relative">
          <button
            onClick={handleResetRequest}
            className={`absolute top-0 right-4 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-white hover:shadow-lg transition-apple-smooth text-sm font-semibold active:scale-[0.96] hover:scale-[1.02] border border-slate-300/50 flex items-center gap-2 ${!birthDate ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-fade-in'}`}
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>

          <button
            onClick={handleResetRequest}
            className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl mb-6 shadow-lg shadow-teal-200/50 transition-apple-smooth hover:shadow-xl hover:scale-105 active:scale-95 ${birthDate ? 'cursor-pointer' : 'cursor-default'}`}
            title={birthDate ? "Cliquer pour réinitialiser" : "Calendrier"}
          >
            <CalendarIcon className="w-10 h-10 text-white" />
          </button>

          <h1 className="text-6xl font-bold text-slate-900 mb-4 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            Congé Paternité
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Planifiez votre congé selon la législation française
          </p>
        </header>

        <ScrollIndicator show={birthDate !== null} />

        {/* Modal de confirmation de réinitialisation */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-spring-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-4">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Réinitialiser ?
                </h3>
                <p className="text-slate-600 text-sm">
                  Êtes-vous sûr de vouloir réinitialiser toute la planification ? Cette action ne peut pas être annulée.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResetCancel}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-apple-smooth hover:shadow-md active:scale-[0.98] hover:scale-[1.02]"
                >
                  Annuler
                </button>
                <button
                  onClick={handleResetConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-semibold transition-apple-smooth hover:shadow-lg active:scale-[0.98] hover:scale-[1.02]"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 rounded-2xl animate-shake max-w-2xl mx-auto shadow-md backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-red-800 text-sm font-medium flex-1">{error}</p>
            </div>
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
          <div className="text-center mt-8 max-w-2xl mx-auto animate-fade-in-delay">
            <button
              onClick={handleResetRequest}
              className="px-8 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-xl hover:from-slate-200 hover:to-slate-300 hover:shadow-lg transition-apple-smooth text-sm font-semibold active:scale-[0.96] hover:scale-[1.02] border border-slate-300/50 flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>
        )}

        <div className="mt-16 max-w-2xl mx-auto">
          <LegalInfo />
        </div>

        {/* Footer */}
        <footer className="mt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-100/80 to-slate-200/80 backdrop-blur-sm rounded-full border border-slate-300/50 shadow-sm hover:shadow-md transition-apple-smooth hover:scale-105">
            <span className="text-sm text-slate-600 font-medium">Made with</span>
            <span className="text-red-500 animate-pulse-subtle text-lg">❤️</span>
            <span className="text-sm text-slate-600 font-medium">by</span>
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              Hedi ACHACHE
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
