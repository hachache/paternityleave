import type { RefObject } from 'react';

export function getScrollBehavior(shouldReduce: boolean | null | undefined): ScrollBehavior {
  return shouldReduce ? 'auto' : 'smooth';
}

export function scrollToTop(shouldReduce: boolean | null | undefined): void {
  window.scrollTo({ top: 0, behavior: getScrollBehavior(shouldReduce) });
}

export function scrollElementIntoView(
  element: HTMLElement | null,
  shouldReduce: boolean | null | undefined,
  block: ScrollLogicalPosition = 'start'
): void {
  if (!element) return;
  element.scrollIntoView({ behavior: getScrollBehavior(shouldReduce), block });
}

export function scrollRefIntoView(
  ref: RefObject<HTMLElement>,
  shouldReduce: boolean | null | undefined,
  block: ScrollLogicalPosition = 'start'
): void {
  scrollElementIntoView(ref.current, shouldReduce, block);
}
