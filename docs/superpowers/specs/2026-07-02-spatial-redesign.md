# Spec — Refonte Design « Spatial »

**Date :** 2026-07-02
**Concept :** L'application devient une expérience native premium — plans flottants, verre dépoli, espace calme et confiant. Fini le « site web », place à l'outil natif.

---

## 1. Palette & Design Tokens

### Nouvelle palette

| Token | Valeur | Usage |
|-------|--------|-------|
| `surface-50` | `#ffffff` | Blanc pur (fonds de cartes, inputs) |
| `surface-100` | `#f7f6f2` | Fond principal — légèrement chaud, moins froid que le gris Apple |
| `surface-200` | `#e8e6e1` | Bordures subtiles |
| `surface-300` | `#d4d2cc` | Bordures actives, lignes de séparation |
| `surface-400` | `#a3a19a` | Texte secondaire très atténué |
| `surface-500` | `#807e78` | Texte secondaire |
| `brand-500` | `#2563eb` | Accent principal — bleu confiant et profond |
| `brand-600` | `#1d4ed8` | **Nouveau CTA** — boutons primaires, actions |
| `brand-700` | `#1e40af` | Hover states |
| `success-500` | `#10b981` | Blocs planifiés, états de succès (émeraude) |
| `success-600` | `#059669` | Hover / foncé succès |
| `warm-400` | `#f59e0b` | Badges "Recommandé", highlights chauds |
| `warm-500` | `#d97706` | Texte sur fond chaud |

### Typographie

- **Corps :** Inter, 17px desktop / 15px mobile (base)
- **Titres :** Outfit, tracking -0.02em
- **Label uppercase :** Outfit, tracking-wider (0.05em)
- **Tailles titre Hero :** `text-[2.5rem] sm:text-[3.5rem] md:text-[4rem]`

### Border-radius (standardisé)

- `rounded-card` : 1.5rem — cartes principales
- `rounded-2xl` : 1rem — cartes secondaires (standardisé !)
- `rounded-xl` : 0.75rem — contrôles (boutons, inputs)
- `rounded-pill` : 9999px — badges, compteurs

---

## 2. Espacement

| Contexte | Avant | Après |
|----------|-------|-------|
| Container padding mobile | `px-4` | `px-5` |
| Container padding desktop | `px-8` | `px-10 lg:px-12` |
| Espace entre sections mobile | `mb-12` | `mb-16` |
| Espace entre sections desktop | `mb-12` | `mb-20` |
| Padding interne cartes mobile | `p-5` | `p-6` |
| Padding interne cartes desktop | `p-7` | `p-8 lg:p-10` |
| Padding calendrier mobile | `p-4` | `p-5` |
| Padding calendrier desktop | `p-6` | `p-8 lg:p-10` |

---

## 3. HeroHeader (Refonte complète)

- **Icône calendrier :** Purement décorative (supprimer le `onClick` reset). Ajout d'une lueur pulsée subtile (animation 4s). Plus gros : `w-20 h-20 sm:w-28 sm:h-28`.
- **Badge "2026 Ready" :** Intégré inline dans le titre, pas en absolute débordant.
- **Bouton reset :** Déplacé à droite du titre, en pilule discrète avec fond verre. Texte "Réinitialiser" visible même sur mobile.
- **Pas de bouton reset sur l'icône** (conformité audit UX).
- **Ornements décoratifs :** Supprimés (3 points colorés inutiles).
- **Entrée :** Stagger animation (icône → titre → sous-titre).

---

## 4. Calendrier (Refonte majeure)

- **Taille des cellules :** `h-11 sm:h-14 lg:h-16` pour des cibles tactiles généreuses.
- **Typo jours :** `text-base sm:text-lg` — les chiffres se lisent.
- **Patterns indicatifs (accessibilité daltonien) :**
  - Employer : `bg-[repeating-linear-gradient(45deg,...)]` — lignes diagonales
  - Mandatory : fond plein avec bordure renforcée
  - Fractionnable : micro-points subtils
  - Naissance : fond plein foncé
