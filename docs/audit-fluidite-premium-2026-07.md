# Audit fluidite et rendu premium - implementations techniques

Date : 1er juillet 2026  
Perimetre : React 18, Vite, TypeScript, Tailwind, Framer Motion.  
Objectif : ameliorer la fluidite percue, la stabilite visuelle et le ressenti premium sans toucher a la logique legale.

## Base verifiee

- `npm run build` OK.
- Bundle actuel :
  - base avant implementation : `index-Dqf8QIdm.js` : 406.89 kB, 125.11 kB gzip.
  - base apres implementation : `index-URn6Ruqm.js` : 245.84 kB, 75.29 kB gzip.
  - CSS apres implementation : `index-D242VfPy.css` : 52.05 kB, 9.19 kB gzip.
  - Framer Motion est sorti du chemin initial et isole dans un chunk async `proxy-*.js` : 125.04 kB, 40.76 kB gzip.
  - chunks lazy : `CelebrationModal`, `LetterGenerator`, `SupplementaryLeaveCard`, `LegalReferences`.
- Avertissement Browserslist corrige via mise a jour `caniuse-lite`.
- Audit UX/UI existant partiellement perime : le lazy-loading de plusieurs composants est deja en place.

## Verdict technique

Les fondations sont bonnes : architecture lisible, composants memoises, styles coherents, `prefers-reduced-motion` pris en compte, lazy-loading partiel.  
Le principal gain premium se fera sur quatre axes :

1. reduire les animations qui provoquent du layout/reflow ;
2. stabiliser les composants qui se re-rendent trop facilement ;
3. simplifier les couches sticky, blur, ombres et hover ;
4. mesurer le bundle et les regressions visuelles au lieu de se fier au ressenti.

## P0 - Fluidite percue et jank visible

### 1. Ne charger `CelebrationModal` qu'au moment utile

Probleme : `CelebrationModal` est lazy, mais rendu en permanence dans `App.tsx` avec `show={showCelebration}`. Le chunk peut donc etre demande des le chargement initial.

Implementation :
- Dans `src/App.tsx`, rendre le `Suspense` seulement si `showCelebration` est vrai.
- Garder la fermeture animee dans le composant, mais eviter le chargement initial.

Validation :
- Onglet Network : le chunk `CelebrationModal-*.js` ne doit pas etre charge avant la fin de planification.
- `npm run build` et verification manuelle du parcours complet.

### 2. Supprimer l'animation ligne par ligne du courrier

Probleme : `LetterGenerator.tsx` transforme chaque ligne du courrier en `motion.span`. A chaque saisie, de nombreux noeuds React et Framer Motion sont recalcules. C'est sensible sur mobile.

Implementation :
- Remplacer `previewLines.map(... motion.span ...)` par un seul bloc texte (`pre`, `div whitespace-pre-line` ou composant memoise).
- Animer seulement le conteneur a l'apparition, pas chaque ligne a chaque frappe.
- Option si besoin : utiliser `useDeferredValue` pour la preview, afin que la saisie reste prioritaire.

Validation :
- Saisie fluide dans les champs `lieu`, `prenom`, `nom` sur mobile.
- React Profiler : moins de commits et moins de composants rendus pendant la saisie.

### 3. Remplacer les animations `height: auto` sur les gros blocs

Probleme : `expandIn` dans `src/lib/motion.ts` et plusieurs blocs dans `SupplementaryLeaveCard.tsx` animent `height: 'auto'`. Cette animation force des mesures de layout et peut produire des saccades.

Implementation :
- Creer un composant `Collapse` central ou une variante CSS qui limite les animations a `opacity` et `transform` pour les gros blocs.
- Garder `height` anime uniquement pour les petits contenus, avec hauteur mesuree et `overflow: clip`.
- Dans `App.tsx`, eviter `height: auto` pour `Summary`, `LetterGenerator`, `SupplementaryLeaveCard`, `PostPlanningNavBar` et les feedbacks longs.

Validation :
- Chrome Performance : pas de longues sequences "Layout" lors de l'apparition du resume/courrier.
- Verification desktop et mobile 390 px.

### 4. Stabiliser les handlers et le retour du hook principal

Probleme : plusieurs composants sont `memo`, mais `usePaternityPlanning` retourne des fonctions non memoisees (`selectBirthDate`, `selectRemainingDay`, `removeBlock`, etc.) et `App.tsx` cree aussi des wrappers a chaque rendu.

