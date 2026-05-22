# Objectifs projet

## Mission
Fournir un simulateur clair, fiable et rapide pour planifier le conge de paternite et d'accueil de l'enfant en France, avec integration prudente du conge supplementaire de naissance 2026.

## Utilisateur cible
- Parent salarie ou futur parent qui veut comprendre et planifier ses droits.
- Utilisateur non expert du droit social.
- Usage principal : choisir une date, visualiser les periodes, obtenir un recapitulatif et generer un courrier.

## Priorites produit
- Exactitude des calculs et tracabilite des sources.
- Parcours simple : date de naissance, situation, calendrier, resume, courrier.
- Interface lisible, calme et responsive.
- Explications courtes, utiles et non anxiogenes.
- Tests automatiques pour chaque regle metier importante.

## Non-objectifs
- Ne pas remplacer un avis juridique, RH ou CPAM.
- Ne pas couvrir toutes les conventions collectives ou accords d'entreprise.
- Ne pas traiter les cas internationaux ou transfrontaliers sans specification dediee.
- Ne pas complexifier l'interface principale pour des cas rares sans validation produit.

## Definition de termine
- Le parcours utilisateur principal fonctionne.
- `npm run typecheck`, `npm test -- --run` et `npm run build` passent.
- Les changements metier ont des tests unitaires.
- Les changements UI sont verifies en desktop et mobile.
- Les hypotheses legales sont documentees dans le code ou la documentation.
