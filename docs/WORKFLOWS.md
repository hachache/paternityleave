# Workflows Codex

## Nouvelle feature
Prompt type :

```txt
Goal: implementer [feature].
Context: lis AGENTS.md, docs/PROJECT_GOALS.md, docs/PRODUCT_RULES.md si metier, docs/UI_GUIDELINES.md si UI.
Constraints: changement minimal, pas de refonte hors scope, ne pas casser le parcours principal.
Done when: npm run typecheck, npm test -- --run, npm run build OK. Verification navigateur si UI.
```

## Bugfix
Prompt type :

```txt
Bug: [description].
Repro:
1. [etape]
2. [etape]
Expected: [resultat]
Actual: [resultat]
Constraints: fix minimal, test de regression si possible.
Done when: repro corrigee + typecheck/tests/build OK.
```

## Changement legal
Prompt type :

```txt
Verifie les sources officielles recentes pour [sujet], puis implemente la mise a jour.
Contraintes: citer les sources, documenter l'hypothese, ajouter tests unitaires, mettre a jour docs/PRODUCT_RULES.md si necessaire.
Done when: typecheck/tests/build OK + parcours UI coherent.
```

## UI/design
Prompt type :

```txt
Ameliore [zone UI] selon docs/UI_GUIDELINES.md.
Contraintes: ne pas changer la logique metier, rester sobre, verifier mobile 390px et desktop.
Done when: build OK + verification navigateur + pas d'erreur console.
```

## Review avant merge
Prompt type :

```txt
Utilise docs/REVIEW_CHECKLIST.md et fais une review des changements non commites.
Findings d'abord, par severite, avec fichier:ligne.
Si aucun finding, dis-le et liste les risques residuels.
```

## Mise a jour du contexte Codex
Prompt type :

```txt
Nous avons repete cette erreur : [erreur].
Fais une retrospective courte et propose une mise a jour concrete de AGENTS.md ou docs/*.md pour l'eviter.
```
