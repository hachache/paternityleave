import { format, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export type CalendarDayType = 'birth' | 'employer' | 'mandatory' | 'remaining' | null;
export type CalendarDayAction = 'select' | 'remove' | 'static';

export interface CalendarDayMetadata {
  type: CalendarDayType;
  selectable: boolean;
  reason?: string;
  action: CalendarDayAction;
}

interface CalendarDayAriaContext {
  eventDateLabel: string;
  eventDateActionLabel: string;
  selectActionLabel?: string;
}

export function getInitialEventDateMetadata(
  eventDateActionLabel = 'date de naissance'
): CalendarDayMetadata {
  return {
    type: null,
    selectable: true,
    reason: `Sélectionner comme ${eventDateActionLabel}`,
    action: 'select'
  };
}

export function buildCalendarDayAriaLabel(
  date: Date,
  metadata: CalendarDayMetadata,
  context: CalendarDayAriaContext
): string {
  const formattedDate = format(startOfDay(date), 'EEEE d MMMM yyyy', { locale: fr });
  const parts = [formattedDate];

  if (metadata.type === 'birth') {
    parts.push(context.eventDateLabel);
  } else if (metadata.type === 'employer') {
    parts.push('période employeur');
  } else if (metadata.type === 'mandatory') {
    parts.push('période obligatoire');
  } else if (metadata.type === 'remaining') {
    parts.push('période planifiée');
  } else if (metadata.reason) {
    parts.push(metadata.reason);
  }

  if (metadata.action === 'select') {
    parts.push(
      metadata.type === null
        ? context.selectActionLabel ?? `sélectionner cette date comme ${context.eventDateActionLabel}`
        : 'sélectionner cette date'
    );
  } else if (metadata.action === 'remove') {
    parts.push('retirer la période planifiée');
  } else if (!metadata.selectable && metadata.reason) {
    parts.push('non sélectionnable');
  }

  return parts.join(', ');
}
