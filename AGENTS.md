# AGENTS.md

## Comportement
- Parler uniquement francais.
- Etre concis, direct et technique.
- Privilegier les actions verifiables aux longues explications.
- Avant toute modification significative, verifier `git status --short --branch`.
- Ne jamais ecraser, reset ou revert des changements utilisateur sans demande explicite.
- Creer une branche dediee avant un changement significatif.

## Contexte projet
- Application React + Vite + TypeScript + Tailwind pour simuler le conge de paternite et d'accueil de l'enfant en France.
- Lire `docs/PROJECT_GOALS.md` avant les changements produit importants.
- Lire `docs/PRODUCT_RULES.md` avant toute modification de logique metier ou legale.
- Lire `docs/UI_GUIDELINES.md` avant toute modification front/UI.
- Lire `docs/REVIEW_CHECKLIST.md` avant de finaliser une implementation.
- Les references legales detaillees sont dans `docs/REFERENCES_LEGALES.md` et `docs/MAINTENIR_REFERENCES_LEGALES.md`.

## Architecture
- Logique metier pure : `src/utils/`.
- Orchestration state : `src/hooks/`.
- Presentation : `src/components/`.
- Layout principal : `src/App.tsx`.
- Styles globaux et tokens Tailwind : `src/index.css` et `tailwind.config.js`.

## Commandes de validation
- Typecheck : `npm run typecheck`.
- Tests : `npm test -- --run`.
- Build : `npm run build`.
- Lint si pertinent : `npm run lint`.
- Pour un changement UI : verification navigateur desktop et mobile obligatoire quand faisable.

## Regles code
- TypeScript strict.
- Pas de code mort, pas de TODO gratuit, pas de console inutile.
- Ajouter ou adapter les tests quand la logique change.
- Garder les fonctions metier testables et sans dependance React.
- Ne pas ajouter de dependance sans justification claire.

## Regles produit/legal
- Pour tout sujet legal, verifier les sources officielles recentes avant implementation ou affirmation.
- Citer Service-Public, Ameli ou Legifrance quand une regle est modifiee.
- En cas d'ambiguite, choisir l'interpretation la plus restrictive et documenter l'hypothese.
- Ne pas presenter l'application comme conseil juridique.

## Git
- Conventional Commits si commit demande.
- Un commit = un changement logique.
- Ne pas amend sans demande explicite.
- Ne pas push sans demande explicite.
