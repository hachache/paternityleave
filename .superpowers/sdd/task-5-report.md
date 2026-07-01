# Task 5: Visual Fluidity Audit - Press Feedback, Touch Hover, Tap Targets, Keyboard Nav

## Changes Applied

### Fix 1: SupplementaryLeaveCard - Press feedback on buttons
- **File**: `src/components/SupplementaryLeaveCard.tsx`
- Added `active:scale-95` to duration option buttons (1 mois / 2 mois) and mode option buttons (consecutive / split)
- Both button groups share the same className pattern and were updated via `replace_all`

### Fix 2: CelebrationModal - Press feedback on action buttons
- **File**: `src/components/CelebrationModal.tsx`
- Added `active:scale-95 transition-transform` to both action buttons (line 236 and line 245):
  - "Configurer le congé supplémentaire" button
  - "Generer le courrier employeur" / "Generer le courrier" button

### Fix 3: PlanningModeSelector - Press feedback on choice cards
- **File**: `src/components/PlanningModeSelector.tsx`
- Added `active:scale-[0.98]` to both choice cards:
  - Recommended card (Mode simple, line 102)
  - Custom card (Mode personnalise, line 146)

### Fix 4: Calendar - Disable hover effects on touch devices
- **File**: `src/components/Calendar.tsx`
- In `getDayClasses()`: conditionally applied `hover:bg-success-600 hover:-translate-y-0.5` and `hover:bg-brand-50 hover:text-brand-700` based on `isCoarsePointer`
- Added `isCoarsePointer` to the `useCallback` dependency array to keep the function current

### Fix 5: Footer "Remonter" button - Increase tap target
- **File**: `src/App.tsx`
- Changed `min-h-10` (40px) to `min-h-11` (44px) on the scroll-to-top button to meet WCAG minimum touch target

### Fix 6: ScenarioSelector - Arrow key navigation
- **File**: `src/components/ScenarioSelector.tsx`
- Added `onKeyDown` handler on the `role="radiogroup"` container
- ArrowDown/ArrowRight: move to next scenario (with wrap from last to first)
- ArrowUp/ArrowLeft: move to previous scenario (with wrap from first to last)
- Calls `onScenarioChange` with the new scenario's id

## Verification
- `npm test`: All **134 tests pass**
- `npm run build`: Build succeeds
- Commit: `fix(ux): add press feedback, disable hover on touch, fix tap targets, add radio keyboard nav`