- **Navigation mois :** Fondu enchaîné sur la grille (classe `reveal-subtle` maintenue, pas d'AnimatePresence).
- **État vide :** Carte dédiée plus visible (gradient + icône).
- **Jours désactivés :** Opacité 25% au lieu de 20%, avec `text-slate-300` lisible.
- **Aujourd'hui :** Petit point bleu sous la date (conservé).

---

## 5. NavigationAnchor

- **Pilule active animée :** Fond de l'item actif est un span qui se translate entre les positions (CSS transition sur `left`/`width`). Pas de JS lourd — un indicateur visuel fluide.
- **Mobile :** `rounded-3xl` avec `pb-safe-area`, padding renforcé entre items.
- **Desktop :** Barre verre dépoli en haut, centrée.
- **Fusion NavigationAnchor + PostPlanningNavBar :** Quand le planning est complet, le lien "Congé 2026" et "Courrier" apparaissent directement dans la même barre.

---

## 6. SectionCard

- **Accent bar :** 2px au lieu de 3px, du top 25% au bottom 75% (plus courte, plus élégante).
- **Ombre :** `shadow-depth-md` par défaut (remplace `shadow-card`).
- **Intérieur :** `pl-5` pour le contenu (plus d'espace après la barre d'accent).
- **Transition hover :** `shadow-depth-md` → `shadow-depth-lg` sur les cards, seulement sur `pointer: fine`.

---

## 7. PlanningModeSelector

- **Cartes mode simple/perso :** `rounded-2xl` (plus doux), fond subtilement distinct (mode simple = fond gradient brand très léger).
- **Badge "Recommandé" :** Couleur `warm-400` au lieu de `brand-600` (conformité audit — distinction badge vs CTA).
- **Curseur :** Thumb plus large (h-10 w-10), track plus épais (h-3), avec shadow glow.
- **Espacement :** `mb-12` (suppression du `mb-16` abusif).

---

## 8. NextStepsCard

- **Étapes en micro-cartes :** Chaque ligne a un fond `bg-white/80` arrondi, avec padding.
- **Pastilles de numéro :** Fond verre (bg-white/70) avec contour subtil.
- **Étape active :** Fond `bg-brand-50` très clair + bordure `border-brand-200`.
- **Étape complétée :** Cercle vert `bg-emerald-500` avec coche blanche et ombre.

---

## 9. FeedbackBanner

- **Layout :** Icône de ton (cercle coloré) + titre + message.
- **Styles :** `backdrop-blur-xl`, `rounded-2xl`, fond plus transparent (0.85).
- **Animation :** Entrée latérale (slide depuis la droite) — plus naturelle qu'une chute verticale.

---

## 10. Summary

- **Timeline :** `py-4` entre les blocs (plus d'air).
- **Pastille de type :** Petit cercle coloré à gauche de chaque bloc (bleu → employer, brand → obligatoire, vert → fractionnable).
- **Bouton remove :** `opacity-40` par défaut, visible au survol de la ligne entière.
- **État vide "Aucune période" :** Plus visible, avec icône.

---

## 11. LetterGenerator

- **Champs :** `rounded-xl`, fond `bg-white/95`, bordure `border-surface-200`, focus `border-brand-500` + `ring-2 ring-brand-500/10`.
- **Placeholders :** Jean Dupont, 75001 Paris, etc. — exemples réalistes.
- **Prévisualisation courrier :** Pas de scroll interne — `max-h-[50vh] sm:max-h-none`.
- **Validation :** Messages d'erreur liés avec `aria-describedby` sur les inputs.

---

## 12. CelebrationModal

- **Design épuré :** Moins de particules, plus d'air. Grand titre en gradient (brand), sous-titre discret.
- **Fond :** Noir/bleu très foncé à 60% d'opacité.
- **Boutons CTA :** Larges, verre dépoli (`backdrop-blur-xl bg-white/10`), avec hover bright.
- **Animation entrée :** scale 0.9 → 1 avec fade.

---

## 13. Animations

- **Principe :** Qui informe, pas qui décore.
- **Entrées :** `reveal` conservé avec délai stagger (0ms → 80ms → 160ms).
- **Hover cartes :** translateY(-2px) + shadow boost — seulement sur `pointer: fine`.
- **Calendrier :** Pas d'AnimatePresence sur la grille (perf).
- **Modales :** scale(0.92) → scale(1) + opacity 0→1 en 350ms.
- **Feedback :** slide depuis droite en 300ms.
- **Navigation :** Transition CSS sur l'indicateur de section active.

---

## 14. Accessibilité (corrections audit)

- Ajout de patterns non-couleur sur les jours calendrier (diagonal lines, dots).
- Contraste : `text-slate-400` → `text-slate-500` sur jours weekend/fériés.
- Liens aria-describedby sur les erreurs du formulaire courrier.
- Focus trap renforcé sur ResetConfirmDialog (conformité audit).
- Tooltip sur les jours fériés dans le calendrier.
- Skip link maintenu et visible au focus.

---

## Fichiers modifiés

1. `tailwind.config.js` — palette, animations, borderRadius
2. `src/index.css` — nouvelles classes, base styles
3. `src/App.tsx` — spacing, layout, sections
4. `src/components/HeroHeader.tsx` — refonte complète
5. `src/components/Calendar.tsx` — cellules, patterns, spacing
6. `src/components/CalendarLegend.tsx` — updated
7. `src/components/SectionCard.tsx` — barre, ombres, padding
8. `src/components/NavigationAnchor.tsx` — pill sliding
9. `src/components/PlanningModeSelector.tsx` — cartes, curseur
10. `src/components/NextStepsCard.tsx` — micro-cartes
11. `src/components/Button.tsx` — refinements
12. `src/components/FeedbackBanner.tsx` — redesign
13. `src/components/Summary.tsx` — timeline, pastilles
14. `src/components/LetterGenerator.tsx` — champs, preview
15. `src/components/CelebrationModal.tsx` — épuré
16. `src/components/ResetConfirmDialog.tsx` — focus trap

---

## Non-changements

- La logique métier (`src/utils/`, `src/hooks/usePaternityPlanning.ts`, `src/hooks/useSupplementaryLeave.ts`) reste **strictement inchangée**.
- Les tests ne sont pas modifiés (seulement vérification qu'ils passent toujours).
- Les composants lazy-loaded et leur structure restent identiques.
- Pas de nouvelles dépendances.
- Pas de mode sombre.
