import { useState } from 'react';
import { format } from 'date-fns';
import { Mail, Copy, Check } from 'lucide-react';
import { LeaveBlock } from '../utils/paternityLeave';

interface LetterGeneratorProps {
  birthDate: Date;
  employerPeriod: LeaveBlock | null;
  mandatoryPeriod: LeaveBlock | null;
  remainingBlocks: LeaveBlock[];
}

export function LetterGenerator({
  birthDate,
  mandatoryPeriod,
  remainingBlocks
}: LetterGeneratorProps) {
  const [lieu, setLieu] = useState('');
  const [dateRedaction, setDateRedaction] = useState(format(new Date(), 'dd/MM/yyyy'));
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [fonction, setFonction] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLetter = () => {
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

    letter += '\n\nVous trouverez ci-joint le certificat médical attestant la date prévue de la naissance.\n\nJe vous prie d\'agréer, Madame, Monsieur, l\'expression de ma considération distinguée.';

    return letter;
  };

  const handleCopy = async () => {
    const letter = generateLetter();
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg transition-apple-smooth">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-900 text-white">
          <Mail className="w-5 h-5" />
        </div>
        Courrier de demande
      </h2>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Lieu
            </label>
            <input
              type="text"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              placeholder="Paris"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-apple-smooth hover:border-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Date de rédaction
            </label>
            <input
              type="text"
              value={dateRedaction}
              onChange={(e) => setDateRedaction(e.target.value)}
              placeholder="01/01/2024"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-apple-smooth hover:border-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Jean"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-apple-smooth hover:border-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Dupont"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-apple-smooth hover:border-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Adresse
          </label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="123 Rue de la République, 75001 Paris"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-apple-smooth hover:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Fonction
          </label>
          <input
            type="text"
            value={fonction}
            onChange={(e) => setFonction(e.target.value)}
            placeholder="Développeur"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-apple-smooth hover:border-slate-400"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 mb-6">
        <pre className="whitespace-pre-wrap text-sm text-slate-800 font-mono leading-relaxed">
          {generateLetter()}
        </pre>
      </div>

      <button
        onClick={handleCopy}
        className="w-full px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl hover:shadow-xl transition-apple-smooth font-semibold flex items-center justify-center gap-3 active:scale-[0.98] hover:scale-[1.02]"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            Copié !
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            Copier le courrier
          </>
        )}
      </button>
    </div>
  );
}
