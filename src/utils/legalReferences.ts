/**
 * Références légales officielles pour le congé de paternité et d'accueil de l'enfant en France.
 * 
 * Ce fichier centralise toutes les références aux textes de loi utilisés dans l'application.
 * Chaque référence inclut l'article précis, l'URL vers Légifrance, et une description.
 * 
 * @module legalReferences
 */

export interface LegalSource {
  type: 'code-travail' | 'code-secu' | 'loi' | 'decret' | 'service-public' | 'ameli';
  title: string;
  article?: string;
  url: string;
  description: string;
  dateApplication?: string;
}

/**
 * Article L1225-35 du Code du travail
 * 
 * Définit la durée du congé de paternité et d'accueil de l'enfant.
 * Applicable depuis le 1er juillet 2021 (LFSS 2021, article 73).
 */
export const ARTICLE_L1225_35: LegalSource = {
  type: 'code-travail',
  title: 'Durée du congé de paternité',
  article: 'Article L1225-35',
  url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923150',
  description: '25 jours calendaires pour naissance simple, 32 jours pour naissances multiples',
  dateApplication: '1er juillet 2021'
};

/**
 * Article L1225-35-1 du Code du travail
 * 
 * Définit les règles de fractionnement du congé :
 * - Période obligatoire de 4 jours
 * - Période fractionnable de 21 jours (ou 28 pour naissances multiples)
 * - Période fractionnable prise en 1 ou 2 périodes
 * - Minimum 5 jours calendaires par période en cas de fractionnement
 */
export const ARTICLE_L1225_35_1: LegalSource = {
  type: 'code-travail',
  title: 'Fractionnement du congé',
  article: 'Article L1225-35-1',
  url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923140',
  description: 'Période obligatoire de 4 jours + période fractionnable de 21 jours, en 1 ou 2 périodes. Minimum 5 jours en cas de fractionnement.',
  dateApplication: '1er juillet 2021'
};

/**
 * Article L1225-35-2 du Code du travail
 * 
 * Définit les délais de prise du congé :
 * - 6 mois pour naissances simples et multiples
 * - 12 mois en cas d'hospitalisation
 */
export const ARTICLE_L1225_35_2: LegalSource = {
  type: 'code-travail',
  title: 'Période de référence',
  article: 'Article L1225-35-2',
  url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923132',
  description: 'Congé à prendre dans les 6 mois (ou 12 mois en cas d\'hospitalisation)',
  dateApplication: '1er juillet 2021'
};

/**
 * Article L1225-35-3 du Code du travail
 * 
 * Définit le congé de naissance rémunéré par l'employeur :
 * - 3 jours ouvrables (lundi-samedi hors fériés)
 * - À la charge de l'employeur (pas la Sécurité sociale)
 */
export const ARTICLE_L1225_35_3: LegalSource = {
  type: 'code-travail',
  title: 'Congé de naissance',
  article: 'Article L1225-35-3',
  url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923122',
  description: '3 jours ouvrables rémunérés par l\'employeur (lundi-samedi hors fériés et dimanche)',
  dateApplication: '1er juillet 2021'
};

/**
 * Article L331-8 du Code de la sécurité sociale
 * 
 * Définit les modalités d'indemnisation du congé de paternité par la CPAM.
 */
export const ARTICLE_L331_8: LegalSource = {
  type: 'code-secu',
  title: 'Indemnisation du congé',
  article: 'Article L331-8',
  url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923074',
  description: 'Indemnités journalières versées par la CPAM pendant le congé',
  dateApplication: '1er juillet 2021'
};

/**
 * Loi n° 2020-1576 du 14 décembre 2020, article 73
 * 
 * Loi de financement de la sécurité sociale pour 2021 qui a allongé le congé
 * de paternité et d'accueil de l'enfant à compter du 1er juillet 2021.
 */
export const LFSS_2021: LegalSource = {
  type: 'loi',
  title: 'Allongement du congé de paternité',
  article: 'LFSS 2021 - loi n° 2020-1576 du 14 décembre 2020, article 73',
  url: 'https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000042665368',
  description: 'Allongement du congé de paternité et d’accueil de l’enfant, avec une période obligatoire de 4 jours.',
  dateApplication: '1er juillet 2021'
};

/**
 * Décret n° 2021-574 du 10 mai 2021
 * 
 * Décret d'application précisant les modalités du congé de paternité.
 */
export const DECRET_2021_574: LegalSource = {
  type: 'decret',
  title: 'Modalités d\'application',
  article: 'Décret n° 2021-574 du 10 mai 2021',
  url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043492531',
  description: 'Modalités d\'application du congé de paternité et d\'accueil de l\'enfant',
  dateApplication: '1er juillet 2021'
};

/**
 * Loi de financement de la sécurité sociale pour 2026 (article 99-V)
 *
 * Institue le congé supplémentaire de naissance, ouvert aux deux parents pour
 * tout enfant né ou adopté à partir du 1er janvier 2026, applicable au 1er juillet 2026.
 */
