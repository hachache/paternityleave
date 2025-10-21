# Guide du Mainteneur : Références Légales

Ce guide explique comment maintenir et mettre à jour les références légales de l'application lorsque la législation change.

## 🚨 Quand Mettre à Jour ?

### Déclencheurs de Mise à Jour

1. **Loi de Finances** (annuelle, généralement décembre)
   - Peut modifier les durées de congé
   - Peut changer les modalités d'indemnisation

2. **Décrets d'Application**
   - Précisent les modalités pratiques
   - Publiés au Journal Officiel

3. **Jurisprudence Importante**
   - Arrêts de la Cour de Cassation
   - Décisions du Conseil d'État

4. **Circulaires Ministérielles**
   - Interprétations administratives officielles
   - Peuvent clarifier des ambiguïtés

### Où Surveiller les Changements ?

- **Légifrance Actualités** : https://www.legifrance.gouv.fr/actualite
- **Service-Public.fr Actualités** : https://www.service-public.fr/actualites
- **Flux RSS Journal Officiel** : https://www.legifrance.gouv.fr/rss

## 📝 Processus de Mise à Jour Complet

### Étape 1 : Identifier le Changement

```bash
# Vérifier la date de dernière modification des articles
# Sur Légifrance, chaque article affiche "Version en vigueur depuis..."
```

**Checklist** :
- [ ] Article de loi modifié identifié (ex: L1225-35)
- [ ] Date d'application connue
- [ ] Nature du changement comprise (durée, modalités, etc.)

### Étape 2 : Mettre à Jour LEGAL.md

Localiser la section concernée dans `LEGAL.md` et mettre à jour :

```markdown
#### Article L1225-35 - Durée du congé de paternité et d'accueil de l'enfant
**Source** : [Légifrance - Article L1225-35](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000XXXXXXXXX)

> [Nouveau texte de l'article]

**Durées applicables** :
- **XX jours calendaires** pour une naissance simple
- ...

**Historique** :
- Depuis [DATE] : [NOUVELLE DURÉE] (Loi n° XXXX-XXX)
- 1er juillet 2021 - 31 décembre 2024 : 25 jours (Loi n° 2021-953)
```

### Étape 3 : Mettre à Jour le Code Source

#### A. Constantes (`src/utils/paternityLeave.ts`)

Si les durées changent :

```typescript
export const LEAVE_SCENARIOS: Record<LeaveScenarioId, LeaveScenarioConfig> = {
  standard: {
    id: 'standard',
    label: 'Naissance simple',
    description: 'XX jours calendaires fractionnables...', // ← Modifier ici
    fractionableDays: XX, // ← Nouvelle valeur
    limitMonthsAfterBirth: 6
  },
  // ...
};
```

#### B. Commentaires JSDoc

Mettre à jour les commentaires avec la nouvelle référence :

```typescript
/**
 * Calcule la période de congé de naissance (employeur).
 * 
 * LEGISLATION : Article L1225-35-3 du Code du Travail (modifié par Loi XXXX-XXX)
 * - X jours ouvrables (nouvelle durée depuis [DATE])
 * - [Autres changements]
 * 
 * @param birthDate Date de naissance de l'enfant
 * @returns LeaveBlock représentant le congé employeur
 */
export function calculateEmployerPeriod(birthDate: Date): LeaveBlock {
  // ...
}
```

#### C. Module legalReferences.ts

Ajouter la nouvelle référence :

```typescript
export const LOI_XXXX_XXX: LegalSource = {
  type: 'loi',
  title: 'Modification du congé de paternité',
  article: 'Loi n° XXXX-XXX du [DATE]',
  url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXTXXXXXXXXXX',
  description: 'Description du changement',
  dateApplication: '[DATE]'
};

// Ajouter à ALL_LEGAL_SOURCES
export const ALL_LEGAL_SOURCES: LegalSource[] = [
  // ... existing sources
  LOI_XXXX_XXX // ← Nouvelle source
];
```

### Étape 4 : Mettre à Jour les Tests

