# Références Légales - Congé de Paternité et d'Accueil de l'Enfant

Ce document répertorie toutes les références légales utilisées dans cette application pour calculer et valider les congés de paternité et d'accueil de l'enfant en France.

## 📜 Textes de Loi Principaux

### Code du Travail

#### Article L1225-35 - Durée du congé de paternité et d'accueil de l'enfant
**Source** : [Légifrance - Article L1225-35](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923150)

> Le père salarié ainsi que, le cas échéant, le conjoint ou concubin salarié de la mère ou la personne salariée liée à elle par un pacte civil de solidarité bénéficient d'un congé de paternité et d'accueil de l'enfant de vingt-cinq jours calendaires.

**Durées applicables** :
- **25 jours calendaires** pour une naissance simple (3 + 4 + 18 jours fractionnables devenant 21 jours au total)
- **32 jours calendaires** pour une naissance multiple ou adoption multiple
- **35 jours calendaires** en cas d'hospitalisation de l'enfant

#### Article L1225-35-1 - Fractionnement du congé
**Source** : [Légifrance - Article L1225-35-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923140)

> Le congé prévu à l'article L. 1225-35 est fractionné en deux périodes :
> 
> 1° Une première période de quatre jours [...] doit être prise dans les six mois suivant la naissance ou l'arrivée au foyer de l'enfant ;
> 
> 2° Une seconde période de vingt et un jours [...] peut être fractionnée en deux périodes d'une durée minimale de cinq jours chacune.

**Règles de fractionnement** :
- **Période obligatoire** : 4 jours calendaires consécutifs
- **Période fractionnable** : 21 jours calendaires (ou 28 pour naissances multiples)
- **Fractionnement maximum** : 2 blocs de minimum 5 jours calendaires chacun
- **Délai de prise** : Dans les 6 mois suivant la naissance (12 mois pour hospitalisations)

#### Article L1225-35-2 - Période de référence
**Source** : [Légifrance - Article L1225-35-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923132)

> À défaut d'accord d'entreprise, la première période mentionnée au 1° de l'article L. 1225-35-1 est prise dans les six mois suivant la naissance ou l'arrivée au foyer de l'enfant.

**Délais légaux** :
- **Naissance simple** : 6 mois après la naissance
- **Hospitalisation** : 12 mois après la naissance (extension possible)

#### Article L1225-35-3 - Congé de naissance
**Source** : [Légifrance - Article L1225-35-3](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923122)

> Le salarié bénéficie également d'un congé de naissance de trois jours ouvrables.

**Détails** :
- **Durée** : 3 jours ouvrables (lundi à samedi, hors dimanches et jours fériés)
- **Prise** : À partir du jour de la naissance
- **Employeur** : Rémunéré par l'employeur (pas la Sécurité Sociale)

### Code de la Sécurité Sociale

#### Article L331-8 - Indemnisation
**Source** : [Légifrance - Article L331-8](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043923074)

> Le congé de paternité et d'accueil de l'enfant prévu à l'article L. 1225-35 du code du travail donne lieu au versement d'une indemnité journalière.

**Indemnisation** :
- Versée par la Sécurité Sociale (CPAM)
- Calculée sur la base du salaire journalier de base
- Plafonnée selon les règles de la Sécurité Sociale

## 📅 Définitions des Types de Jours

