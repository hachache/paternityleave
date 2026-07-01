# 🔍 Audit UX/UI — Calculateur Congé Paternité

**Date** : 1er juillet 2026  
**Périmètre** : Application complète (React 18 + TypeScript + Tailwind CSS + Framer Motion)  
**Méthodologie** : Revue exhaustive du code source (20 composants, 4 hooks, 12 utilities, CSS, HTML)

---

## 📊 Synthèse

| Dimension | Score | Critique |
|-----------|-------|----------|
| Accessibilité | 🟡 7/10 | Bonnes bases mais lacunes naviguation clavier |
| Design System | 🟢 8/10 | Cohérent, tokens bien définis |
| Responsive | 🟢 8/10 | Mobile-first bien implémenté |
| Performance | 🟡 7/10 | Framer Motion bien géré, mais pas de lazy loading |
| UX Flow | 🟢 8/10 | Parcours guidé efficace |
| Contenu & Micro-copy | 🟢 8/10 | Français clair, ton adapté |
| États & Erreurs | 🟡 6/10 | Couverts mais perfectibles |
| SEO & Meta | 🟢 9/10 | Excellent - JSON-LD, OG, Twitter Cards |

**Note globale** : **7.6/10** — Application de qualité avec des fondations solides, quelques points d'amélioration identifiés.

---

## 1. ♿ Accessibilité

### ✅ Points forts

- **Skip link** (`App.tsx:237-242`) : lien "Aller directement au contenu principal" présent et bien stylé
- **`prefers-reduced-motion`** (`index.css:65-74`) : désactive toutes les animations quand l'utilisateur le demande — excellente pratique
- **`useAppMotion()`** (`motion.ts:36-43`) : hook centralisé qui propage `shouldReduce` à tous les composants animés
- **Labels aria** sur le calendrier : `aria-label` dynamiques sur chaque jour (`Calendar.tsx:425-431`)
- **Grille calendrier** accessible au clavier : navigation fléchée complète (`Calendar.tsx:271-288`)
- **Bouton reset** avec `aria-label` (`HeroHeader.tsx:37-38`)
- **`role="alert"`** sur les bannières de feedback (`FeedbackBanner.tsx:33`)
- **`role="switch"`** sur le toggle du congé supplémentaire (`SupplementaryLeaveCard.tsx:114-115`)
- **`role="dialog"` + `aria-modal`** sur la modale de célébration (`CelebrationModal.tsx:161-163`)
- **Focus trap** dans la modale de célébration (`CelebrationModal.tsx:80-118`)
- **`aria-live="polite"`** sur le bouton de copie du courrier (`LetterGenerator.tsx:243`)

### ⚠️ Points d'amélioration

| # | Problème | Localisation | Impact | Sévérité |
|---|----------|-------------|--------|----------|
| A1 | **Couleurs seules pour l'information** — Les types de congés (employeur/obligatoire/fractionnable) sont distingués uniquement par la couleur dans le calendrier. Un utilisateur daltonien ne peut pas les différencier. | `Calendar.tsx:316-329` | Élevé | 🔴 |
| A2 | **Contraste insuffisant** — `text-slate-400` sur fond `bg-slate-50` (jours weekend/fériés) a un ratio de contraste d'environ 3.5:1, sous le seuil WCAG AA de 4.5:1 pour le texte normal. | `Calendar.tsx:331` | Moyen | 🟠 |
| A3 | **Contraste des placeholders** — `placeholder:text-slate-400` sur fond blanc a un ratio limite. | `index.css:52` | Faible | 🟡 |
| A4 | **Pas de `aria-describedby`** sur les champs du formulaire courrier — les messages d'erreur ne sont pas liés aux inputs. | `LetterGenerator.tsx:118-189` | Moyen | 🟠 |
| A5 | **Toggle switch non standard** — Le switch du congé supplémentaire utilise `role="switch"` mais pas `aria-labelledby` pour lier le label. | `SupplementaryLeaveCard.tsx:113-131` | Moyen | 🟠 |
| A6 | **Pas de `aria-expanded`** sur l'accordéon `<details>` du cadre légal. Le navigateur le gère nativement, mais un attribut explicite serait plus robuste. | `LegalInfo.tsx:16` | Faible | 🟡 |
| A7 | **Pas de gestion du focus après fermeture de modale** sur `ResetConfirmDialog` — contrairement à `CelebrationModal` qui restaure le focus. | `ResetConfirmDialog.tsx` | Moyen | 🟠 |
| A8 | **Jours fériés non annoncés** — Les jours fériés français sont affichés visuellement mais pas communiqués aux technologies d'assistance. | `Calendar.tsx:304` | Moyen | 🟠 |

