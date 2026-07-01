# 🔍 Audit UX/UI — Méthode Superpowers (3 agents parallèles)

**Date** : 1er juillet 2026  
**Méthode** : 3 agents Explore en parallèle — Accessibilité, Performance/Code, UX Flow/Responsive  
**Périmètre** : 26 fichiers source, 665 lignes App.tsx, 22 composants, 4 hooks

---

## 📊 Scores par dimension

| Dimension | Score | Critique |
|-----------|-------|----------|
| ♿ Accessibilité | 6.5/10 | Bonnes bases mais 4 manquements critiques |
| ⚡ Performance/Code | 7/10 | Lazy loading OK, mais 111 appels Framer Motion |
| 🔄 UX Flow | 6.5/10 | 4 problèmes élevés (pertes de données) |
| 📱 Responsive | 8/10 | Mobile-first solide, quelques ajustements |

**Note globale** : **7/10** (inchangée depuis l'audit initial, nouveaux problèmes découverts)

---

## 🔴 Critiques — À corriger immédiatement

### Accessibilité
| # | Problème | Fichier | Impact |
|---|----------|---------|--------|
| A1 | **ResetConfirmDialog sans role ARIA** — pas de `role="alertdialog"`, `aria-modal`, `aria-labelledby`, ni focus trap | `ResetConfirmDialog.tsx:17-54` | Élevé |
| A2 | **Bouton reset sans aria-label sur mobile** — le texte "Réinitialiser" est `hidden` sous 640px, pas d'alternative | `HeroHeader.tsx:22-29` | Élevé |
| A3 | **Contraste text-slate-300 sur blanc** — ratio ~1.8:1 (seuil WCAG AA : 4.5:1). Étapes inactives illisibles | `ProgressStepper.tsx:66,106`, `NextStepsCard.tsx:54` | Élevé |
| A4 | **Contraste text-slate-400 sur blanc** — ratio ~2.5:1. En-têtes calendrier, footer | `Calendar.tsx:401`, `ErrorBoundary.tsx:88`, `App.tsx:649` | Élevé |

### UX Flow
| # | Problème | Fichier | Impact |
|---|----------|---------|--------|
| U1 | **Changement de scénario efface tout sans confirmation** — perte de données brutale | `usePaternityPlanning.ts:101-124` | Élevé |
| U2 | **Suppression de bloc par clic calendrier sans confirmation** — un clic malencontreux supprime N jours | `Calendar.tsx:239-240` | Élevé |
| U3 | **Messages masqués en mode sélection visuelle** — condition trop restrictive | `App.tsx:384-411` | Élevé |

---

## 🟠 Importants — À planifier

### Accessibilité
| # | Problème | Fichier |
|---|----------|---------|
| A5 | En-têtes calendrier hors du `role="grid"`, pas de `role="columnheader"` | `Calendar.tsx:399-405` |
| A6 | Radiogroup sans navigation flèches (WAI-ARIA pattern) | `ScenarioSelector.tsx:28-114` |
| A7 | Champ date sans liaison `htmlFor`/`id` | `SupplementaryLeaveCard.tsx:251-268` |
| A8 | Liens nav sans déplacement du focus après `scrollIntoView` | `NavigationAnchor.tsx:133-157` |
| A9 | ProgressBar sans `role="progressbar"` ni `aria-valuenow` | `ProgressStepper.tsx:42-51` |
| A10 | `aria-live` sur un bouton (devrait être sur une région séparée) | `LetterGenerator.tsx:270` |

### Performance
| # | Problème | Fichier |
|---|----------|---------|
| P1 | **Aucun `React.memo`** — tous les composants re-rendent à chaque changement d'état | 22 composants |
| P2 | **111 appels `motion.*`** et 22 `<AnimatePresence>` — Framer Motion pèse ~140K | Multiples |
| P3 | `CelebrationModal` a `fallback={null}` (incohérent avec les autres lazy) | `App.tsx:363` |

### UX Flow
| # | Problème | Fichier |
|---|----------|---------|
| U4 | Titre "Congé Paternité 2026 Ready" ambigu — l'outil couvre aussi le régime 2021 | `HeroHeader.tsx:46-56` |
| U5 | `pb-28` (112px) sur mobile même quand la navbar est cachée | `App.tsx:261` |
| U6 | `clearAllBlocks()` sans confirmation (contrairement à `requestReset()`) | `usePaternityPlanning.ts:424-434` |
| U7 | Hover sticky sur mobile (cartes PlanningModeSelector) | `PlanningModeSelector.tsx:102,146` |
| U8 | Erreur de copie sans bouton "Sélectionner tout" | `LetterGenerator.tsx:247-260` |
| U9 | Libellé "Recommencer la planification" ambigu (efface blocs, pas la date) | `App.tsx:504` |

---

## 🟡 Mineurs — Backlog

| # | Problème | Fichier |
|---|----------|---------|
| M1 | Icônes décoratives sans `aria-hidden` (Summary) | `Summary.tsx:46,75,213` |
| M2 | Skip link pas dans le HTML initial (seulement après hydrate React) | `index.html` |
| M3 | `prefers-reduced-motion` géré deux fois (CSS + MotionConfig) | `index.css:63-72`, `main.tsx:11` |
| M4 | Classes Tailwind inutilisées (`animate-pop`, `animate-shimmer`, `shadow-glow`) | `tailwind.config.js:47-59` |
| M5 | `@supabase/supabase-js` dans package.json mais jamais importé | `package.json:15` |
| M6 | Scroll brusque (`behavior: 'auto'`) pour la vue LegalReferences | `App.tsx:219` |
| M7 | Seuils ScrollIndicator (100px) ≠ NavigationAnchor (200px) — zone morte | `ScrollIndicator.tsx:23` |
| M8 | "Cliquez" inadapté au tactile (`isCoarsePointer`) | `Calendar.tsx`, `App.tsx` |
| M9 | `computeDefaultFirstBlock` dans useCallback inutilement | `usePaternityPlanning.ts:40-44` |
| M10 | Curseur visuel (32px) plus petit que zone tactile (48px) | `PlanningModeSelector.tsx:307-324` |

---

## ✅ Points forts confirmés par les 3 agents

- **Lazy loading** : 4 composants avec code splitting, 3 avec skeletons
- **Gestion `prefers-reduced-motion`** : exemplaire via `MotionConfig` + `useAppMotion`
- **Aucun useEffect sans cleanup** : tous les timers/observers/events nettoyés
- **Zones tactiles ≥ 44px** : boutons, calendrier, navigation
- **Navigation adaptative** : bottom bar mobile, top bar desktop, safe-area
- **Skip-to-content** : présent et fonctionnel
- **CelebrationModal** : focus trap, Escape, restauration focus, data-autofocus
- **Mode sombre** : non implémenté mais cohérent (thème clair uniquement)
- **Aucune image lourde** : uniquement des SVG minifiés
- **134 tests** : tous passent, typescript strict sans erreur

---

## 📋 Plan d'action priorisé (Top 10)

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 1 | U1 — Confirmation avant reset scénario | 30 min | Perte de données |
| 2 | U2 — Confirmation suppression bloc calendrier | 20 min | Perte de données |
| 3 | A2 — aria-label sur bouton reset mobile | 5 min | Accessibilité |
| 4 | A1 — ARIA complet sur ResetConfirmDialog | 30 min | Accessibilité |
| 5 | A3-A4 — Contrastes text-slate-300/400 → 500/600 | 15 min | Lisibilité |
| 6 | U3 — Séparer messages instruction/confirmation | 20 min | Feedback visuel |
| 7 | U6 — Confirmation pour clearAllBlocks | 15 min | Cohérence |
| 8 | P1 — React.memo sur Calendar, Summary, PlanningModeSelector | 30 min | Performance |
| 9 | A5 — columnheader dans le role="grid" | 20 min | Accessibilité |
| 10 | P3 — LazyFallback pour CelebrationModal | 5 min | Cohérence |

---

*Audit réalisé avec 3 agents Explore Superpowers — 1er juillet 2026*
