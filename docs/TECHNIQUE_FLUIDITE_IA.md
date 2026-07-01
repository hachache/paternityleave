# Technique fluidite pour les IA

Ce projet doit rester tres fluide, proche de la sensation du repo `hedicv` :
animations visibles, mais jamais au prix d'un scroll ou d'une interaction qui accroche.

## Regles principales

- Privilegier `opacity` et `transform` pour les animations.
- Eviter les animations de `height`, `width`, `top`, `left`, `margin`, `padding` et `box-shadow` lourd.
- Ne pas utiliser `height: auto` dans Framer Motion pour afficher ou masquer un gros bloc.
- Remplacer `transition-all` par des transitions ciblees :
  `transition-[background-color,border-color,color,box-shadow,transform]`.
- Batcher tout travail lie au scroll avec `requestAnimationFrame`.
- Ne mettre a jour un state React de scroll que si la valeur visible change vraiment.
- Desactiver les effets decoratifs lourds sur mobile, viewport etroit ou pointeur tactile.
- Respecter `prefers-reduced-motion`.
- Garder les animations courtes : environ 180 a 260 ms pour les transitions UI.

## Politique motion du projet

La source de verite est `src/lib/motion.ts`.

Utiliser `useAppMotion()` plutot que `useReducedMotion()` directement dans les composants.
Cette API renvoie notamment :

- `shouldReduce` : motion reduite ou contrainte.
- `shouldConstrain` : viewport etroit ou pointeur tactile.
- `allowDecorativeMotion` : autorise les decorations animees ou floutees.
- `allowLayoutMotion` : autorise les animations de layout.
- `scrollBehavior` : `smooth` sur desktop fluide, `auto` en motion contrainte.
- `transition` : transition courte et bornee.

Pour une nouvelle animation :

```ts
const { allowDecorativeMotion, shouldReduce, transition } = useAppMotion();
```

Puis :

- si l'animation est decorative, la conditionner avec `allowDecorativeMotion`;
- si elle bouge du layout, la conditionner avec `allowLayoutMotion`;
- si elle lance un scroll, utiliser `scrollBehavior`;
- si elle est purement fonctionnelle, utiliser `transition`.

## Pattern scroll

Ne jamais faire ceci :

```ts
window.addEventListener('scroll', () => {
  setVisible(window.scrollY > 200);
});
```

Faire ceci :

```ts
let frameId = 0;
let previous = false;

const update = () => {
  frameId = 0;
  const next = window.scrollY > 200;
  if (next === previous) return;
  previous = next;
  setVisible(next);
};

const onScroll = () => {
  if (frameId !== 0) return;
  frameId = window.requestAnimationFrame(update);
};
```

## Flous et surfaces premium

Les effets `backdrop-blur-*`, `blur-3xl`, grosses ombres et overlays fixes doivent etre reserves
au desktop quand ils apportent vraiment quelque chose.

Sur mobile ou tactile :

- preferer `bg-white` ou une couleur opaque;
- supprimer les decorations floutees;
- eviter les ombres animees;
- garder le focus sur la reactivite des controles.

## Checklist avant validation

- `npm run typecheck`
- `npm test -- --run`
- `npm run build`
- Verification desktop et mobile quand un navigateur est disponible.
- Recherche rapide de regressions :

```bash
rg -n "height: 'auto'|transition-all|addEventListener\\('scroll'|useScroll|blur-3xl|backdrop-blur" src
```

Si un nouveau resultat apparait, il doit etre justifie.