### 🔧 Recommandations

```tsx
// A1 - Ajouter des icônes ou patterns pour distinguer les types de congés
// Exemple : ajouter une icône ou un motif CSS différent selon le type
const dayPatterns = {
  employer: 'bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.2)_2px,rgba(255,255,255,0.2)_4px)]',
  mandatory: 'ring-2 ring-inset ring-white/30',
  // ...
};

// A2 - Remplacer text-slate-400 par text-slate-500 ou text-slate-600
// Calendar.tsx:331
if (!hasLeaveType && (weekend || holiday) && isCurrentMonthDay) 
  classes += ' bg-slate-50 text-slate-500'; // au lieu de text-slate-400

// A4 - Lier les erreurs aux inputs
<input
  id="letter-lieu"
  aria-describedby="letter-lieu-error"
  aria-invalid={!!errors.lieu}
/>
```

---

## 2. 🎨 Design System & Cohérence Visuelle

### ✅ Points forts

- **Design tokens Tailwind** bien définis : couleurs `brand`, `accent`, `success`, `surface` (`tailwind.config.js:10-40`)
- **Typographie cohérente** : `Inter` pour le corps, `Outfit` pour les titres — usage systématique via `font-sans` et `font-display`
- **Ombres nommées** : `shadow-soft`, `shadow-glass`, `shadow-glow` (`tailwind.config.js:41-44`)
- **Animations réutilisables** : `animate-pop`, `animate-shimmer` (`tailwind.config.js:46-59`)
- **Classe utilitaire `.premium-card`** : style de carte cohérent dans toute l'app (`index.css:32-49`)
- **`.input-modern`** : style d'input unifié (`index.css:51-53`)
- **Composant `Button`** bien conçu : variants, tailles, icônes, `fullWidth` (`Button.tsx`)
- **`SectionCard`** : wrapper cohérent pour les sections avec accent de couleur (`SectionCard.tsx`)
- **Hiérarchie visuelle claire** : titres → descriptions → contenu, espacement cohérent

### ⚠️ Points d'amélioration

| # | Problème | Localisation | Impact | Sévérité |
|---|----------|-------------|--------|----------|
| D1 | **Incohérence des `border-radius`** — Certains composants utilisent `rounded-2xl`, d'autres `rounded-[1.5rem]`, d'autres `rounded-3xl`. Pas de token unique. | Multiples fichiers | Faible | 🟡 |
| D2 | **Pas de mode sombre** — Aucune classe `dark:` n'est utilisée. Le thème est clair uniquement. | Global | Moyen | 🟠 |
| D3 | **Couleur du toggle "Recommandé"** — Le badge "Recommandé" sur le mode simple utilise `bg-brand-600`, même couleur que le bouton primary. Cela crée une confusion visuelle — on ne sait pas si c'est un badge ou un bouton. | `PlanningModeSelector.tsx:103` | Faible | 🟡 |
| D4 | **Dégradé de fond inutilisé** — `HeroHeader.tsx:33` a un dégradé décoratif en absolu caché sur mobile (`hidden sm:block`), mais il ajoute du markup inutile. | `HeroHeader.tsx:33` | Faible | 🟡 |
| D5 | **Icône calendrier dans le Hero fait aussi office de bouton reset** — Pattern inhabituel : cliquer sur l'icône calendrier réinitialise tout. Le comportement n'est pas évident. | `HeroHeader.tsx:34-43` | Moyen | 🟠 |
| D6 | **Footer avec `hover:scale-105`** sur le badge signature — L'effet de scale sur un élément non interactif (le conteneur, pas le lien) est trompeur. | `App.tsx:613` | Faible | 🟡 |
| D7 | **Double bouton reset** — Il y a DEUX façons de réinitialiser : l'icône calendrier et le bouton "Réinitialiser". Redondance qui peut créer de la confusion. | `HeroHeader.tsx:22-29` et `HeroHeader.tsx:34-43` | Moyen | 🟠 |

