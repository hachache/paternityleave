# CORRECTIONS APPORTÉES

## Phase 1 : CLARIFICATION CALENDAIRES vs OUVRABLES ✅

### Problème identifié
Le code utilisait `isWorkingDay()` (jours ouvrés = lundi-vendredi) pour calculer la période employeur, alors que la législation française exige des jours **ouvrables** (lundi-samedi).

### Solution implémentée
1. Création de `isWorkableDay()` dans `src/utils/holidays.ts`
2. Modification de `calculateEmployerPeriod()` pour utiliser les jours ouvrables
3. Documentation complète avec références légales (Article L1225-65)
4. Clarification UI : distinction explicite entre ouvrables/calendaires

### Résultat
- ✅ 31 tests passent (holidays + paternityLeave)
- ✅ Conforme à la législation depuis 1er juillet 2021
- ✅ Naissance un samedi = samedi compte comme jour 1 (correct légalement)

---

## Phase 2 : VALIDATION DATE NAISSANCE ✅

### Problème identifié
L'ancienne validation :
- ❌ Acceptait n'importe quelle date future (même dans 10 ans)
- ❌ Rejetait toutes les dates passées
- ❌ Pas de gestion des cas réalistes (naissance déjà survenue)

### Solution implémentée

#### 1. Nouveau fichier : `src/utils/dateValidation.ts`

```typescript
validateBirthDate(date: Date): BirthDateValidationResult
```

**Règles de validation :**

| Cas | Limite | Action |
|-----|--------|--------|
| Date future | ≤ 9 mois | ✅ Accepte |
| Date future | > 9 mois | ❌ Rejette (dépasse durée grossesse) |
| Date = Aujourd'hui | - | ✅ Accepte sans avertissement |
| Date passée récente | < 6 mois | ✅ Accepte avec avertissement |
| Date passée ancienne | 6-12 mois | ✅ Accepte avec avertissement délai |
| Date passée trop ancienne | > 1 an | ❌ Rejette (délai légal dépassé) |

#### 2. Intégration dans `usePaternityPlanning`

```typescript
const validation = validateBirthDate(normalized);

if (!validation.valid) {
  setError(validation.error);
  return;
}

if (validation.warning) {
  setSuccessMessage(validation.warning); // Affiche avertissement
}
```

#### 3. Tests complets

- ✅ 30 tests unitaires (`dateValidation.test.ts`)
- ✅ 12 tests d'intégration (`integration-birthdate-validation.test.ts`)
- ✅ Total : **73 tests passent**

### Scénarios réalistes couverts

1. **Père planifiant 5 mois avant** → ✅ Valide, pas d'avertissement
2. **Père le jour de la naissance** → ✅ Valide (context: 'today')
3. **Père 2 semaines après naissance** → ✅ Valide avec avertissement
4. **Père 8 mois après** → ⚠️ Valide avec avertissement délai
5. **Date dans 3 ans** → ❌ Rejetée (9 mois max)
6. **Date il y a 5 ans** → ❌ Rejetée (1 an max)

### Avertissements générés

```typescript
// Cas 1 : Date passée < 6 mois
"Cette naissance est deja survenue. Certains jours ont peut-etre deja ete pris..."

// Cas 2 : Date passée > 6 mois
"Attention : Cette naissance date de plus de 6 mois. Le delai legal standard est depasse, 
sauf cas d'hospitalisation du nouveau-ne (12 mois)."
```

---

## Résultat final

### Tests
```bash
Test Files  4 passed (4)
Tests  73 passed (73)
```

### Fichiers créés
- ✅ `src/utils/dateValidation.ts` (125 lignes)
- ✅ `src/utils/__tests__/dateValidation.test.ts` (180 lignes)
- ✅ `src/utils/__tests__/holidays.test.ts` (137 lignes)
- ✅ `src/utils/__tests__/integration-birthdate-validation.test.ts` (135 lignes)

### Fichiers modifiés
- ✅ `src/utils/holidays.ts` (+20 lignes)
- ✅ `src/utils/paternityLeave.ts` (+60 lignes documentation)
- ✅ `src/hooks/usePaternityPlanning.ts` (validation complète)
- ✅ `src/components/LegalInfo.tsx` (clarification types de jours)
- ✅ `src/components/Summary.tsx` (clarification types de jours)

### Conformité légale
✅ Article L1225-65 du Code du Travail (depuis 1er juillet 2021)  
✅ 3 jours ouvrables (lundi-samedi) à charge employeur  
✅ 4 jours calendaires obligatoires  
✅ 21/28 jours calendaires fractionnables  
✅ Délai de 6 mois standard, 12 mois si hospitalisation  

---

## Prochaines étapes recommandées

### Phase 3 : Correction lettre de demande
- [ ] Ajouter références légales (Article L1225-65)
- [ ] Clarifier distinction 3j ouvrables / 4j calendaires / 21j calendaires
- [ ] Retirer certificat médical (requis seulement pour hospitalisation)
- [ ] Structure conforme administration

### Phase 4 : Tests Pâques + jours fériés
- [ ] Valider algorithme Computus (déjà testé 2024-2027)
- [ ] Tester périodes incluant jours fériés

### Phase 5 : Refactoring état React
- [ ] Grouper 14 états en 3 états cohésifs
- [ ] Améliorer maintenabilité

---

**Date de dernière mise à jour :** 21 octobre 2025  
**Version :** 1.1.0  
**Statut :** Production-ready pour phases 1-2