Implementation :
- Envelopper les actions de `usePaternityPlanning` avec `useCallback`.
- Memoiser l'objet retourne par le hook avec `useMemo`, ou retourner des groupes stables (`state`, `actions`, `supplementary`).
- Supprimer les wrappers inutiles dans `App.tsx` quand ils ne font que relayer une fonction.
- Garder les wrappers seulement quand ils ajoutent un comportement local (`handleFocusCalendar`, confirmation, scroll).

Validation :
- React Profiler : `Calendar`, `ScenarioSelector`, `PlanningModeSelector` ne doivent pas re-render sur une saisie dans le courrier.
- Aucun changement de comportement sur les tests existants.

### 5. Centraliser les ecoutes de scroll

Probleme : scroll gere dans `useScrollOrchestrator`, `NavigationAnchor`, `ScrollIndicator`, `HeroHeader` via `useScroll`, plus plusieurs `scrollIntoView` directs. Cela augmente les lectures layout et peut creer des mouvements concurrents.

Implementation :
- Creer `src/hooks/usePageScrollState.ts` ou `src/lib/scroll.ts`.
- Centraliser :
  - detection `hasScrolledPastStart` ;
  - section active via `IntersectionObserver` sur desktop et mobile ;
  - respect de `prefers-reduced-motion` pour tous les scrolls ;
  - throttling `requestAnimationFrame` si un fallback scroll est necessaire.
- Remplacer les `window.scrollTo` et `scrollIntoView({ behavior: 'smooth' })` directs par une fonction commune.

Validation :
- Plus d'un seul listener scroll global hors fallback.
- Reduced motion : tous les scrolls passent en `auto`.
- Navigation stable sans clignotement de section active.

### 6. Stabiliser la grille mobile du `ScenarioSelector`

Probleme : sur mobile, le scenario selectionne passe en `col-span-2`, ce qui reorganise la grille a chaque changement et donne un saut visuel.

Implementation :
- Retirer le `col-span-2` dynamique.
- Garder une grille stable `grid-cols-2`.
- Afficher les details du scenario selectionne dans une zone fixe sous la grille ou dans des cartes de hauteur stable.

Validation :
- Changement de situation sans saut vertical fort sur 390 px.
- Pas de debordement horizontal.

### 7. Rendre le logo du hero non destructif

Probleme : le bouton calendrier du hero declenche aussi la reinitialisation. Ce pattern est ambigu et nuit au ressenti premium.

Implementation :
- Dans `HeroHeader.tsx`, retirer `onClick={onResetRequest}` du logo calendrier.
- Garder uniquement le bouton explicite `Reinitialiser`.
- Supprimer `useScroll` / `useTransform` du logo si l'effet de scale n'apporte pas de valeur mesurable.

Validation :
- Cliquer le logo ne supprime plus le planning.
- Le bouton de reset explicite fonctionne toujours avec confirmation.

## P1 - Rendu premium et stabilite visuelle

### 8. Normaliser radius, ombres et elevations

Probleme : coexistence de `rounded-2xl`, `rounded-[1.5rem]`, `rounded-3xl`, ombres colorees et elevations ad hoc.

Implementation :
- Ajouter des tokens Tailwind :
  - `borderRadius.card`
  - `borderRadius.control`
  - `boxShadow.card`
  - `boxShadow.popover`
  - `boxShadow.focus`
- Remplacer les valeurs ponctuelles dans `SectionCard`, `Calendar`, `Summary`, `LetterGenerator`, `SupplementaryLeaveCard`, `PlanningModeSelector`, `ResetConfirmDialog`.
- Limiter les ombres colorees aux etats vraiment actifs.

Validation :
- Scan `rg "rounded-\\[|rounded-3xl|shadow-.*500|shadow-.*600" src`.
- Les cartes principales ont une elevation coherente.

### 9. Limiter les hover transforms aux devices hover

Probleme : beaucoup de `hover:-translate-y`, `hover:scale`, `group-hover:scale` sont presents. Sur tactile, certains hover peuvent rester colles ou donner une sensation instable.