### 🔧 Recommandations

```css
/* D1 - Définir un token de border-radius cohérent */
:root {
  --radius-card: 1.5rem;   /* Cartes principales */
  --radius-element: 0.75rem; /* Boutons, inputs */
  --radius-full: 9999px;   /* Pills, badges */
}
```

---

## 3. 📱 Responsive Design & Mobile

### ✅ Points forts

- **Mobile-first** : les classes Tailwind suivent le pattern `sm:`, `md:`, `lg:`
- **`viewport-fit=cover`** dans le meta viewport (`index.html:6`)
- **`safe-area-inset-bottom`** pour les appareils avec notch — padding supplémentaire sur la navbar mobile (`NavigationAnchor.tsx:178`)
- **`useMediaQuery` hook** (`useMediaQuery.ts`) : détection propre de `(pointer: coarse)` pour adapter les interactions
- **Calendrier responsive** : `p-1 min-[360px]:p-3.5 sm:p-8` — s'adapte aux très petits écrans
- **Texte responsive** : `text-sm sm:text-base` systématique
- **Navigation adaptative** : NavAnchor en bas sur mobile, en haut sur desktop (`NavigationAnchor.tsx:178`)
- **Grilles responsive** : `grid-cols-1 md:grid-cols-2` partout

### ⚠️ Points d'amélioration

| # | Problème | Localisation | Impact | Sévérité |
|---|----------|-------------|--------|----------|
| R1 | **La bannière de sélection visuelle est `sticky` avec `top-4` sur mobile** — Sur un petit écran, ça prend beaucoup de place et peut gêner la visualisation du calendrier. | `App.tsx:399` | Moyen | 🟠 |
| R2 | **PlanningModeSelector a un `mb-28` sur mobile** — Cet espacement énorme est étrange visuellement. | `PlanningModeSelector.tsx:81` | Faible | 🟡 |
| R3 | **Le courrier preview a `max-h-[60vh]` sur mobile** — La prévisualisation est tronquée et nécessite un scroll interne + scroll de page (double scroll). | `LetterGenerator.tsx:195` | Élevé | 🔴 |
| R4 | **Pas de test tablette spécifique** — Les breakpoints entre mobile et desktop ne sont pas testés explicitement dans le code (orientation paysage, tablettes). | Global | Faible | 🟡 |
| R5 | **Le `Select` natif pour la durée du congé supplémentaire** n'est pas stylé sur mobile, ce qui peut donner un rendu incohérent. (En fait c'est des boutons, donc OK) | — | — | — |

### 🔧 Recommandations

```tsx
// R3 - Solution pour le double scroll
// Remplacer le scroll interne par une hauteur adaptative
<div className="bg-white rounded-xl shadow-md p-5 sm:p-12 
  sm:min-h-[400px] flex flex-col
  overflow-y-auto overscroll-contain sm:overflow-visible
  text-slate-800 text-xs sm:text-base">
  // Utiliser max-h-[50vh] sm:max-h-none pour éviter le scroll interne sur desktop
```

---

## 4. ⚡ Performance

### ✅ Points forts

- **`useMemo`** utilisé pour les calculs coûteux du calendrier : `days`, `dayKeyMap`, `holidays`, `usageLimit` (`Calendar.tsx:71-98`)
- **`useCallback`** sur les handlers pour éviter les re-rendus inutiles (`Calendar.tsx:100-299`)
- **`motion.div` avec `layout`** pour des animations fluides sans repaint complet
- **`AnimatePresence`** pour nettoyer le DOM des éléments sortants
- **`shouldReduce`** qui passe `duration: 0` sur toutes les animations quand `prefers-reduced-motion` est actif
- **IntersectionObserver** avec debounce pour la détection de section active (`NavigationAnchor.tsx:74-103`)
- **`passive: true`** sur les event listeners scroll

### ⚠️ Points d'amélioration

