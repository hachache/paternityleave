# Task 1 Report: CLS Fix — Animate height on conditional blocks

## What was changed

- **src/lib/motion.ts**: Added `expandIn` variant animating both `opacity` and `height` (0 → auto).
- **src/App.tsx**:
  - Added `expandIn` to the import from `./lib/motion`.
  - Replaced `fadeIn`/`fadeInUp` with `expandIn` on 7 `AnimatePresence` blocks:
    1. FeedbackBanner wrapper (line ~417)
    2. Visual selection banner (line ~448)
    3. Clear all blocks button (line ~518)
    4. PostPlanningNavBar (line ~543)
    5. SupplementaryLeaveCard wrapper (line ~559)
    6. Summary wrapper (line ~592)
    7. LetterGenerator wrapper (line ~620)
  - Added `className="overflow-hidden"` (or merged with existing className) on all 7 blocks.

## Verification

- **`npm test`**: All **134 tests pass** (9 test files).
- **`npm run build`**: Build completes **without errors** (vite, 960ms).

## Concerns

None. The `expandIn` variant uses the same `hidden`/`visible` pattern as the replaced variants, so all existing `exit="hidden"` and `animate="visible"` props continue to work unchanged. The `isCoarsePointer` early-exit (`initial={isCoarsePointer ? false : 'hidden'}`) is preserved on all 5 blocks that use it. The LetterGenerator's custom transition delay is also preserved.