Implementation :
- Encapsuler les micro-transforms dans `@media (hover: hover) and (pointer: fine)`.
- Ajouter des variantes CSS utilitaires si besoin : `.hover-lift`, `.hover-scale-icon`.
- Garder `active:scale` seulement sur les vrais boutons.

Validation :
- Sur mobile, aucun element ne reste visuellement en hover apres tap.
- Sur desktop, le feedback hover reste subtil et coherent.

### 10. Reduire les surfaces en blur et decorations floues

Probleme : `backdrop-blur-xl`, `blur-3xl`, gradients et halos sont utilises sur cartes, hero, calendrier, nav et modales. Cela coute du compositing et peut faire moins premium quand tout brille.

Implementation :
- Supprimer les halos decoratifs non fonctionnels :
  - decoration interne de `SectionCard` ;
  - blur derriere le calendrier ;
  - blur decoratif du logo hero si `useScroll` est retire.
- Garder le blur uniquement pour les overlays/modales et navigations sticky si necessaire.
- Preferer surfaces blanches, bordures fines et ombres neutres.

Validation :
- Chrome Layers : moins de couches compositees.
- Perception plus calme, moins "landing page".

### 11. Fusionner les navigations post-planning

Probleme : `NavigationAnchor` et `PostPlanningNavBar` coexistent apres planification. Cela ajoute deux navigations sticky et consomme de l'espace utile, surtout sur mobile.

Implementation :
- Integrer les liens post-planning dans `NavigationAnchor`.
- Ou masquer `PostPlanningNavBar` sur mobile et le garder seulement comme bandeau desktop non sticky.
- Garantir une seule navigation sticky visible a la fois.

Validation :
- Mobile 390 px : calendrier et contenu restent lisibles, pas d'empilement sticky.
- Navigation clavier conservee.

### 12. Repenser les bannieres sticky de selection

Probleme : la banniere de selection visuelle et l'etape finale sont `sticky top-4` sur mobile. Elles peuvent couvrir le calendrier et donner une interface chargee.

Implementation :
- Sur mobile, convertir ces messages en bottom sheet compact au-dessus de la navigation basse, ou en instruction inline juste avant le calendrier.
- Sur desktop, conserver un sticky discret si utile.
- Limiter la hauteur et garantir un bouton annuler visible.

Validation :
- Sur 390 px, la banniere ne couvre pas les dates selectionnables.
- Pas de conflit avec `NavigationAnchor`.

## P2 - Bundle, chargement initial et rendu hors viewport

### 13. Reduire la presence de Framer Motion dans le bundle initial

Probleme : le chunk principal reste a 406.89 kB brut / 125.11 kB gzip. Framer Motion est importe dans le hero, l'app, le calendrier, le stepper, les navigations et plusieurs composants initiaux.

Implementation :
- Etudier `LazyMotion` + `m` avec `domAnimation`.
- Remplacer les animations d'entree simples par CSS (`opacity`, `transform`) quand Framer n'apporte pas de valeur.
- Garder Framer pour les cas a forte valeur : modales, navigation active `layoutId`, transitions complexes.
- Mesurer avant/apres avec le build.

Validation :
- Baisse mesuree du chunk principal gzip : 125.11 kB -> 75.29 kB.
- Framer Motion charge uniquement avec les composants lazy qui l'utilisent encore.

### 14. Ajouter `content-visibility` aux sections sous la ligne de flottaison

Probleme : les sections basses peuvent participer au rendu initial meme quand elles sont hors viewport.

Implementation :
- Ajouter une utilite CSS type `.content-auto`.
- Appliquer avec prudence a `summary`, `letter`, `legal`, `conge-supplementaire`.
- Definir `contain-intrinsic-size` pour eviter les sauts.

Validation :
- Pas de regression sur les ancres.
- CLS stable sous 0.05 dans Lighthouse.

### 15. Mettre a jour Browserslist/caniuse-lite

Probleme : le build signale des donnees vieilles de 6 mois.

Implementation :
- Executer `npx update-browserslist-db@latest`.
- Verifier les changements dans `package-lock.json`.

Validation :
- `npm run build` sans avertissement Browserslist.

### 16. Revoir les imports date/locale de l'interface

Probleme : `date-fns` est utilise partout, y compris pour du formatage d'affichage. C'est probablement tree-shake, mais a verifier dans l'analyse bundle.

