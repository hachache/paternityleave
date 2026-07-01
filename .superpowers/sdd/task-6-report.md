# Task 6: Visual Fluidity Polish - Report

## Changes Applied

### Fix 1: Reduce calendar highlight transition duration
- **File**: `src/App.tsx`
- **Change**: `duration-500` → `duration-300` on the calendar container's `transition-shadow` class (line 330)
- **Effect**: Snappier highlight feedback when focusing the calendar

### Fix 2: Speed up CelebrationModal entrance
- **File**: `src/components/CelebrationModal.tsx`
- **Change**: Spring `stiffness: 200` → `stiffness: 300` (line 168), kept `damping: 15`
- **Effect**: Faster, less sluggish entrance animation (~300ms instead of ~400-500ms)

### Fix 3: Better LazyFallback skeleton heights
- **File**: `src/App.tsx`
- **Changes**:
  - LegalReferences: `h-96` (384px) → `h-[600px]`
  - SupplementaryLeaveCard: `h-80` (320px) → `h-[400px]`
  - LetterGenerator: `h-96` (384px) → `h-[600px]`
  - CelebrationModal: kept `h-48` (modal overlay, no CLS concern)
- **Effect**: Reduced CLS impact; skeletons better match real content height

### Fix 4: Gate smooth scroll with reduced motion
- **File**: `src/hooks/useScrollOrchestrator.ts`
- **Changes**:
  - Imported `useReducedMotion` from `framer-motion`
  - Added `shouldReduce` state
  - Gated `smoothScrollTo` and `scheduleSmoothScroll`: `behavior: shouldReduce ? 'auto' : 'smooth'`
- **Effect**: Respects user's `prefers-reduced-motion` setting for all programmatic scrolls

### Fix 5: Fix manifest.json for PWA
- **File**: `public/manifest.json`
- **Changes**:
  - `theme_color`: `#14b8a6` → `#ffffff` (matches HTML meta tag)
  - Updated icons array: added 192x192 and 512x512 placeholder entries using `social-card.png`
  - Note: JSON does not support comments, so the requested TODO comment about dedicated PWA icons could not be added inline. Consider generating proper PWA icons and adding them.
- **Effect**: PWA manifest `theme_color` matches document meta tag; PWA installability requirements better met with multiple icon sizes

### Fix 6: Replace layout animations with CSS transitions in PlanningModeSelector
- **File**: `src/components/PlanningModeSelector.tsx`
- **Changes**: Removed `layout` prop and Framer Motion `transition` prop from 6 `motion.div` elements (block counter displays and progress bar segments). Replaced with `transition-all duration-300 ease-out` CSS class.
- **Unused cleanup**: Removed unused `springs` import and `shouldReduce` destructuring
- **Effect**: Eliminates Framer Motion layout measurement overhead during rapid slider drags, reducing thrashing

### Fix 7: Replace height:auto with scaleY in SupplementaryLeaveCard
- **File**: `src/components/SupplementaryLeaveCard.tsx`
- **Changes**: In 3 nested `AnimatePresence` sections:
  - `height: 0` → `scaleY: 0`
  - `height: 'auto'` → `scaleY: 1`
  - Added `origin-top` class to each animated div
  - Kept `overflow-hidden`
- **Effect**: Eliminates synchronous layout measurement (`height: 'auto'`) in favor of GPU-accelerated scale animation

## Test Results
- **Tests**: 134 passed (9 test files)
- **Build**: Succeeded (601ms)
- **No regressions** detected

## Concerns
- The manifest.json cannot include a comment as requested (JSON spec forbids comments). A dedicated `.gitkeep`-style note in the report serves as the reminder instead. Consider creating proper PWA icons and updating the manifest when a design resource is available.
- `shouldReduce` from `useReducedMotion()` could return `null` initially (SSR). The `scrollIntoView` fallback is `'auto'` which is a valid CSS value, so this is safe.
