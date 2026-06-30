# Audit UX/UI Apple-like - Critical

Date: 2026-06-30
Surface: simulateur conge paternite, design Apple-like apres refonte tokens.
Capture tool: Codex in-app browser.

## Screenshots
- 01-desktop-start.png: premier ecran desktop 1280x720.
- 02-mobile-start.png: premier ecran mobile 390x844.
- 03-mobile-success-modal.png: modale planification complete.
- 04-mobile-supplementary.png: module 2026 avant activation.
- 05-mobile-supplementary-enabled.png: module 2026 active.

## Step Notes

1. Desktop start
Health: medium.
Strengths: typography closer to SF, no horizontal overflow, calmer cards, Apple blue token applied.
Issues: calendar title sits at the viewport bottom and is visually cut; first task action is lower than expected for a task-first tool.
Accessibility risks: none visible from screenshot beyond action discoverability.
Limits: screenshot cannot prove keyboard navigation.

2. Mobile start
Health: medium-low.
Strengths: visually clean, no overflow, scenario controls are readable.
Issues: hero + situation + stepper consume too much vertical space; calendar action is mostly below the fold. This regresses the previous UX goal of action visible fast.
Accessibility risks: no visible contrast failure, but task discoverability is weaker.
Limits: screenshot only.

3. Success modal
Health: medium.
Strengths: flow is clear and reassuring, focus enters the primary action.
Issues: orange focus ring on blue CTA is visually non-Apple and too heavy; modal still uses old glossy/celebratory language compared to the new quieter DA.
Accessibility risks: focus is visible, but color is visually distracting rather than integrated.
Limits: no screen reader test.

4. Supplementary leave before activation
Health: medium.
Strengths: module is discoverable and status is clear.
Issues: bottom nav is visible immediately in module context and competes with content.
Accessibility risks: none visible from screenshot.
Limits: only one scroll position checked.

5. Supplementary leave enabled
Health: medium-low.
Strengths: legal data is visible and date constraints exist.
Issues: switch is too large and visually detached on the left; activated controls still use old rounded-2xl/shadow-md/slate-900 styles, inconsistent with Apple-like tokens; date input starts below the fold after activation.
Accessibility risks: switch has aria state; screenshots cannot confirm tab order.
Limits: screenshot cannot validate all date combinations.

## Validation
- npm run typecheck: pass.
- npm run lint: pass.
- npm run build: pass.
- npm test -- --run: pass, 137 tests.
- Browser console warnings/errors after capture: none.
