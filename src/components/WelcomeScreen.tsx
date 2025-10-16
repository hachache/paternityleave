import { Calendar, CheckCircle2, Clock, FileText } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl mb-6 shadow-lg shadow-teal-200/50 animate-bounce-slow">
            <Calendar className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-4 tracking-tight">
            Congé Paternité
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 font-medium mb-6 max-w-2xl mx-auto">
            Planifiez facilement vos 28 jours de congé paternité selon la législation française
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-100/80 to-slate-200/80 backdrop-blur-sm rounded-full border border-slate-300/50 shadow-sm">
            <span className="text-xs text-slate-600 font-medium">Outil gratuit • 100% conforme</span>
            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              • 2025
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-apple-smooth card-hover-3d animate-slide-up">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl mb-4 shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">28 jours au total</h3>
            <p className="text-sm text-slate-600">
              3 jours employeur + 4 jours obligatoires + 21 jours fractionnables à répartir librement
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-apple-smooth card-hover-3d animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl mb-4 shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Planification facile</h3>
            <p className="text-sm text-slate-600">
              Interface intuitive pour visualiser et organiser vos périodes de congé en quelques clics
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-apple-smooth card-hover-3d animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl mb-4 shadow-md">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Lettre automatique</h3>
            <p className="text-sm text-slate-600">
              Générez automatiquement votre demande de congé à envoyer à votre employeur
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-200/80 p-8 shadow-xl mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-teal-500" />
            Comment ça marche ?
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1">Indiquez la date de naissance</h4>
                <p className="text-sm text-slate-600">Cliquez sur le calendrier pour sélectionner la date de naissance de votre enfant</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1">Planifiez vos 21 jours fractionnables</h4>
                <p className="text-sm text-slate-600">Choisissez quand prendre vos jours : en une fois ou en 2 périodes (minimum 5 jours consécutifs par période)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1">Générez votre demande</h4>
                <p className="text-sm text-slate-600">Téléchargez une lettre prête à envoyer à votre employeur avec toutes les dates planifiées</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={onStart}
            className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-200/50 hover:shadow-2xl hover:shadow-teal-300/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            <span>Commencer la planification</span>
            <Calendar className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </button>

          <p className="text-xs text-slate-500 mt-4">
            Aucune inscription requise • Gratuit • Données privées
          </p>
        </div>

        {/* Made by */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-100/80 to-slate-200/80 backdrop-blur-sm rounded-full border border-slate-300/50 shadow-sm">
            <span className="text-xs text-slate-600 font-medium">Made with</span>
            <span className="text-red-500 animate-pulse-subtle text-base">❤️</span>
            <span className="text-xs text-slate-600 font-medium">by</span>
            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              Hedi ACHACHE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
