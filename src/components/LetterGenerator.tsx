import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Mail, Copy, Check } from 'lucide-react';
import { LeaveBlock } from '../utils/paternityLeave';
import { Button } from './Button';

interface LetterGeneratorProps {
  birthDate: Date;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
  supplementaryPeriod: LeaveBlock | null;
}

export function LetterGenerator({ birthDate, mandatoryPeriod, remainingBlocks, supplementaryPeriod }: LetterGeneratorProps) {
  const [lieu, setLieu] = useState('');
  const [dateRedaction, setDateRedaction] = useState(format(new Date(), 'dd/MM/yyyy'));
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [fonction, setFonction] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const baseLetter = useMemo(() => {
    const birthDateFormatted = format(birthDate, 'dd/MM/yyyy');

    let letter = `${lieu}, le ${dateRedaction}\n${prenom} ${nom}\n${adresse}\n${fonction}\n\n\nMadame, Monsieur,\n\nJ'ai le plaisir de vous informer que mon enfant doit naître le ${birthDateFormatted}.\nPour cette occasion, je souhaite bénéficier du congé de paternité et d'accueil de l'enfant`;

    if (mandatoryPeriod) {
      const endDate = format(mandatoryPeriod.end, 'dd/MM/yyyy');
      letter += `\nà la suite du congé de naissance et jusqu'au ${endDate}`;
    }

    if (remainingBlocks.length > 0) {
      letter += '\n';
      remainingBlocks.forEach((block, index) => {
        const startDate = format(block.start, 'dd/MM/yyyy');
        const endDate = format(block.end, 'dd/MM/yyyy');
        if (index === 0) {
          letter += `\n\nPuis du ${startDate} au ${endDate} ;`;
        } else if (index === remainingBlocks.length - 1) {
          letter += `\n\nEt du ${startDate} au ${endDate}`;
        } else {
          letter += `\n\nPuis du ${startDate} au ${endDate} ;`;
        }
      });
    }

    if (supplementaryPeriod) {
      const startDate = format(supplementaryPeriod.start, 'dd/MM/yyyy');
      const endDate = format(supplementaryPeriod.end, 'dd/MM/yyyy');
      letter += `\n\nJe souhaite également bénéficier du congé supplémentaire de naissance du ${startDate} au ${endDate}.`;
    }

    letter += '\n\nVous trouverez ci-joint le certificat médical attestant la date prévue de la naissance.\n\nJe vous prie d\'agréer, Madame, Monsieur, l\'expression de ma considération distinguée.';

    return letter;
  }, [adresse, birthDate, dateRedaction, fonction, lieu, mandatoryPeriod, nom, prenom, remainingBlocks, supplementaryPeriod]);

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
    } catch (err) {
      setCopyError(true);
      setCopied(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-surface-100 p-6 sm:p-8 shadow-soft transition-all duration-300">
      <h2 className="text-2xl font-bold font-display text-[var(--text)] mb-8 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
          <Mail className="w-6 h-6" />
        </div>
        Courrier de demande
      </h2>

      <div className="space-y-8">
        {/* Formulaire */}
        <div className="space-y-6">
          <p className="text-sm text-[var(--muted)] font-medium">* Remplissez ces champs pour personnaliser le modèle</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Lieu</label>
              <input
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                placeholder="Paris"
                className="input-modern w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Date de rédaction</label>
              <input
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
              <label className="block text-xs font-bold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Jean"
                className="input-modern w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Dupont"
                className="input-modern w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Adresse</label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="123 Rue de la République, 75001 Paris"
              className="input-modern w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--muted)] mb-1.5 uppercase tracking-wide">Fonction</label>
            <input
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
          <div className="bg-surface-50 rounded-3xl p-4 sm:p-8 border border-white/10 shadow-inner">
            <div className="bg-[#f8f5ef] rounded-xl shadow-xl shadow-slate-950/25 p-8 sm:p-12 min-h-[400px] flex flex-col text-[#2d2b28] text-sm sm:text-base font-serif leading-relaxed relative overflow-hidden max-w-3xl mx-auto">
              {/* Grain texture overlay (subtle) */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.1\'/%3E%3C/svg%3E")' }}></div>
              
              <div className="relative z-10 whitespace-pre-line">
                {baseLetter}
              </div>
            </div>
          </div>
        </div>

        {copyError && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/30 animate-fade-in">
            <p className="text-sm text-red-100 font-medium">
              ❌ Impossible de copier. Sélectionnez le texte manuellement.
            </p>
          </div>
        )}

        <div className="relative">
          <Button
            onClick={handleCopy}
            variant="primary"
            size="lg"
            fullWidth
            icon={copied ? Check : Copy}
            iconPosition="left"
            className={`shadow-xl transition-all duration-300 py-4 ${copied ? 'bg-emerald-600 hover:bg-emerald-500' : 'hover:-translate-y-1'}`}
          >
            {copied ? 'Courrier copié !' : 'Copier le courrier'}
          </Button>
          {copied && (
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full hidden sm:block animate-fade-in">
               <span className="text-emerald-600 font-hand text-xl font-bold -rotate-12 inline-block">Prêt à envoyer ! ✉️</span>
               <svg className="w-8 h-8 text-emerald-400 absolute -left-6 top-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
