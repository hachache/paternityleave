export function getSupplementaryLeaveStatusLabel(
  periodsProjected: boolean,
  canPlan: boolean,
  canStartNow = false
): string {
  if (periodsProjected) return 'Projeté';
  if (canPlan && !canStartNow) return 'Planifiable';
  if (canPlan) return 'Optionnel';
  return 'À venir';
}
