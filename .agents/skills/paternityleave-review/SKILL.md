---
name: paternityleave-review
description: Utiliser pour auditer les changements du simulateur de conge paternite avant merge, avec focus sur logique legale 2026, regressions UI, tests, build et accessibilite.
---

# Paternityleave Review

## Quand utiliser
Utiliser cette skill quand l'utilisateur demande :
- une review avant merge ;
- une verification du simulateur ;
- un audit de logique 2026 ;
- une validation UI/mobile ;
- une verification avant push ou PR.

## Contexte a lire
- `AGENTS.md`
- `docs/PROJECT_GOALS.md`
- `docs/PRODUCT_RULES.md` si logique metier ou legale touchee
- `docs/UI_GUIDELINES.md` si UI touchee
- `docs/REVIEW_CHECKLIST.md`
- `docs/REFERENCES_LEGALES.md` si regle legale touchee

## Workflow
1. Verifier `git status --short --branch`.
2. Inspecter le diff et identifier les fichiers touches.
3. Classer les risques : legal/metier, UI, accessibilite, tests, build, Git.
4. Si validation demandee, lancer les commandes pertinentes :
   - `npm run typecheck`
   - `npm test -- --run`
   - `npm run build`
5. Pour UI, verifier navigateur desktop/mobile quand faisable.
6. Repondre avec findings d'abord, par severite, avec references `fichier:ligne`.

## Regles
- Ne pas modifier le code pendant une review sauf demande explicite.
- Ne pas commit sans demande explicite.
- Ne pas push sans demande explicite.
- Pour les points legaux, demander ou effectuer une verification web officielle si l'information peut avoir change.
