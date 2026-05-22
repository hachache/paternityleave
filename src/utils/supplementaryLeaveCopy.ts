export function getSupplementaryLeaveStatusLabel(
  periodsProjected: boolean,
  canActivate: boolean
): string {
  if (periodsProjected) return 'Projeté';
  if (canActivate) return 'Optionnel';
  return 'À venir';
}
