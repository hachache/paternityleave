import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface CelebrationModalProps {
  show: boolean;
  onClose: () => void;
}

export function CelebrationModal({ show, onClose }: CelebrationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      let closeTimer: NodeJS.Timeout;

      // Auto-fermer après 4 secondes
      const timer = setTimeout(() => {
        setIsVisible(false);
        closeTimer = setTimeout(onClose, 300); // Attendre la fin de l'animation
      }, 4000);

      return () => {
        clearTimeout(timer);
        if (closeTimer) clearTimeout(closeTimer);
      };
    }
  }, [show]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 px-4
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      <div
        className={`
          bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden
          transition-all duration-500
          ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti effect avec CSS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#10b981', '#f59e0b', '#0ea5e9'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>

        {/* Contenu */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full mb-4 animate-bounce-slow shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>

          <h3 className="text-3xl font-bold text-slate-900 mb-3 animate-slide-up">
            Félicitations ! 🎉
          </h3>

          <p className="text-slate-600 text-base mb-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Votre planning de congé paternité est complet
          </p>

          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 mt-4 border-2 border-emerald-200 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm font-semibold text-emerald-900">
              ✓ 28 jours planifiés avec succès
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              3 jours employeur + 4 jours obligatoires + 21 jours fractionnés
            </p>
          </div>

          <p className="text-xs text-slate-500 mt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Vous pouvez maintenant générer votre lettre pour l'employeur
          </p>

          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105 active:scale-95 w-full"
          >
            Super ! 👍
          </button>
        </div>
      </div>
    </div>
  );
}