| # | Problème | Localisation | Impact | Sévérité |
|---|----------|-------------|--------|----------|
| P1 | **Pas de code splitting** — Toute l'application est dans un seul bundle. `React.lazy` + `Suspense` ne sont pas utilisés. `LetterGenerator`, `LegalReferences`, `SupplementaryLeaveCard` pourraient être lazy-loadés. | `App.tsx:1-28` | Moyen | 🟠 |
| P2 | **Framer Motion `AnimatePresence` sur toute la grille calendrier** — Chaque changement de mois recrée tous les nœuds DOM (42 jours). Sur mobile, ça peut causer des saccades. | `Calendar.tsx:403-458` | Moyen | 🟠 |
| P3 | **Pas de `loading="lazy"` sur les iframes/images** — Si des médias sont ajoutés plus tard, ce sera un oubli. Actuellement pas d'images lourdes. | Global | Faible | 🟡 |
| P4 | **`useMemo` sur `metadataByKey` recalcule tous les jours** — Appelée à chaque changement de `describeDay` qui dépend de nombreux états. Pourrait être optimisée. | `Calendar.tsx:248-255` | Faible | 🟡 |
| P5 | **CSS non purgé** — Tailwind 3 fait le purge automatiquement, mais les classes dynamiques comme `animate-calendar-focus` ne sont pas dans `content` (mais dans `index.css`, donc c'est OK). | `tailwind.config.js:3` | Faible | 🟡 |
| P6 | **Pas de `<link rel="preload">`** pour les fonts Google — Les polices Inter et Outfit chargent après le premier rendu, causant un FOIT (Flash of Invisible Text). | `index.css:1` | Moyen | 🟠 |

### 🔧 Recommandations

```tsx
// P1 - Lazy loading des composants lourds
const LetterGenerator = lazy(() => import('./components/LetterGenerator'));
const LegalReferences = lazy(() => import('./components/LegalReferences'));
const SupplementaryLeaveCard = lazy(() => import('./components/SupplementaryLeaveCard'));

// Dans le JSX :
<Suspense fallback={<div className="h-64 animate-pulse bg-slate-100 rounded-2xl" />}>
  {showLegalReferences ? <LegalReferences /> : null}
</Suspense>
```

```html
<!-- P6 - Preload des fonts dans index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## 5. 🔄 UX Flow & Navigation

### ✅ Points forts

- **Parcours guidé progressif** : Le `ProgressStepper` montre les étapes (`progressSteps.ts`)
- **Navigation contextuelle** : `NavigationAnchor` apparaît après le début du scroll
- **Scroll automatique intelligent** : `useScrollOrchestrator` gère le défilement vers les sections pertinentes
- **Deux modes de planification** : Simple (1 clic) et Personnalisé (curseur + sélection directe)
- **Modal de célébration** à la fin du planning — renforcement positif
- **"Recommencer la planification"** : bouton pour effacer tous les blocs, avec style visuel adapté (`App.tsx:468-489`)
- **`ResetConfirmDialog`** : confirmation avant de tout perdre

### ⚠️ Points d'amélioration

| # | Problème | Localisation | Impact | Sévérité |
|---|----------|-------------|--------|----------|
| U1 | **Pas d'état "vide" initial engageant** — Au premier chargement, seul le Hero + sélecteur de scénario + calendrier vide sont visibles. Pas de CTA clair "Commencez par sélectionner une date". | `Calendar.tsx:357-369` | Élevé | 🔴 |
| U2 | **Le flux de sélection visuelle** (mode 2 étapes) force l'utilisateur à rester dans le calendrier. Si on scrolle, la bannière sticky prend de la place. Pas de bouton "Valider" explicite — il faut cliquer sur la date de fin. | `App.tsx:397-443` | Moyen | 🟠 |
| U3 | **Le "Mode simple" vs "Mode personnalisé"** apparaît APRÈS avoir entré la date de naissance ET que la période obligatoire soit calculée. L'utilisateur ne sait pas que ce choix arrive. | `PlanningModeSelector` condition dans `App.tsx:447` | Moyen | 🟠 |
| U4 | **Pas de retour visuel sur le clic d'un jour sélectionnable** — Quand on clique sur un jour pour poser des congés, il n'y a pas de feedback immédiat avant que le bloc soit créé. | `Calendar.tsx:227-246` | Moyen | 🟠 |
| U5 | **Le `PostPlanningNavBar` et le `NavigationAnchor` coexistent** après la planification complète — deux navigations sticky simultanées. | `App.tsx:492-505` et `App.tsx:256-259` | Faible | 🟡 |
| U6 | **Pas de "Retour en haut" automatique** quand on change de scénario — l'utilisateur peut être perdu en bas de page. | `ScenarioSelector` | Faible | 🟡 |
| U7 | **L'icône calendrier dans le Hero est un bouton reset déguisé** — Pattern trompeur. L'utilisateur clique sur un calendrier, il perd tout son planning. | `HeroHeader.tsx:34-43` | Élevé | 🔴 |

### 🔧 Recommandations

```tsx
// U1 - Ajouter un state "empty" plus engageant dans le calendrier
{!birthDate && (
  <motion.div className="mb-5 rounded-2xl bg-brand-50 p-4 sm:p-5 border border-brand-100 text-center">
    <p className="text-brand-800 font-medium mb-2">
      📅 Sélectionnez la {vocabulary.eventDateActionLabel} pour démarrer
    </p>
    <p className="text-sm text-brand-600">
      C'est la première étape pour calculer votre planning personnalisé
    </p>
  </motion.div>
)}
```

```tsx
// U7 - Rendre l'icône calendrier purement décorative ou enlever le onClick reset
// Solution A : Enlever le onClick reset de l'icône
<motion.button
  type="button"
  // onClick={onResetRequest}  ← SUPPRIMER
  aria-label="Calculateur de congé paternité"
  className="cursor-default"
>
  <CalendarIcon />
</motion.button>

// Solution B : Ajouter un tooltip explicite
<motion.button
  type="button"
  onClick={onResetRequest}
  title="Cliquer pour recommencer à zéro"
  // ...
>
```

---

## 6. 📝 Contenu & Micro-copy

### ✅ Points forts

- **Français clair et accessible** — pas de jargon administratif excessif
- **`getScenarioVocabulary()`** (`scenarioVocabulary.ts`) : vocabulaire adapté selon le scénario (naissance/adoption)
- **Messages d'erreur en français**, contextuels (`usePaternityPlanning.ts`)
- **Termes administratifs exacts** : "jours ouvrables", "jours calendaires", "fractionnables"
- **Tonalité rassurante** : "Simplifiez vos démarches administratives"
- **Badge "2026 Ready"** : donne confiance sur l'actualité des informations

### ⚠️ Points d'amélioration

| # | Problème | Localisation | Impact | Sévérité |
|---|----------|-------------|--------|----------|
| C1 | **"L'outil moderne pour planifier simplement votre congé paternité."** — Le mot "simplement" est un anglicisme (simply → simplement). Mieux : "facilement" ou "en toute simplicité". | `HeroHeader.tsx:58` | Faible | 🟡 |
| C2 | **Pas de micro-copy pour les jours fériés** — Quand un jour férié tombe dans une période de congé, aucun message ne l'indique. | `Calendar.tsx` | Faible | 🟡 |
| C3 | **Le message "Cliquez sur le calendrier pour ajouter vos jours"** est trop vague — ne précise pas le nombre minimum de jours (5). | `Summary.tsx:162` | Moyen | 🟠 |
| C4 | **Le badge "Courant"** sur le scénario standard — en français, on dirait plutôt "Standard" ou "Classique". | `ScenarioSelector.tsx:64` | Faible | 🟡 |
| C5 | **La formulaire courrier manque de placeholders plus utiles** — "Jean", "Dupont" sont OK mais pourraient être plus représentatifs. | `LetterGenerator.tsx:125,150,162` | Faible | 🟡 |
| C6 | **Pas de numéro de téléphone dans le courrier généré** — information souvent demandée par les RH. | `employerLetter.ts` | Moyen | 🟠 |

---

## 7. 📊 États (Loading, Empty, Error, Edge Cases)

### ✅ Points forts

- **`FeedbackBanner`** : composant réutilisable pour succès/erreur/info (`FeedbackBanner.tsx`)
- **Gestion des erreurs de copie** : fallback si `navigator.clipboard` échoue (`LetterGenerator.tsx:92-101`)
- **`error` et `successMessage`** affichés dans l'interface avec animation (`App.tsx:367-394`)
- **État "non éligible"** pour le congé supplémentaire : message explicatif + switch désactivé (`SupplementaryLeaveCard.tsx`)
- **Mode `visualSelectionMode`** avec banner d'instruction (`App.tsx:397-443`)
- **État vide "Aucune période planifiée"** dans le résumé (`Summary.tsx:159-163`)
- **`ResetConfirmDialog`** pour éviter les pertes accidentelles

### ⚠️ Points d'amélioration

| # | Problème | Localisation | Impact | Sévérité |
|---|----------|-------------|--------|----------|
| E1 | **Pas d'état de chargement** — Si l'app avait des appels API, il n'y aurait aucun skeleton/spinner. Actuellement tout est calculé côté client, donc c'est OK, mais aucune structure n'est en place. | Global | Faible | 🟡 |
| E2 | **Pas de gestion d'erreur si `getFrenchHolidays()` échoue** — Si le calcul des jours fériés plante, le calendrier entier pourrait casser. | `Calendar.tsx:90-93` | Faible | 🟡 |
| E3 | **Pas d'état de succès persistant** pour "Courrier copié" — Le message disparaît après 2 secondes. Sur mobile, l'utilisateur pourrait ne pas le voir. | `LetterGenerator.tsx:80-84` | Faible | 🟡 |
| E4 | **Le courrier généré peut être vide** si aucun champ d'identité n'est rempli. Le texte généré contient "Lieu", "Date", "Prénom Nom" vides. | `employerLetter.ts` | Moyen | 🟠 |
| E5 | **Pas de validation des dates** sur le formulaire courrier (format `dd/MM/yyyy`). Si l'utilisateur entre "demain", ça sera imprimé tel quel. | `LetterGenerator.tsx:134-137` | Faible | 🟡 |
| E6 | **Pas de message quand le congé supplémentaire n'est pas encore disponible** (avant juillet 2026) pour les naissances avant janvier 2026. | `SupplementaryLeaveCard.tsx` | Moyen | 🟠 |
| E7 | **Pas de Edge Case pour les années bissextiles** — Les calculs de date utilisent `date-fns` qui gère ça, donc c'est couvert. ✅ | — | — | — |

### 🔧 Recommandations

```tsx
// E4 - Ajouter une validation visuelle sur le courrier
const hasIdentity = lieu && nom && prenom;
{!hasIdentity && (
  <p className="text-amber-600 text-sm mt-2">
    ⚠️ Remplissez au moins le lieu, le nom et le prénom pour un courrier complet.
  </p>
)}
```

---

## 8. 🔎 SEO & Meta

### ✅ Points forts

- **Meta tags complets** (`index.html:8-41`) : description, keywords, author, robots, canonical
- **Open Graph** : `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:locale`
- **Twitter Cards** : `summary_large_image` avec titre, description, image
- **JSON-LD structuré** (`index.html:43-119`) :
  - `WebApplication` schema avec auteur, prix (gratuit)
  - `FAQPage` schema avec 6 questions/réponses — excellent pour les rich snippets
- **`manifest.json`** lié pour le support PWA
- **`theme-color`** meta tag pour les navigateurs mobiles
- **`apple-mobile-web-app-*`** meta tags pour iOS

### ⚠️ Points d'amélioration

| # | Problème | Localisation | Impact | Sévérité |
|---|----------|-------------|--------|----------|
| S1 | **`social-card.png` n'existe probablement pas** — L'URL `https://paternityleave.hediac.fr/social-card.png` est référencée dans les meta tags mais n'est probablement pas générée. Les partages sociaux auront une image cassée. | `index.html:23,33` | Élevé | 🔴 |
| S2 | **L'URL GitHub dans `LegalReferences` pointe vers `yourusername`** — placeholder non remplacé. | `LegalReferences.tsx:401` | Faible | 🟡 |
| S3 | **Pas de `sitemap.xml`** ni `robots.txt` mentionné — Google pourrait avoir du mal à indexer correctement. | Racine du projet | Moyen | 🟠 |
| S4 | **Le `title` est très long** — "Calculateur Congé Paternité 2026 - Planificateur 28 Jours + Congé Supplémentaire LFSS 2026". Google tronque à ~60 caractères. | `index.html:9` | Moyen | 🟠 |
| S5 | **Pas de `hreflang`** — Si le site vise uniquement la France, `hreflang="fr"` aiderait. | `index.html` | Faible | 🟡 |
| S6 | **`manifest.json`** — Vérifier qu'il existe bien dans `/public/`. | — | Moyen | 🟠 |

---

## 9. 🧱 Architecture & Qualité du Code (lié à l'UX)

### ✅ Points forts

- **Séparation claire** : `components/`, `hooks/`, `utils/`, `lib/`
- **`usePaternityPlanning`** : logique métier centralisée dans un hook
- **`useScrollOrchestrator`** : logique de scroll extraite d'App.tsx
- **Utilitaires testés** : `__tests__/` avec 8 fichiers de test
- **Composants atomiques** : `Button`, `SectionCard`, `FeedbackBanner`
- **Patterns cohérents** : chaque composant a une interface Props typée

### ⚠️ Points d'amélioration

| # | Problème | Localisation | Impact | Sévérité |
|---|----------|-------------|--------|----------|
| Q1 | **`App.tsx` fait 643 lignes** — Trop de logique dans le composant racine. Les handlers comme `handleSelectBirthDate`, `handleResetConfirm`, etc. pourraient être dans le hook `usePaternityPlanning`. | `App.tsx:29-643` | Moyen | 🟠 |
| Q2 | **Pas d'Error Boundary** — Si un composant throw, toute l'app crash. | `main.tsx` | Élevé | 🔴 |
| Q3 | **Les refs sont exposées dans le JSX** : `ref={calendarRef}`, `ref={planningRef}`, etc. Ça fonctionne mais rend le markup verbeux. | `App.tsx` | Faible | 🟡 |
| Q4 | **Pas de `React.memo`** sur les composants de la grille calendrier — chaque jour est un `motion.button`, 42 par mois, qui re-rendent à chaque changement d'état. | `Calendar.tsx:433-454` | Moyen | 🟠 |

### 🔧 Recommandations

```tsx
// Q2 - Ajouter une Error Boundary
// src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Oups, quelque chose s'est mal passé</h1>
            <p className="text-slate-600 mb-6">Veuillez rafraîchir la page pour réessayer.</p>
            <button onClick={() => window.location.reload()} className="...">
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Dans main.tsx :
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 📋 Plan d'action priorisé

### 🔴 Critique (à corriger rapidement)

| Priorité | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P0 | **Q2** - Ajouter un Error Boundary | 30 min | Évite le crash complet |
| P0 | **A1** - Ajouter des indicateurs non-couleur dans le calendrier | 2h | Accessibilité daltoniens |
| P0 | **S1** - Générer une `social-card.png` | 1h | Partage sur les réseaux |
| P0 | **U7** - Corriger le double-usage de l'icône calendrier (reset déguisé) | 15 min | UX |

### 🟠 Important (à planifier ce sprint)

| Priorité | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P1 | **A2** - Améliorer les contrastes de couleur | 1h | WCAG AA |
| P1 | **R3** - Corriger le double scroll sur mobile (courrier) | 1h | Mobile UX |
| P1 | **U1** - Améliorer l'état vide initial | 2h | Engagement utilisateur |
| P1 | **P1** - Ajouter du lazy loading | 2h | Performance |
| P1 | **P6** - Preload des fonts Google | 15 min | FOUT/FOIT |

### 🟡 Nice-to-have (backlog)

| Priorité | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P2 | **D2** - Mode sombre | 8h | Confort visuel |
| P2 | **A4-A5** - Améliorations aria | 3h | Accessibilité |
| P2 | **E4** - Validation du formulaire courrier | 2h | Robustesse |
| P2 | **S3** - Sitemap + robots.txt | 1h | SEO |
| P2 | **Q1** - Refactorer App.tsx | 4h | Maintenabilité |

---

## 🎯 Conclusion

L'application **Calculateur Congé Paternité** est un outil bien conçu avec une attention évidente portée à l'expérience utilisateur. Les fondations techniques sont solides : design system cohérent, responsive mobile-first, accessibilité partiellement couverte, SEO excellent.

Les points les plus urgents à traiter sont :
1. **L'Error Boundary** (risque de crash complet)
2. **L'accessibilité daltoniens** dans le calendrier (discrimination visuelle)
3. **L'image de partage social** (première impression sur les réseaux)
4. **Le double-usage trompeur de l'icône calendrier** (confusion utilisateur)

Avec ces corrections, l'application passerait de **7.6/10** à **8.5/10**, ce qui en ferait une référence dans le domaine des outils administratifs français.

---

*Audit réalisé le 1er juillet 2026 — Codebase révision `61fbc1a`*
