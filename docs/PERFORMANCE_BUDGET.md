# Budget performance UI

Objectif : garder le simulateur rapide, fluide et premium sur mobile comme sur desktop.

## Budgets cibles

- JavaScript initial gzip : <= 110 kB.
- CSS gzip : <= 10 kB.
- CLS : <= 0.05.
- Lighthouse Performance mobile : >= 90.
- Long tasks sur parcours principal : aucune tache > 50 ms.
- Navigation sticky : une seule navigation visible a la fois.
- Reduced motion : aucun scroll ou mouvement anime force.

## Parcours a mesurer

1. Etat initial.
2. Selection de la situation.
3. Selection de la date de naissance.
4. Planification simple.
5. Planification complete.
6. Configuration du conge supplementaire si eligible.
7. Saisie dans le courrier employeur.
8. Consultation du cadre legal.

## Commandes et preuves

- `npm run build` pour relever les tailles de chunks.
- Chrome Performance ou Lighthouse pour CLS, long tasks et score mobile.
- Verification navigateur mobile 390 px et desktop.
- Console navigateur sans erreur.

## Derniere mesure

Date : 1er juillet 2026.

- JavaScript initial gzip : 75.29 kB.
- CSS gzip : 9.19 kB.
- Framer Motion : hors chemin initial, chunk async `proxy-*.js` de 40.76 kB gzip.
- `npm run build` : OK.