Implementation :
- Conserver `date-fns` pour les calculs metier purs.
- Evaluer `Intl.DateTimeFormat('fr-FR')` pour les labels UI repetitifs si cela reduit le bundle.
- Ne pas changer la logique legale sans tests.

Validation :
- Bundle compare avant/apres.
- Tests metier inchanges.

## P2 - Micro-interactions et polish

### 17. Renforcer le composant `Button`

Implementation :
- Ajouter `aria-hidden="true"` aux icones decoratives.
- Sortir les hover transforms du style de base et les appliquer selon variant/contexte.
- Prevoir un etat `isLoading` si une future action asynchrone est ajoutee.

Validation :
- Boutons accessibles au clavier.
- Pas de mouvement parasite sur mobile.

### 18. Donner un feedback immediat au calendrier sans reflow

Probleme : apres selection d'une date, le retour depend surtout du message de succes et du recalcul de planning.

Implementation :
- Ajouter un etat visuel local tres court sur le jour clique (`data-pressed`, ring temporaire ou overlay CSS).
- Eviter une animation globale de la grille.
- Garder le feedback compatible clavier.

Validation :
- Tap mobile : feedback instantane sous 100 ms.
- Pas de saut de calendrier.

### 19. Stabiliser les fallbacks lazy

Probleme : les hauteurs de `LazyFallback` sont fixes mais approximatives. Elles peuvent creer un saut a l'arrivee du vrai composant.

Implementation :
- Creer des skeletons par section avec dimensions proches du contenu final.
- Desactiver `animate-pulse` si reduced motion.
- Preferer `min-height` responsive plutot qu'une hauteur unique.

Validation :
- CLS limite lors du chargement de `LetterGenerator`, `SupplementaryLeaveCard`, `LegalReferences`.

### 20. Simplifier les effets de celebration

Probleme : la modale de celebration cumule particules, stagger, scale spring et overlay blur. Elle est correcte mais peut etre simplifiee pour rester premium.

Implementation :
- Reduire le nombre de particules ou les remplacer par un simple check anime.
- Garder une transition courte, sans rebond excessif.
- Verifier le focus et le scroll-lock apres simplification.

Validation :
- Modal fluide sur mobile.
- Focus trap et restauration du focus OK.

## P3 - Garde-fous qualite

### 21. Ajouter une checklist de verification UI/performance

Implementation :
- Completer `docs/REVIEW_CHECKLIST.md` avec :
  - mobile 390 px ;
  - desktop ;
  - console sans erreur ;
  - reduced motion ;
  - pas de double navigation sticky ;
  - pas de saut layout visible apres lazy load.

Validation :
- Checklist relue avant merge.

### 22. Ajouter un budget de performance

Implementation :
- Definir les budgets cibles dans un document ou une config :
  - JS initial gzip <= 110 kB ;
  - CSS gzip <= 10 kB ;
  - CLS <= 0.05 ;
  - Lighthouse Performance mobile >= 90 ;
  - aucun long task > 50 ms sur le parcours principal.
- Option avec dependance dev justifiee : ajouter un visualiseur de bundle seulement si le suivi manuel devient insuffisant.

Validation :
- Les chiffres sont releves a chaque changement UI majeur.

### 23. Ajouter des captures de non-regression UI

Implementation :
- Si une dependance de test navigateur est acceptee : Playwright desktop + mobile 390 px.
- Scenarios minimaux :
  - etat initial ;
  - date selectionnee ;
  - choix mode simple ;
  - planning complet ;
  - courrier ouvert ;
  - reduced motion.

Validation :
- Captures comparees avant/apres pour les chantiers UI.

## Ordre conseille

1. P0.1 a P0.4 : gains rapides et mesurables sur chargement, saisie et renders.
2. P0.5 a P0.7 : scroll, layout mobile et interaction destructrice.
3. P1.8 a P1.12 : harmonisation premium.
4. P2.13 a P2.20 : optimisation bundle et polish.
5. P3.21 a P3.23 : garde-fous pour eviter les regressions.

## Validations finales attendues

- `git status --short --branch` verifie avant et apres.
- `npm run typecheck`.
- `npm test -- --run`.
- `npm run build`.
- Verification navigateur desktop.
- Verification navigateur mobile 390 px.
- Console navigateur sans erreur.
- Reduced motion teste.
- Lighthouse ou Performance trace compare avant/apres pour les chantiers P0/P2.
