# Checklist review

## Avant validation
- [ ] `git status --short --branch` verifie.
- [ ] Diff relue.
- [ ] Pas de changement hors scope.
- [ ] Pas de code mort, TODO gratuit ou console inutile.
- [ ] Typecheck OK.
- [ ] Tests OK.
- [ ] Build OK.

## Logique metier
- [ ] Sources officielles verifiees si sujet legal.
- [ ] Regles documentees dans `docs/PRODUCT_RULES.md` ou docs legales.
- [ ] Tests unitaires ajoutes ou adaptes.
- [ ] Cas limites importants couverts.
- [ ] Messages utilisateur clairs en cas d'incertitude.

## Front/UI
- [ ] Desktop OK.
- [ ] Mobile 390px OK.
- [ ] Pas de debordement horizontal.
- [ ] Focus visible et controles accessibles.
- [ ] Console navigateur sans erreur.

## Git
- [ ] Branche dediee pour changement significatif.
- [ ] Commit Conventional Commit si demande.
- [ ] Push seulement si demande.
