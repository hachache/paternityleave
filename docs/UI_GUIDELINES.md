# Guidelines UI

## Direction visuelle
- Outil premium, sobre, oriente tache.
- Inspiration Apple-like : blanc, gris tres clair, noir, bleu d'accent, beaucoup d'espace.
- Eviter l'effet landing page trop demonstratif.
- Texte clair, cartes utiles, animations discretes.

## Palette et style
- Fond principal clair : `#ffffff` / `#f5f5f7`.
- Texte principal : `#1d1d1f` ou equivalent slate tres sombre.
- Accent : bleu type Apple `#0071e3` ou token `brand` existant.
- Ombres legeres, radius controles, pas de decoration gratuite.

## Composants
- Reutiliser `Button`, `SectionCard`, `FeedbackBanner`, `Summary`, `Calendar`, `ScenarioSelector`.
- Ne pas creer de systeme parallele de boutons, cartes ou spacing.
- Garder les vraies cartes pour les choix, calendrier, resume, courrier et modules interactifs.
- Les modules secondaires doivent rester compacts.

## Responsive
- Mobile-first.
- Verifier au minimum largeur 390px et desktop.
- Pas de debordement horizontal.
- Titres centres et tailles reduites sur mobile.
- Actions principales visibles rapidement.

## Accessibilite
- Focus visible sur tous les controles.
- Boutons avec labels comprehensibles.
- Switches avec role/etat ARIA.
- Contrastes suffisants.
- Navigation clavier preservee.

## Animations
- Transitions opacity/translate legeres.
- Eviter les animations decoratives excessives.
- Respecter `prefers-reduced-motion` quand une animation globale est ajoutee.

## Verification UI
- Lancer `npm run dev`.
- Verifier le parcours : situation, date, calendrier, resume, courrier, legal.
- Verifier mobile et desktop.
- Verifier la console navigateur.