export const LFSS_2026: LegalSource = {
  type: 'loi',
  title: 'Création du congé supplémentaire de naissance',
  article: 'LFSS 2026 - Article 99-V',
  url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052832820',
  description:
    '1 à 2 mois indemnisés par parent (70% puis 60% du salaire net, dans la limite du plafond de la Sécurité sociale), pris après les congés de maternité, de paternité et d\'accueil ou d\'adoption. Fractionnable en deux périodes d\'un mois.',
  dateApplication: '1er juillet 2026'
};

/**
 * Articles L1225-46-2 à L1225-46-7 du Code du travail
 *
 * Encadrent le congé supplémentaire de naissance créé par la LFSS 2026 :
 * durée, fractionnement, conditions de prise, préavis, succession des congés.
 */
export const ARTICLE_L1225_46_2: LegalSource = {
  type: 'code-travail',
  title: 'Congé supplémentaire de naissance',
  article: 'Articles L1225-46-2 à L1225-46-7',
  url: 'https://www.legifrance.gouv.fr/codes/id/LEGIARTI000053271698',
  description:
    'Régime du congé supplémentaire de naissance : 1 à 2 mois par parent, fractionnable en 2 périodes d\'1 mois, pris simultanément ou en alternance, après les congés de maternité, de paternité et d\'accueil ou d\'adoption.',
  dateApplication: '1er juillet 2026'
};

/**
 * Service-Public.gouv.fr - Annonce officielle du congé supplémentaire 2026.
 */
export const SERVICE_PUBLIC_CONGE_SUPPLEMENTAIRE: LegalSource = {
  type: 'service-public',
  title: 'Annonce officielle du congé supplémentaire de naissance',
  url: 'https://www.service-public.gouv.fr/particuliers/actualites/A18750',
  description:
    'Présentation officielle du nouveau dispositif, des bénéficiaires (salariés, indépendants, agricoles, fonctionnaires, militaires) et des délais de prise.'
};

/**
 * Code du travail numérique - Synthèse du congé supplémentaire 2026.
 */
export const CODE_TRAVAIL_NUMERIQUE_CONGE_SUPPLEMENTAIRE: LegalSource = {
  type: 'service-public',
  title: 'Synthèse du congé supplémentaire au 1er juillet 2026',
  url: 'https://code.travail.gouv.fr/actualite/conge-de-naissance-supplementaire-ce-qui-change-au-1er-juillet-2026',
  description:
    'Délais de prise : 31 mars 2027 pour les naissances de janvier à juin 2026, 9 mois pour les naissances à partir de juillet 2026. Préavis 1 mois (15 jours en cas de succession immédiate).'
};

/**
 * Service-Public.fr - Congé de paternité
 * 
 * Guide pratique officiel sur le congé de paternité.
 */
export const SERVICE_PUBLIC_CONGE_PATERNITE: LegalSource = {
  type: 'service-public',
  title: 'Guide pratique du congé paternité',
  url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F3156',
  description: 'Informations pratiques sur les démarches et conditions du congé de paternité'
};

/**
 * Service-Public.fr - Définition des jours ouvrables/ouvrés
 * 
 * Définition officielle des différents types de jours.
 */
export const SERVICE_PUBLIC_JOURS: LegalSource = {
  type: 'service-public',
  title: 'Définition des jours ouvrables et ouvrés',
  url: 'https://www.service-public.fr/particuliers/vosdroits/F2258',
  description: 'Différence entre jours ouvrables, jours ouvrés et jours calendaires'
};

/**
 * Ameli.fr - Congé de paternité
 * 
 * Guide de l'Assurance Maladie sur le congé de paternité et les démarches.
 */
export const AMELI_CONGE_PATERNITE: LegalSource = {
  type: 'ameli',
  title: 'Démarches Assurance Maladie',
  url: 'https://www.ameli.fr/assure/droits-demarches/famille/maternite-paternite-adoption/conge-paternite-accueil-enfant',
  description: 'Démarches pour bénéficier des indemnités journalières'
};

/**
 * Toutes les sources légales utilisées dans l'application.
 */
export const ALL_LEGAL_SOURCES: LegalSource[] = [
  ARTICLE_L1225_35,
  ARTICLE_L1225_35_1,
  ARTICLE_L1225_35_2,
  ARTICLE_L1225_35_3,
  ARTICLE_L331_8,
  LFSS_2021,
  DECRET_2021_574,
  LFSS_2026,
  ARTICLE_L1225_46_2,
  SERVICE_PUBLIC_CONGE_PATERNITE,
  SERVICE_PUBLIC_CONGE_SUPPLEMENTAIRE,
  CODE_TRAVAIL_NUMERIQUE_CONGE_SUPPLEMENTAIRE,
  SERVICE_PUBLIC_JOURS,
  AMELI_CONGE_PATERNITE
];

/**
 * Récupère une source légale par son type.
 */
export function getLegalSourceByType(type: LegalSource['type']): LegalSource[] {
  return ALL_LEGAL_SOURCES.filter(source => source.type === type);
}

/**
 * Récupère la source légale d'un article spécifique.
 */
export function getLegalSourceByArticle(article: string): LegalSource | undefined {
  return ALL_LEGAL_SOURCES.find(source => source.article === article);
}
