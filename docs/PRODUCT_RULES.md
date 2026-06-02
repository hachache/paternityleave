# Regles produit et metier

Derniere revision contexte : 2026-05-21.

## Sources de verite
- Service-Public : https://www.service-public.gouv.fr/
- Ameli : https://www.ameli.fr/
- Legifrance : https://www.legifrance.gouv.fr/
- Documentation interne : `docs/REFERENCES_LEGALES.md`.
- Guide maintenance : `docs/MAINTENIR_REFERENCES_LEGALES.md`.

## Regles paternite actuellement modelisees
- Conge de naissance employeur : 3 jours ouvrables.
- Periode obligatoire : 4 jours calendaires immediatement apres le conge de naissance.
- Jours fractionnables standard : 21 jours calendaires.
- Naissances multiples : 28 jours calendaires fractionnables.
- Hospitalisation du nouveau-ne : delai etendu selon le scenario configure.
- Adoption : scenario separe, avec regles affichees dans l'interface.

## Conge supplementaire de naissance 2026
Regles connues a verifier avant modification :
- Enfants nes ou arrives au foyer a partir du 1 janvier 2026.
- Demande / planification possible a partir du 1 juin 2026, pour respecter le preavis employeur d'1 mois.
- Mobilisable effectivement a partir du 1 juillet 2026 : aucune periode ne doit commencer avant cette date.
- Duree : 1 ou 2 mois par parent.
- Fractionnement possible en deux periodes d'un mois.
- Transition premier semestre 2026 : delai maximal jusqu'au 31 mars 2027 selon Ameli et Service-Public.
- Il s'ajoute aux conges existants et ne les remplace pas.
- Les modalites d'indemnisation et de prise doivent etre reverifiees avant toute evolution produit.

Sources officielles consultees :
- https://www.ameli.fr/assure/actualites/qu-est-ce-que-le-conge-supplementaire-de-naissance
- https://www.service-public.gouv.fr/particuliers/actualites/A18750
- https://www.service-public.gouv.fr/particuliers/vosdroits/F39685
- https://www.service-public.gouv.fr/particuliers/vosdroits/F39693
- https://www.service-public.gouv.fr/particuliers/vosdroits/F16225

## Politique en cas de doute
- Naviguer vers les sources officielles recentes avant de coder ou de repondre.
- Preferer l'interpretation restrictive si plusieurs lectures sont possibles.
- Ajouter un message UI si la regle depend de decrets ou d'une incertitude.
- Ajouter un test pour chaque hypothese retenue.

## Tests attendus
- Tests unitaires dans `src/utils/__tests__/` pour toute regle metier.
- Tests des dates limites, transitions, cas avant/apres entree en vigueur.
- Tests des erreurs ou blocages utilisateur.
- Tests de non-regression pour tout bug de calcul.
