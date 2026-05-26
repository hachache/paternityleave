import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Copy, Check } from 'lucide-react';
import { LeaveBlock, LeaveScenarioConfig } from '../utils/paternityLeave';
import { SupplementaryLeaveDuration, SupplementaryLeaveMode } from '../utils/supplementaryBirthLeave';
import { generateEmployerLetter } from '../utils/employerLetter';
import { Button } from './Button';
import { fadeIn, staggerContainer, useAppMotion } from '../lib/motion';

interface LetterGeneratorProps {
  birthDate: Date;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  scenario: LeaveScenarioConfig;
  supplementaryLeavePeriods?: LeaveBlock[];
  supplementaryLeaveDuration?: SupplementaryLeaveDuration;
  supplementaryLeaveMode?: SupplementaryLeaveMode;
}

export function LetterGenerator({
  birthDate,
  employerPeriod,
  mandatoryPeriod,
  remainingBlocks,
  scenario,
  supplementaryLeavePeriods,
  supplementaryLeaveDuration,
  supplementaryLeaveMode
}: LetterGeneratorProps) {
  const [lieu, setLieu] = useState('');
  const [dateRedaction, setDateRedaction] = useState(format(new Date(), 'dd/MM/yyyy'));
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [fonction, setFonction] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const { shouldReduce, transition } = useAppMotion();

  const baseLetter = useMemo(() => {
    return generateEmployerLetter({
      birthDate,
      employerPeriod,
      mandatoryPeriod,
      remainingBlocks,
      scenario,
      supplementaryLeavePeriods,
      supplementaryLeaveDuration,
      supplementaryLeaveMode,
      identity: {
        lieu,
        dateRedaction,
        nom,
        prenom,
        adresse,
        fonction
      }
    });
  }, [
    adresse,
    birthDate,
    dateRedaction,
    employerPeriod,
    fonction,
    lieu,
    mandatoryPeriod,
    nom,
    prenom,
    remainingBlocks,
    scenario,
    supplementaryLeaveDuration,
    supplementaryLeaveMode,
    supplementaryLeavePeriods
  ]);

  const previewLines = useMemo(() => baseLetter.split('\n'), [baseLetter]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    if (!copyError) return;
    const timeout = setTimeout(() => setCopyError(false), 3000);
    return () => clearTimeout(timeout);
  }, [copyError]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(baseLetter);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
      setCopied(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-soft transition-all duration-300">
      <h2 className="text-2xl font-bold font-display text-slate-900 mb-8 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
          <Mail className="w-6 h-6" />
        </div>
        Courrier de demande
      </h2>

      <div className="space-y-8">
        {/* Formulaire */}
        <div className="space-y-6">
          <p className="text-sm text-slate-500 font-medium">* Remplissez ces champs pour personnaliser le modèle</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="letter-lieu" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Lieu</label>
              <input
                id="letter-lieu"
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                placeholder="Paris"
                className="input-modern w-full"
              />
            </div>
            <div>
              <label htmlFor="letter-date-redaction" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Date de rédaction</label>
              <input
                id="letter-date-redaction"
                type="text"
                value={dateRedaction}
                onChange={(e) => setDateRedaction(e.target.value)}
                placeholder="01/01/2024"
                className="input-modern w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="letter-prenom" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Prénom</label>
              <input
                id="letter-prenom"
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Jean"
                className="input-modern w-full"
              />
            </div>
            <div>
              <label htmlFor="letter-nom" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nom</label>
              <input
                id="letter-nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Dupont"
                className="input-modern w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="letter-adresse" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Adresse</label>
            <input
              id="letter-adresse"
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="123 Rue de la République, 75001 Paris"
              className="input-modern w-full"
            />
          </div>

          <div>
            <label htmlFor="letter-fonction" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Fonction</label>
            <input
              id="letter-fonction"
              type="text"
              value={fonction}
              onChange={(e) => setFonction(e.target.value)}
              placeholder="Développeur"
              className="input-modern w-full"
            />
          </div>
        </div>

        {/* Prévisualisation "Papier" */}
        <div className="mt-8">
          <div className="bg-slate-100 rounded-3xl p-4 sm:p-8 border border-slate-200/60 shadow-inner">
            <div className="bg-white rounded-xl shadow-xl shadow-slate-300/20 p-8 sm:p-12 min-h-[400px] flex flex-col text-slate-800 text-sm sm:text-base font-serif leading-relaxed relative overflow-hidden max-w-3xl mx-auto">
              {/* Grain texture overlay (subtle) */}
              <div className="absolute inset-0 bg-slate-50 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.1\'/%3E%3C/svg%3E")' }}></div>
              
              <motion.div
                className="relative z-10 whitespace-pre-line"
                initial={shouldReduce ? false : 'hidden'}
                animate="visible"
                variants={staggerContainer(shouldReduce ? 0 : 0.03)}
              >
                {previewLines.map((line, index) => (
                  <motion.span
                    key={index}
                    className="block min-h-[1em]"
                    variants={fadeIn}
                    transition={shouldReduce ? { duration: 0 } : { duration: 0.2, delay: index * 0.03 }}
                  >
                    {line || '\u00a0'}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {copyError && (
          <motion.div
            className="p-4 rounded-xl border border-red-300 bg-red-50"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={transition}
          >
            <p className="text-sm text-red-800 font-medium">
              Impossible de copier. Sélectionnez le texte manuellement.
            </p>
          </motion.div>
        )}

        <div className="relative">
          <Button
            onClick={handleCopy}
            variant="primary"
            size="lg"
            fullWidth
            className={`shadow-xl transition-all duration-300 py-4 ${copied ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-1'}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied-icon"
                  initial={shouldReduce ? false : { opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={shouldReduce ? { duration: 0 } : { duration: 0.15 }}
                >
                  <Check className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy-icon"
                  initial={shouldReduce ? false : { opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={shouldReduce ? { duration: 0 } : { duration: 0.15 }}
                >
                  <Copy className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
            {copied ? 'Courrier copié !' : 'Copier le courrier'}
          </Button>
        </div>
      </div>
    </div>
  );
}
