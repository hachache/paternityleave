# Conge Paternite - App React

Application React + Vite + TypeScript pour planifier le conge de paternite et d'accueil de l'enfant en France, avec contexte legal 2026 documente.

## Demarrage

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm test -- --run
npm run build
```

## Preview production

```bash
npm run build
npm run preview
```

## Architecture

- Layout principal : `src/App.tsx`
- Composants UI : `src/components/`
- Hooks d'orchestration : `src/hooks/`
- Logique metier testable : `src/utils/`
- Tests : `src/utils/__tests__/`
- Styles globaux : `src/index.css`
- Configuration Tailwind : `tailwind.config.js`

## Setup Codex

Ce repo contient un setup Codex dedie :

- `AGENTS.md` : instructions durables du projet.
- `docs/PROJECT_GOALS.md` : objectifs produit.
- `docs/PRODUCT_RULES.md` : regles metier et legales a respecter.
- `docs/UI_GUIDELINES.md` : direction UI et contraintes responsive/accessibilite.
- `docs/WORKFLOWS.md` : prompts et workflows reutilisables.
- `docs/REVIEW_CHECKLIST.md` : checklist avant merge.
- `.codex/config.toml` : configuration Codex locale au projet.
- `.agents/skills/paternityleave-review/SKILL.md` : skill de review dediee.

## References legales

- `docs/REFERENCES_LEGALES.md`
- `docs/MAINTENIR_REFERENCES_LEGALES.md`

Toute modification de logique legale doit verifier les sources officielles recentes : Service-Public, Ameli, Legifrance.
