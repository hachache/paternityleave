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
    article: 'Article L1225-35 du Code du travail',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923150',
    description: '25 jours calendaires pour naissance simple, 32 jours pour naissances multiples',
    category: 'code-travail'
  },
  {
    title: 'Fractionnement du congé',
    article: 'Article L1225-35-1 du Code du travail',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923140',
    description: 'Période obligatoire de 4 jours + 21 jours fractionnables, en 1 ou 2 périodes. Minimum 5 jours par période en cas de fractionnement.',
    category: 'code-travail'
  },
  {
    title: 'Période de référence',
    article: 'Article L1225-35-2 du Code du travail',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923132',
    description: 'Congé à prendre dans les 6 mois suivant la naissance ou l’accueil, sauf report spécifique justifié',
    category: 'code-travail'
  },
  {
    title: 'Congé de naissance',
    article: 'Article L1225-35-3 du Code du travail',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923122',
    description: '3 jours ouvrables (lundi-samedi hors fériés) rémunérés par l\'employeur',
    category: 'code-travail'
  },
  {
    title: 'Indemnisation du congé',
    article: 'Article L331-8 du Code de la sécurité sociale',
    url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923074',
    description: 'Indemnités journalières versées par la CPAM pendant le congé de paternité',
    category: 'code-secu'
  },
  {
    title: 'Allongement du congé de paternité',
    article: 'LFSS 2021 - loi n° 2020-1576 du 14 décembre 2020, article 73',
    url: 'https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000042665368',
    description: 'Réforme entrée en vigueur le 1er juillet 2021 : 25 jours calendaires, dont 4 jours obligatoires.',
    category: 'code-travail'
  },
  {
    title: 'Modalités d’application 2021',
    article: 'Décret n° 2021-574 du 10 mai 2021',
    url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043492531',
    description: 'Décret relatif à l’allongement et à l’obligation de prise d’une partie du congé.',
    category: 'code-travail'
  },
  {
    title: 'Guide pratique du congé paternité',
    article: 'Service-Public.fr - Congé de paternité',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F3156',
    description: 'Informations pratiques sur les démarches et conditions du congé de paternité',
    category: 'service-public'
  },
  {
    title: 'Démarches Assurance Maladie',
    article: 'Ameli.fr - Congé paternité et d\'accueil',
    url: 'https://www.ameli.fr/assure/droits-demarches/famille/maternite-paternite-adoption/conge-paternite-accueil-enfant',
    description: 'Démarches pour bénéficier des indemnités journalières',
    category: 'ameli'
  }
];

const SUPPLEMENTARY_2026_REFERENCES: LegalReference[] = [
  {
    title: 'Création du congé supplémentaire de naissance',
    article: 'LFSS 2026 - Article 99-V',
    url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052832820',
    description:
      '1 à 2 mois indemnisés par parent (70% puis 60% du salaire net, dans la limite du plafond de la Sécurité sociale), pris après les congés de maternité, de paternité et d\'accueil ou d\'adoption. Fractionnable en 2 périodes d\'1 mois.',
    category: 'code-travail'
  },
  {
    title: 'Encadrement du nouveau congé',
    article: 'Articles L1225-46-2 à L1225-46-7 du Code du travail',
    url: 'https://www.legifrance.gouv.fr/codes/id/LEGIARTI000053271698',
    description:
      'Durée, fractionnement, prise simultanée ou en alternance entre parents, préavis (1 mois ou 15 jours en succession immédiate).',
    category: 'code-travail'
  },
  {
    title: 'Fiche secteur privé',
    article: 'Service-Public.fr - Salarié du secteur privé',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F39685',
    description:
      'Mise en œuvre à compter du 1er juillet 2026, avec respect du délai de prévenance auprès de l’employeur.',
    category: 'service-public'
  },
  {
    title: 'Fiche fonction publique',
    article: 'Service-Public.fr - Fonction publique',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F39693',
    description:
      'Demande possible à partir du 1er juin 2026 pour un bénéfice ouvert à partir du 1er juillet 2026.',
    category: 'service-public'
  },
  {
    title: 'Synthèse au 1er juillet 2026',
    article: 'Code du travail numérique',
    url: 'https://code.travail.gouv.fr/actualite/conge-de-naissance-supplementaire-ce-qui-change-au-1er-juillet-2026',
    description:
      'Délais de prise : jusqu\'au 31 mars 2027 pour les naissances de janvier à juin 2026, 9 mois pour les naissances à partir de juillet 2026.',
    category: 'service-public'
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
    url: 'https://www.service-public.fr/particuliers/vosdroits/F2258'
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
      return 'Code du travail';
    case 'code-secu':
      return 'Code de la sécurité sociale';
    case 'service-public':
      return 'Service-Public.fr';
    case 'ameli':
      return 'Assurance Maladie';
  }
}

