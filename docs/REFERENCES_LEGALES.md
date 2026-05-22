# Guide d'utilisation des références légales

Cette application de planification du congé de paternité est entièrement basée sur les textes de loi français en vigueur.

## 📚 Documentation Disponible

### 1. **LEGAL.md** (Documentation complète)
Fichier principal contenant :
- Toutes les références aux textes de loi
- Définitions détaillées des types de jours
- Explications des scénarios spécifiques
- Liens vers les sources officielles

📍 Emplacement : `/LEGAL.md` à la racine du projet

### 2. **Interface Utilisateur** (Composant LegalReferences)
Page dédiée dans l'application affichant :
- Liste des articles du Code du travail appliqués
- Liens directs vers Légifrance et Service-Public.fr
- Définitions interactives des types de jours
- Avertissement légal

🔗 Accessible via le bouton "Consulter toutes les références légales" dans la section "Cadre légal"

### 3. **Module TypeScript** (legalReferences.ts)
Export programmatique des sources légales :
```typescript
import { ARTICLE_L1225_35, ALL_LEGAL_SOURCES } from './utils/legalReferences';

// Accès à une référence spécifique
console.log(ARTICLE_L1225_35.url);
// → https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923150

// Filtrer par type
const codesduTravail = getLegalSourceByType('code-travail');
```

📍 Emplacement : `/src/utils/legalReferences.ts`

## 🔍 Traçabilité des Règles

Chaque fonction critique du code contient des commentaires JSDoc référençant les articles de loi :

### Exemple dans `paternityLeave.ts`
```typescript
/**
 * Calcule la période de congé de naissance (employeur).
 *
 * LEGISLATION : Article L1225-35-3 du Code du travail
 * - 3 jours ouvrables (lundi-samedi hors fériés et dimanche)
 * - Rémunérés par l'employeur (pas la Sécurité sociale)
 * - Peuvent commencer le jour de la naissance
 *
 * @param birthDate Date de naissance de l'enfant
 * @returns LeaveBlock représentant les 3 jours de congé employeur
 */
export function calculateEmployerPeriod(birthDate: Date): LeaveBlock {
  // ...
}
```

### Exemple dans `holidays.ts`
```typescript
/**
 * Vérifie si une date est un jour ouvré.
 *
 * DEFINITION LEGALE : Service-Public.fr
 * "Jours ouvrés = jours travaillés dans l'entreprise (généralement lun-ven)"
 *
 * @param date Date à vérifier
 * @returns true si le jour est ouvré (lun-ven hors fériés)
 */
export function isWorkingDay(date: Date): boolean {
  // ...
}
```

## 📖 Textes de Loi Principaux

### Congé de paternité et d'accueil de l'enfant (LFSS 2021)

| Article | Objet | URL |
|---------|-------|-----|
| **L1225-35** | Durée du congé (25 jours) | [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923150) |
| **L1225-35-1** | Fractionnement (4j + 21j) | [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923140) |
| **L1225-35-2** | Délai de prise (6 mois) | [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923132) |
| **L1225-35-3** | Congé naissance (3j) | [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923122) |
| **L331-8** | Indemnisation CPAM | [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923074) |
| **LFSS 2021, art. 73** | Allongement du congé de paternité | [Légifrance](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000042665368) |
| **Décret n° 2021-574** | Modalités d'application | [Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043492531) |

### Congé supplémentaire de naissance (LFSS 2026)