#### A. Tests Unitaires

Modifier les tests si les valeurs changent :

```typescript
// src/utils/__tests__/paternityLeave.test.ts
describe('calculateEmployerPeriod', () => {
  it('calcule X jours ouvrables depuis [DATE]', () => { // ← Modifier le nombre
    const birthDate = new Date(2025, 0, 6);
    const period = calculateEmployerPeriod(birthDate);
    
    expect(period.days).toBe(X); // ← Nouvelle valeur
    // ...
  });
});
```

#### B. Tests de Validation

Si la logique change (ex: fractionnement différent) :

```typescript
describe('validateRemainingBlock', () => {
  it('valide les nouveaux critères de fractionnement', () => {
    // Nouveau test pour la nouvelle règle
  });
});
```

### Étape 5 : Mettre à Jour l'Interface

#### A. Composant LegalReferences

```typescript
// src/components/LegalReferences.tsx
const LEGAL_REFERENCES: LegalReference[] = [
  {
    title: 'Nouvelle modification',
    article: 'Loi n° XXXX-XXX',
    url: 'https://...',
    description: '...',
    category: 'code-travail'
  },
  // ... existing references
];
```

#### B. Composant LegalInfo

Mettre à jour les valeurs affichées si nécessaire.

### Étape 6 : Vérifier la Cohérence

```bash
# 1. Vérifier TypeScript
npm run typecheck

# 2. Lancer tous les tests
npm test

# 3. Build de production
npm run build

# 4. Tests manuels
npm run dev
# → Tester tous les scénarios dans l'interface
```

**Checklist de validation** :
- [ ] Tous les tests passent
- [ ] TypeScript compile sans erreur
- [ ] Build de production réussi
- [ ] Interface affiche les nouvelles valeurs
- [ ] Références légales accessibles et à jour
- [ ] Calculs corrects pour tous les scénarios

### Étape 7 : Documenter le Changement

#### A. CHANGELOG.md

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Mise à jour législative

- **BREAKING CHANGE** : Application de la Loi n° XXXX-XXX du [DATE]
- Modification de la durée du congé de paternité : [ANCIEN] → [NOUVEAU]
- Mise à jour des références légales dans LEGAL.md
- Référence : [URL Légifrance]

### Détails techniques

- Mise à jour de `LEAVE_SCENARIOS` dans `paternityLeave.ts`
- Ajout de `LOI_XXXX_XXX` dans `legalReferences.ts`
- Mise à jour des tests unitaires
```

#### B. README.md

Mettre à jour la section version :

```markdown
**Version législation** : Loi n° XXXX-XXX (applicable depuis [DATE])
```

#### C. docs/REFERENCES_LEGALES.md

Mettre à jour l'historique des versions :

```markdown
### Historique des Versions Législatives
- **Depuis [DATE]** : [NOUVELLE DURÉE] (Loi XXXX-XXX)
- 1er juillet 2021 - [DATE] : 25 jours (Loi 2021-953)
```

## 🧪 Tests de Non-Régression

### Scénarios à Tester Manuellement

1. **Naissance Simple**
   - [ ] Calcul correct de la période employeur
   - [ ] Calcul correct de la période obligatoire
   - [ ] Calcul correct des jours fractionnables
   - [ ] Validation des délais

2. **Naissances Multiples**
   - [ ] Bonus de jours correct
   - [ ] Fractionnement valide

3. **Hospitalisation**
   - [ ] Délai étendu appliqué
   - [ ] Jours bonus corrects

4. **Adoption**
   - [ ] Règles spécifiques appliquées

5. **Edge Cases**
   - [ ] Naissance un férié
   - [ ] Naissance un dimanche
   - [ ] Naissance fin d'année (chevauche 2 années)

### Script de Test Automatique

```typescript
// test-legal-update.ts
import { LEAVE_SCENARIOS } from './src/utils/paternityLeave';