function getCategoryColor(category: LegalReference['category']) {
  switch (category) {
    case 'code-travail':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'code-secu':
      return 'bg-slate-50 border-slate-200 text-slate-700';
    case 'service-public':
      return 'bg-green-50 border-green-200 text-green-700';
    case 'ameli':
      return 'bg-cyan-50 border-cyan-200 text-cyan-700';
  }
}

export function LegalReferences() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
          <Scale className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          Références légales
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Toutes les règles de calcul de cette application sont basées sur les textes de loi officiels français.
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-700" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-900">
              Application de la réforme 2021
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed">
              Cette application applique la <strong>loi n° 2020-1576 du 14 décembre 2020
              de financement de la sécurité sociale pour 2021, article 73</strong>, entrée
              en vigueur le 1er juillet 2021, et le <strong>décret n° 2021-574 du 10 mai
              2021</strong>. Toutes les règles implémentées sont conformes au Code du travail
              et au Code de la sécurité sociale en vigueur.
            </p>
          </div>
        </div>
      </div>

      {/* LFSS 2026 Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-700" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900">
              Nouveauté LFSS 2026 — Congé supplémentaire de naissance
            </h3>
            <p className="text-sm text-blue-900 leading-relaxed">
              La <strong>LFSS pour 2026 (article 99-V)</strong> crée un congé supplémentaire de naissance
              pour les enfants nés ou adoptés à partir du 1er janvier 2026. La demande peut être préparée
              à partir du <strong>1er juin 2026</strong>, avec un début effectif au plus tôt le
              <strong> 1er juillet 2026</strong>. Durée : 1 à 2 mois par parent, fractionnable en 2 périodes d&apos;1 mois,
              indemnisé à 70% du salaire net le premier mois et 60% le second, dans la limite du plafond
              de la Sécurité sociale.
            </p>
            <p className="text-xs text-blue-800 font-medium">
              Sous réserve de la publication des décrets d&apos;application. Codifié aux articles L1225-46-2
              à L1225-46-7 du Code du travail.
            </p>
          </div>
        </div>
      </div>

      {/* Supplementary leave 2026 references */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Congé supplémentaire de naissance 2026
        </h2>

        <div className="grid gap-4">
          {SUPPLEMENTARY_2026_REFERENCES.map((ref, index) => (
            <a
              key={index}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-5 border-2 rounded-xl transition-[border-color,background-color,box-shadow] duration-200 hover:shadow-md ${getCategoryColor(ref.category)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getCategoryIcon(ref.category)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
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

      {/* Legal References */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Congé de paternité (LFSS 2021)
        </h2>
        
        <div className="grid gap-4">
          {LEGAL_REFERENCES.map((ref, index) => (
            <a
              key={index}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-5 border-2 rounded-xl transition-[border-color,background-color,box-shadow] duration-200 hover:shadow-md ${getCategoryColor(ref.category)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getCategoryIcon(ref.category)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
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
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          Définitions des types de jours
        </h2>
        
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          {DEFINITIONS.map((def, index) => (
            <div
              key={index}
              className={`p-5 ${index !== DEFINITIONS.length - 1 ? 'border-b-2 border-gray-200' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {def.term}
                  </h3>
                  <a
                    href={def.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {def.definition}
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <p className="text-sm text-blue-900">
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
        <h2 className="text-2xl font-bold text-gray-900">
          Ressources Complémentaires
        </h2>
        
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Documentation Technique
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Pour une documentation complète des références légales, consultez le fichier LEGAL.md du projet.
              </p>
              <a
                href="https://github.com/yourusername/paternityleave/blob/main/LEGAL.md"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <BookOpen className="w-4 h-4" />
                Voir LEGAL.md
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <hr className="border-gray-300" />
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Sites Officiels
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.legifrance.gouv.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
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
                    className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
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
                    className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
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
      <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">
          Avertissement
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Cette application est un outil d'aide à la planification. Bien que basée sur les textes de loi officiels, 
          elle ne se substitue pas à un conseil juridique professionnel. En cas de doute, consultez votre employeur, 
          un représentant du personnel, ou la Direction Départementale de l'Emploi, du Travail et des Solidarités (DDETS).
        </p>
      </div>
    </div>
  );
}