| Référence | Objet | URL |
|-----------|-------|-----|
| **LFSS 2026, art. 99-V** | Création du dispositif | [Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052832820) |
| **L1225-46-2 à L1225-46-7** | Régime applicable (Code du travail) | [Légifrance](https://www.legifrance.gouv.fr/codes/id/LEGIARTI000053271698) |
| **Service-Public.gouv.fr** | Annonce officielle | [service-public.gouv.fr](https://www.service-public.gouv.fr/particuliers/actualites/A18750) |
| **Code du travail numérique** | Synthèse au 1er juillet 2026 | [code.travail.gouv.fr](https://code.travail.gouv.fr/actualite/conge-de-naissance-supplementaire-ce-qui-change-au-1er-juillet-2026) |

#### Caractéristiques retenues par l'application
- **Bénéficiaires** : salariés, indépendants, non-salariés agricoles, fonctionnaires, militaires.
- **Enfants concernés** : nés ou adoptés à partir du **1er janvier 2026**.
- **Entrée en vigueur** : **1er juillet 2026**, sous réserve des décrets d'application.
- **Durée** : 1 à 2 mois par parent.
- **Fractionnement** : 2 périodes d'1 mois disjointes possibles.
- **Indemnisation** : 70% du salaire net le premier mois, 60% le second, dans la limite du plafond de la Sécurité sociale.
- **Délai de prise** :
  - Naissances entre janvier et juin 2026 → jusqu'au **31 mars 2027**.
  - Naissances à partir de juillet 2026 → **9 mois** suivant la naissance (prolongé pour naissances multiples).
- **Préavis** : 1 mois avant le début du congé, ramené à 15 jours en cas de succession immédiate.

## 🎯 Méthode de Validation

### 1. Sources Officielles
- **Légifrance** : Version consolidée des codes
- **Service-Public.fr** : Interprétation administrative officielle
- **Ameli.fr** : Application pratique pour la CPAM

### 2. Cohérence Interne
Toute règle implémentée doit :
- ✅ Avoir une référence légale explicite
- ✅ Être documentée dans LEGAL.md
- ✅ Être testée par des tests unitaires
- ✅ Être expliquée dans l'interface utilisateur

### 3. Prudence en Cas de Doute
Principe appliqué : En cas d'ambiguïté législative, l'application choisit l'interprétation **la plus restrictive** pour éviter toute erreur préjudiciable à l'utilisateur.

Exemple : Le samedi est bien un jour ouvrable selon Service-Public.fr, donc inclus dans les 3 jours de congé de naissance.

## 🔄 Maintenance et Mises à Jour

### Fréquence de Révision
- **Tous les 6 mois** : Vérification de l'actualité des textes sur Légifrance
- **À chaque loi de finances** : Les congés familiaux peuvent être modifiés
- **Sur feedback utilisateur** : Correction si cas pratique non couvert

### Processus de Mise à Jour
1. Identifier le changement législatif
2. Mettre à jour LEGAL.md avec la nouvelle référence
3. Modifier le code avec commentaire de version
4. Ajouter/modifier les tests unitaires
5. Mettre à jour le composant LegalReferences
6. Informer les utilisateurs via changelog

### Historique des Versions Législatives
- **Avant 1er juillet 2021** : Congé de 11 jours (ancienne loi)
- **Depuis 1er juillet 2021** : Congé de 25 jours (loi n° 2020-1576 du 14 décembre 2020, article 73, et décret n° 2021-574 du 10 mai 2021)
- **À partir du 1er juillet 2026** : Création du congé supplémentaire de naissance (LFSS 2026, art. 99-V) — 1 à 2 mois indemnisés par parent, ouvert aux salariés du privé, indépendants, agricoles, fonctionnaires et militaires
  - Application actuelle : **version 2026 (paternité 2021 + supplémentaire 2026)**

## ⚠️ Limitations Connues

### Cas Non Couverts par l'Application
1. **Conventions collectives dérogatoires** : Certaines conventions peuvent prévoir des durées supérieures
2. **Accords d'entreprise spécifiques** : L'employeur peut améliorer le dispositif légal
3. **Situations internationales** : Naissance à l'étranger, travail transfrontalier
4. **Régimes spéciaux** : Fonction publique, travailleurs indépendants

### Recommandation
En cas de situation particulière, **consulter** :
- Un représentant du personnel (CSE, délégué syndical)
- La Direction Départementale de l'Emploi (DDETS)
- Un avocat spécialisé en droit social

## 📞 Contacts Utiles

### Administrations
- **DDETS** (ex-DIRECCTE) : Inspection du travail locale
- **CPAM** : Assurance Maladie pour indemnisation
- **Service-Public.fr** : 3939 (numéro national)

### Ressources en Ligne
- **Légifrance** : https://www.legifrance.gouv.fr
- **Service-Public.fr** : https://www.service-public.fr
- **Ameli.fr** : https://www.ameli.fr

## 📝 Contribuer

Si vous identifiez :
- Une erreur dans l'interprétation de la loi
- Un changement législatif non pris en compte
- Un cas d'usage non couvert

Merci de créer une issue sur le dépôt avec :
- Référence précise (article + URL Légifrance)
- Description du problème ou de la lacune
- Cas d'usage concret si applicable

---

**Dernière révision** : Mai 2026

**Version législation** : LFSS 2021, art. 73 (1er juillet 2021) + LFSS 2026, art. 99-V (entrée en vigueur 1er juillet 2026)

**Prochaine révision prévue** : à la publication des décrets d'application du congé supplémentaire de naissance
