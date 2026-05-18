import { ExternalLink, Scale, BookOpen, FileText } from 'lucide-react';

interface LegalReference {
  title: string;
  article: string;
  url: string;
  description: string;
  category: 'code-travail' | 'code-secu' | 'service-public' | 'ameli';
}

const LEGAL_REFERENCES: LegalReference[] = [
  {
    title: 'Durée du congé de paternité',
    article: 'Article L1225-35 du Code du Travail',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923150',
    description: '25 jours calendaires pour naissance simple, 32 jours pour naissances multiples',
    category: 'code-travail'
  },
  {
    title: 'Fractionnement du congé',
    article: 'Article L1225-35-1 du Code du Travail',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923140',
    description: 'Période obligatoire de 4 jours + 21 jours fractionnables en 2 blocs minimum de 5 jours',
    category: 'code-travail'
  },
  {
    title: 'Période de référence',
    article: 'Article L1225-35-2 du Code du Travail',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923132',
    description: 'Congé à prendre dans les 6 mois suivant la naissance (12 mois en cas d\'hospitalisation)',
    category: 'code-travail'
  },
  {
    title: 'Congé de naissance',
    article: 'Article L1225-35-3 du Code du Travail',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923122',
    description: '3 jours ouvrables (lundi-samedi hors fériés) rémunérés par l\'employeur',
    category: 'code-travail'
  },
  {
    title: 'Congé supplémentaire de naissance',
    article: 'Articles L1225-46-2 à L1225-46-7 du Code du Travail',
    url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000053271681/',
    description: 'Nouveau droit 2026: 1 ou 2 mois, possible en deux périodes d’un mois',
    category: 'code-travail'
  },
  {
    title: 'Indemnisation du congé',
    article: 'Article L331-8 du Code de la Sécurité Sociale',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923074',
    description: 'Indemnités journalières versées par la CPAM pendant le congé de paternité',
    category: 'code-secu'
  },
  {
    title: 'Guide pratique du congé paternité',
    article: 'Service-Public.fr - Congé paternité (secteur privé)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F3156',
    description: 'Informations pratiques sur les démarches et conditions du congé de paternité',
    category: 'service-public'
  },
  {
    title: 'Actualité officielle 2026',
    article: 'Service-Public.fr - Création du congé supplémentaire',
    url: 'https://www.service-public.gouv.fr/particuliers/actualites/A18750',
    description: 'Détails de la mise en œuvre au 1er juillet 2026 et fenêtre transitoire',
    category: 'service-public'
  },
  {
    title: 'Démarches Assurance Maladie',
    article: 'Ameli.fr - Congé paternité et d\'accueil',
    url: 'https://www.ameli.fr/assure/droits-demarches/famille/maternite-paternite-adoption/conge-paternite-accueil-enfant',
    description: 'Démarches pour bénéficier des indemnités journalières',
    category: 'ameli'
  },
  {
    title: 'Congé supplémentaire (Assurance Maladie)',
    article: 'Ameli.fr - Congé supplémentaire de naissance',
    url: 'https://www.ameli.fr/assure/actualites/qu-est-ce-que-le-conge-supplementaire-de-naissance',
    description: 'Indemnisation (70% puis 60%), prévenance et délai de prise',
    category: 'ameli'
  }
];

const DEFINITIONS = [
  {
    term: 'Jours ouvrables',
    definition: 'Tous les jours de la semaine sauf dimanche et jours fériés (lundi-samedi hors fériés)',
    usage: 'Utilisé pour le congé de naissance (3 jours)',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F2258'
  },
  {
    term: 'Jours ouvrés',
    definition: 'Jours normalement travaillés dans l\'entreprise (généralement lundi-vendredi)',
    usage: 'Utilisé pour le comptage informatif des jours réellement travaillés',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F2258'
  },
  {
    term: 'Jours calendaires',
    definition: 'Tous les jours du calendrier, y compris weekends et jours fériés',
    usage: 'Utilisé pour les périodes obligatoire (4 jours) et fractionnable (21/28 jours)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F3156'
  }
];

function getCategoryIcon(category: LegalReference['category']) {
  switch (category) {
    case 'code-travail':
    case 'code-secu':
      return <Scale className="w-5 h-5" />;
    case 'service-public':
      return <BookOpen className="w-5 h-5" />;
    case 'ameli':
      return <FileText className="w-5 h-5" />;
  }
}