### Jours Ouvrables
**Source** : [Service-Public.fr - Jours ouvrables](https://www.service-public.fr/particuliers/vosdroits/F2258)

> Les jours ouvrables sont tous les jours de la semaine, à l'exception du jour de repos hebdomadaire (généralement le dimanche) et des jours fériés habituellement non travaillés dans l'entreprise.

**Application** :
- **Congé de naissance (3 jours)** : Jours ouvrables (lundi-samedi hors fériés)
- Utilisé dans : `calculateEmployerPeriod()`

### Jours Ouvrés
**Source** : [Service-Public.fr - Jours ouvrés](https://www.service-public.fr/particuliers/vosdroits/F2258)

> Les jours ouvrés sont les jours travaillés dans l'entreprise. En général, du lundi au vendredi (sauf si un autre jour de la semaine est le jour de repos hebdomadaire dans l'entreprise).

**Application** :
- Utilisé pour le comptage informatif des jours réellement travaillés
- Utilisé dans : `countWorkingDaysInRange()`, `analyzePeriod()`

### Jours Calendaires
**Source** : [Service-Public.fr - Congé paternité](https://www.service-public.fr/particuliers/vosdroits/F583)

> Le congé de paternité et d'accueil de l'enfant est de 25 jours calendaires (et non ouvrables).

**Application** :
- **Période obligatoire (4 jours)** : Jours calendaires consécutifs
- **Période fractionnable (21/28 jours)** : Jours calendaires (incluent weekends et fériés)
- Utilisé dans : `calculateMandatoryPeriod()`, `validateRemainingBlock()`

## 🎯 Scénarios Spécifiques

### 1. Naissance Simple
**Références** :
- Article L1225-35 du Code du Travail
- [Service-Public.fr - Congé paternité](https://www.service-public.fr/particuliers/vosdroits/F583)

**Décomposition** :
- 3 jours ouvrables (congé de naissance, employeur)
- 4 jours calendaires (période obligatoire)
- 21 jours calendaires (période fractionnable)
- **Total** : 28 jours dont 25 indemnisés par la CPAM

### 2. Naissance Multiple (jumeaux, triplés, etc.)
**Références** :
- Article L1225-35 du Code du Travail
- [Ameli.fr - Congé paternité naissances multiples](https://www.ameli.fr/assure/droits-demarches/famille/maternite-paternite-adoption/conge-paternite-accueil-enfant)

**Décomposition** :
- 3 jours ouvrables (congé de naissance, employeur)
- 4 jours calendaires (période obligatoire)
- 28 jours calendaires (période fractionnable, +7 jours)
- **Total** : 35 jours dont 32 indemnisés par la CPAM

### 3. Hospitalisation du Nouveau-né
**Références** :
- Article L1225-35-2 du Code du Travail (délai étendu à 12 mois)
- Décret n° 2021-574 du 10 mai 2021

**Spécificités** :
- Délai de prise étendu à **12 mois** (au lieu de 6)
- Jours fractionnables augmentés de **5 jours** (26 au lieu de 21 pour naissance simple)
- Application si hospitalisation immédiate en néonatologie ou réanimation

### 4. Adoption
**Références** :
- Article L1225-37 du Code du Travail
- [Service-Public.fr - Congé d'adoption](https://www.service-public.fr/particuliers/vosdroits/F2268)

**Décomposition** :
- 3 jours ouvrables (congé de naissance, employeur)
- 4 jours calendaires (période obligatoire)
- 21 ou 28 jours calendaires selon adoption simple ou multiple
- Délai : Dans les 6 mois suivant l'arrivée au foyer

## 🏛️ Jours Fériés Français

**Source** : [Service-Public.fr - Jours fériés](https://www.service-public.fr/particuliers/vosdroits/F2405)

### Jours Fériés Fixes
1. **1er janvier** - Jour de l'An
2. **1er mai** - Fête du Travail
3. **8 mai** - Victoire 1945
4. **14 juillet** - Fête Nationale
5. **15 août** - Assomption
6. **1er novembre** - Toussaint
7. **11 novembre** - Armistice 1918
8. **25 décembre** - Noël

### Jours Fériés Mobiles
9. **Lundi de Pâques** - Variable selon le calcul de Pâques (algorithme de Meeus/Jones/Butcher)
10. **Jeudi de l'Ascension** - 39 jours après Pâques
11. **Lundi de Pentecôte** - 50 jours après Pâques

**Algorithme de calcul de Pâques** :
- Implémentation : `getEasterDate()` dans `src/utils/holidays.ts`
- Basé sur l'algorithme de Meeus/Jones/Butcher (calcul grégorien)
- Source : [Calendrier Républicain - Calcul de Pâques](https://www.tontongeorges.net/paques.html)

## ⚖️ Règles de Validation

### Chevauchement des Périodes
**Principe légal** : Aucune règle explicite dans le Code du Travail sur les chevauchements, mais par logique administrative :
- Le congé de naissance et la période obligatoire se suivent
- Les blocs fractionnables ne peuvent pas chevaucher les périodes précédentes
- Les blocs fractionnables ne peuvent pas se chevaucher entre eux

**Implémentation** : `hasOverlap()`, `validateRemainingBlock()`

### Dates Antérieures à la Naissance
**Principe légal** : Article L1225-35-1 précise "suivant la naissance"
- Le congé de naissance commence le jour de la naissance (ou après)
- La période obligatoire suit le congé de naissance
- Les jours fractionnables sont pris "suivant la naissance"

**Implémentation** : Validation dans `validateRemainingBlock()`

### Délai Maximum de Prise
**Source** : Articles L1225-35-1 et L1225-35-2
- **6 mois** pour naissances simples et multiples
- **12 mois** pour hospitalisations et adoptions avec circonstances particulières

**Implémentation** : `getLimitDate()`, `getSixMonthsLimit()`

## 📚 Ressources Officielles

### Sites Gouvernementaux
1. **Légifrance** - Textes de loi officiels
   - [Code du Travail](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006195593/)
   - [Code de la Sécurité Sociale](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006073189/LEGISCTA000006156122/)

2. **Service-Public.fr** - Informations pratiques
   - [Congé de paternité et d'accueil](https://www.service-public.fr/particuliers/vosdroits/F583)
   - [Congé de naissance](https://www.service-public.fr/particuliers/vosdroits/F2266)

3. **Ameli.fr** - Assurance Maladie
   - [Démarches congé paternité](https://www.ameli.fr/assure/droits-demarches/famille/maternite-paternite-adoption/conge-paternite-accueil-enfant)

### Textes Historiques
- **Loi n° 2021-953 du 19 juillet 2021** - Allongement du congé de paternité (de 11 à 25 jours)
- **Décret n° 2021-574 du 10 mai 2021** - Modalités d'application
- **Ordonnance n° 2021-1676 du 17 décembre 2021** - Précisions sur le fractionnement

## 🔍 Cas Non Couverts par la Législation

### Ambiguïtés Résolues
1. **Samedi comme jour ouvrable** : Le samedi est considéré comme jour ouvrable (confirmation Service-Public.fr)
2. **Fériés tombant en weekend** : Comptent comme jours calendaires mais pas comme jours fériés pour le calcul des jours ouvrables
3. **Fractionnement** : Maximum 2 blocs de minimum 5 jours chacun (pas 3 blocs ou plus)

### Interprétations Appliquées
1. **Date limite de prise** : Le dernier jour du 6e mois après la naissance est inclus
2. **Chevauchement** : Validation stricte pour éviter les erreurs administratives
3. **Naissance un jour férié** : Le congé de naissance commence le jour ouvrable suivant

## 📝 Notes de Mise en Œuvre

### Principes de Développement
1. **Législation = Source de Vérité** : Toute règle doit avoir une référence légale explicite
2. **Prudence** : En cas de doute, l'application choisit l'interprétation la plus restrictive
3. **Documentation** : Chaque fonction critique a une JSDoc avec référence légale
4. **Tests** : Tous les scénarios légaux sont couverts par des tests unitaires

### Maintenance
- **Mise à jour législative** : Vérifier Légifrance tous les 6 mois
- **Cas particuliers** : Documenter toute nouvelle interprétation
- **Feedback utilisateurs** : Valider avec des cas réels

---

**Dernière mise à jour** : Octobre 2024  
**Version législation** : Loi n° 2021-953 du 19 juillet 2021  
**Auteur** : Application Congé Paternité

