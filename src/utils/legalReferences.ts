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
 * Article L1225-35 du Code du Travail
 * 
 * Définit la durée du congé de paternité et d'accueil de l'enfant.
 * Applicable depuis le 1er juillet 2021 (Loi n° 2021-953).
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
 * Article L1225-35-1 du Code du Travail
 * 
 * Définit les règles de fractionnement du congé :
 * - Période obligatoire de 4 jours
 * - Période fractionnable de 21 jours (ou 28 pour naissances multiples)
 * - Fractionnement maximum en 2 blocs de 5 jours minimum chacun
 */
export const ARTICLE_L1225_35_1: LegalSource = {
  type: 'code-travail',
  title: 'Fractionnement du congé',
  article: 'Article L1225-35-1',
  url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923140',
  description: 'Période obligatoire de 4 jours + période fractionnable de 21 jours (minimum 5 jours par bloc)',
  dateApplication: '1er juillet 2021'
};

/**
 * Article L1225-35-2 du Code du Travail
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
 * Article L1225-35-3 du Code du Travail
 * 
 * Définit le congé de naissance rémunéré par l'employeur :
 * - 3 jours ouvrables (lundi-samedi hors fériés)
 * - À la charge de l'employeur (pas la Sécurité Sociale)
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
 * Article L331-8 du Code de la Sécurité Sociale
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
 * Loi n° 2021-953 du 19 juillet 2021
 * 
 * Loi qui a allongé le congé de paternité de 11 à 25 jours.
 * Cette loi a modifié les articles L1225-35 et suivants.
 */
export const LOI_2021_953: LegalSource = {
  type: 'loi',
  title: 'Allongement du congé de paternité',
  article: 'Loi n° 2021-953 du 19 juillet 2021',
  url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043802924',
  description: 'Loi financement de la sécurité sociale pour 2021 - Allongement du congé de paternité',
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
  url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043493135',
  description: 'Modalités d\'application du congé de paternité et d\'accueil de l\'enfant',
  dateApplication: '1er juillet 2021'
};

/**
 * Service-Public.fr - Congé de paternité
 * 
 * Guide pratique officiel sur le congé de paternité.
 */
export const SERVICE_PUBLIC_CONGE_PATERNITE: LegalSource = {
  type: 'service-public',
  title: 'Guide pratique du congé paternité',
  url: 'https://www.service-public.fr/particuliers/vosdroits/F583',
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
  LOI_2021_953,
  DECRET_2021_574,
  SERVICE_PUBLIC_CONGE_PATERNITE,
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