function getCategoryLabel(category: LegalReference['category']) {
  switch (category) {
    case 'code-travail':
      return 'Code du Travail';
    case 'code-secu':
      return 'Code de la Sécurité Sociale';
    case 'service-public':
      return 'Service Public';
    case 'ameli':
      return 'Assurance Maladie';
  }
}

function getCategoryColor(category: LegalReference['category']) {
  switch (category) {
    case 'code-travail':
      return 'bg-brand-50/35 border-brand-400/30 text-brand-700';
    case 'code-secu':
      return 'bg-violet-950/40 border-violet-500/30 text-violet-200';
    case 'service-public':
      return 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200';
    case 'ameli':
      return 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200';
  }
}

export function LegalReferences() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 text-[var(--muted)]">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50/50 rounded-full">
          <Scale className="w-8 h-8 text-brand-700" />
        </div>
        <h2 className="text-3xl font-bold text-[var(--text)]">
          Références Légales
        </h2>
        <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
          Toutes les règles de calcul de cette application sont basées sur les textes de loi officiels français.
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚖️</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-900">
              Base légale 2021 + évolution 2026
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed">
              Cette application applique la <strong>Loi n° 2021-953 du 19 juillet 2021</strong> qui a allongé 
              le congé de paternité de 11 à 25 jours calendaires. Toutes les règles implémentées sont conformes 
              au Code du Travail et au Code de la Sécurité Sociale en vigueur, avec intégration du
              <strong> congé supplémentaire de naissance introduit par la LFSS 2026</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Legal References */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text)] flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-brand-700" />
          Textes de Loi
        </h2>
        
        <div className="grid gap-4">
          {LEGAL_REFERENCES.map((ref, index) => (
            <a
              key={index}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-5 border-2 rounded-xl hover:shadow-md transition-all ${getCategoryColor(ref.category)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getCategoryIcon(ref.category)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[var(--text)]">
                        {ref.title}
                      </h3>
                      <p className="text-sm font-medium opacity-75">
                        {ref.article}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50" />
                  </div>
                  
                  <p className="text-sm leading-relaxed">
                    {ref.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-medium opacity-60">
                    <span>{getCategoryLabel(ref.category)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Definitions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text)] flex items-center gap-3">
          <FileText className="w-6 h-6 text-brand-700" />
          Définitions des Types de Jours
        </h2>
        
        <div className="bg-surface-100 border-2 border-white/10 rounded-xl overflow-hidden">
          {DEFINITIONS.map((def, index) => (
            <div
              key={index}
              className={`p-5 ${index !== DEFINITIONS.length - 1 ? 'border-b-2 border-white/10' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-[var(--text)] text-lg">
                    {def.term}
                  </h3>
                  <a
                    href={def.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 flex items-center gap-1 text-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <p className="text-[var(--muted)] leading-relaxed">
                  {def.definition}
                </p>
                
                <div className="bg-brand-50/35 border-l-4 border-brand-500 p-3 rounded">
                  <p className="text-sm text-brand-800">
                    <strong>Utilisé dans l'application :</strong> {def.usage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Resources */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text)]">
          Ressources Complémentaires
        </h2>
        
        <div className="bg-surface-50 border-2 border-white/10 rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">
                Documentation Technique
              </h3>
              <p className="text-sm text-[var(--muted)] mb-3">
                Pour une documentation complète des références légales, consultez le fichier LEGAL.md du projet.
              </p>
              <a
                href="https://github.com/yourusername/paternityleave/blob/main/LEGAL.md"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium"
              >
                <BookOpen className="w-4 h-4" />
                Voir LEGAL.md
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <hr className="border-white/20" />
            
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">
                Sites Officiels
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.legifrance.gouv.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                  >
                    Légifrance - Textes officiels
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.service-public.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                  >
                    Service-Public.fr - Informations pratiques
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ameli.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                  >
                    Ameli.fr - Assurance Maladie
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-surface-50 border-2 border-white/15 rounded-xl p-6">
        <h3 className="font-semibold text-[var(--text)] mb-2">
          Avertissement
        </h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Cette application est un outil d'aide à la planification. Bien que basée sur les textes de loi officiels, 
          elle ne se substitue pas à un conseil juridique professionnel. En cas de doute, consultez votre employeur, 
          un représentant du personnel, ou la Direction Départementale de l'Emploi, du Travail et des Solidarités (DDETS).
        </p>
      </div>
    </div>
  );
}