console.log('🔍 Vérification des valeurs législatives...');
console.log(`Naissance simple : ${LEAVE_SCENARIOS.standard.fractionableDays} jours`);
console.log(`Naissances multiples : ${LEAVE_SCENARIOS['multiple-births'].fractionableDays} jours`);

// Ajouter les assertions attendues selon la nouvelle loi
```

## 📦 Déploiement de la Mise à Jour

### 1. Version Sémantique

Choisir le bon numéro de version :

- **MAJOR (X.0.0)** : Changement législatif incompatible (ex: modification de la structure des données)
- **MINOR (0.X.0)** : Nouvelle fonctionnalité législative (ex: nouveau type de congé)
- **PATCH (0.0.X)** : Correction d'interprétation, bugs

### 2. Git Tag

```bash
git add .
git commit -m "feat(legal): application Loi n° XXXX-XXX

- Modification durée congé paternité : XX → YY jours
- Mise à jour références légales
- Tests adaptés

BREAKING CHANGE: Nouvelle législation applicable depuis [DATE]

Ref: https://www.legifrance.gouv.fr/jorf/id/JORFTEXTXXXXXXXXXX"

git tag -a vX.Y.Z -m "Version X.Y.Z - Application Loi XXXX-XXX"
git push origin main --tags
```

### 3. Communication

**Message aux utilisateurs** :

```markdown
📢 Mise à jour législative

L'application a été mise à jour pour appliquer la **Loi n° XXXX-XXX du [DATE]**.

**Changements** :
- [Résumé du changement pour l'utilisateur]

**Impact** :
- Les planifications en cours restent valides
- Les nouvelles planifications utilisent les nouveaux paramètres

**Pour plus d'informations** :
- Consulter la section "Références légales" dans l'application
- Voir le CHANGELOG complet
```

## 🔧 Outils Utiles

### Alertes Législatives

Créer des alertes Google pour :
- "congé de paternité" + "loi"
- "L1225-35" + "modification"
- "Journal Officiel" + "congé paternité"

### Extensions Navigateur

- **Légifrance Monitor** : Suivi des modifications d'articles
- **RSS Reader** : Abonnement au JO

### Calendrier de Révision

```markdown
- **Janvier** : Vérification post-loi de finances
- **Avril** : Révision mi-année
- **Juillet** : Vérification pré-rentrée
- **Octobre** : Révision avant loi de finances
```

## 🆘 En Cas de Doute

### Qui Contacter ?

1. **DDETS locale** : Interprétation officielle
2. **Service juridique** : Si disponible
3. **Avocat spécialisé** : Pour cas complexes

### Principe de Précaution

En cas de doute sur l'interprétation :

```typescript
// ❌ NE PAS FAIRE : Interpréter à notre avantage
const days = uncertain ? MORE_DAYS : FEWER_DAYS;

// ✅ FAIRE : Choisir l'interprétation la plus stricte + documenter
const days = FEWER_DAYS; // TODO: Vérifier avec DDETS si MORE_DAYS applicable
```

Et ajouter un avertissement dans l'UI si nécessaire.

## 📋 Checklist Complète de Mise à Jour

- [ ] Changement législatif identifié et compris
- [ ] LEGAL.md mis à jour avec nouvelles références
- [ ] Constantes du code modifiées
- [ ] Commentaires JSDoc mis à jour
- [ ] Module legalReferences.ts complété
- [ ] Tests unitaires adaptés
- [ ] Tests manuels effectués
- [ ] Composant LegalReferences mis à jour
- [ ] CHANGELOG.md complété
- [ ] README.md mis à jour
- [ ] docs/REFERENCES_LEGALES.md mis à jour
- [ ] TypeScript compile
- [ ] Tous les tests passent
- [ ] Build de production OK
- [ ] Version sémantique choisie
- [ ] Git commit + tag créés
- [ ] Communication utilisateurs préparée
- [ ] Déploiement effectué

---

**Maintenu par** : L'équipe de développement  
**Dernière mise à jour** : Octobre 2024  
**Prochaine révision prévue** : Janvier 2025

