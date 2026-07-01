import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAppMotion } from '../lib/motion';
import { scrollElementIntoView } from '../lib/scroll';

interface NavigationAnchorProps {
  show: boolean;
  showSupplementaryLink?: boolean;
}

export function NavigationAnchor({ show, showSupplementaryLink = false }: NavigationAnchorProps) {
  const [activeSection, setActiveSection] = useState<string>('calendar');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { shouldReduce } = useAppMotion();

  const sections = useMemo(() => {
    const items = [
      { id: 'calendar', label: 'Calendrier', shortLabel: 'Date' },
      { id: 'summary', label: 'Résumé', shortLabel: 'Récap' }
    ] as Array<{ id: string; label: string; shortLabel: string }>;

    if (showSupplementaryLink) {
      items.push({ id: 'conge-supplementaire', label: 'Congé 2026', shortLabel: '2026' });
    }

    items.push(
      { id: 'letter', label: 'Courrier', shortLabel: 'Doc' },
      { id: 'legal', label: 'Légal', shortLabel: 'Légal' }
    );

    return items;
  }, [showSupplementaryLink]);

  const detectActiveSection = useCallback(() => {
    // Fallback for environments without IntersectionObserver
    const sectionElements = sections
      .map(section => ({ id: section.id, element: document.getElementById(section.id) }))
      .filter(item => item.element);
    if (sectionElements.length === 0) return;
    let closestSection = sectionElements[0];
    let closestDistance = Math.abs(closestSection.element!.getBoundingClientRect().top);
    sectionElements.forEach(item => {
      const distance = Math.abs(item.element!.getBoundingClientRect().top);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = item;
      }
    });
    setActiveSection(closestSection.id);
  }, [sections]);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    if (!show) return;
    if ('IntersectionObserver' in window) {
      const targets = sections
        .map(s => document.getElementById(s.id))
        .filter((el): el is HTMLElement => Boolean(el));
      if (targets.length === 0) return;

      const ratios = new Map<string, number>();
      const debounceTimerRef = { current: null as NodeJS.Timeout | null };

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const id = (entry.target as HTMLElement).id;
            ratios.set(id, entry.intersectionRatio);
          });

          // Debounce pour éviter le clignotement
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = setTimeout(() => {
            // Pick the section with the highest ratio
            let bestId = '';
            let best = -1;
            ratios.forEach((ratio, id) => {
              if (ratio > best) {
                best = ratio;
                bestId = id;
              }
            });
            if (bestId && best > 0.05) {
              setActiveSection(bestId);
            }
            debounceTimerRef.current = null;
          }, 150); // Debounce de 150ms pour plus de stabilité
        },
        {
          root: null,
          rootMargin: isMobile ? '-96px 0px -120px 0px' : '-80px 0px -80px 0px',
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] // Optimized: 5 thresholds instead of 13 for better performance
        }
      );
      targets.forEach(el => io.observe(el));
      observerRef.current = io;
      return () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        io.disconnect();
        observerRef.current = null;
      };
    } else {
      // Fallback: measure once
      detectActiveSection();
    }
  }, [show, isMobile, sections, detectActiveSection]);

  useEffect(() => {
    if (!show) return;
    // Initial detection seulement si IntersectionObserver n'est pas supporté
    if (!('IntersectionObserver' in window)) {
      const id = globalThis.setTimeout(() => detectActiveSection(), 100);
      return () => globalThis.clearTimeout(id);
    }
  }, [show, detectActiveSection]);

  // Navigation réutilisable
  const navContent = (
    <>
      {sections.map(section => {
        const isActive = activeSection === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`
              relative isolate px-2 sm:px-3 md:px-5 py-3 sm:py-2 rounded-xl text-xs sm:text-sm md:text-sm
              font-semibold whitespace-nowrap flex-1 sm:flex-none text-center flex items-center justify-center min-h-[44px] transition-colors duration-200
              ${
                isActive
                  ? 'text-white bg-brand-600 shadow-lg'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
              }
            `}
            style={{
              transform: isActive ? 'scale(1)' : 'scale(0.98)'
            }}
            title={section.label}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(section.id);
              scrollElementIntoView(element, shouldReduce);
            }}
          >
            <span className="relative z-10 hidden sm:inline">{section.label}</span>
            <span className="relative z-10 sm:hidden">{section.shortLabel}</span>
          </a>
        );
      })}
    </>
  );

  // Top nav desktop, bottom nav mobile
  return (
    show ? (
      <div className={`fixed bottom-0 sm:bottom-auto sm:top-0 left-0 right-0 z-40 flex justify-center px-2 sm:px-4 py-3 sm:py-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4 pointer-events-none ${shouldReduce ? '' : 'reveal-subtle'}`}>
        <nav
          aria-label="Navigation de la page"
          className="pointer-events-auto flex gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-lg border border-slate-200/80 shadow-md w-full max-w-md sm:max-w-none sm:w-auto justify-between sm:justify-start transition-colors duration-200"
        >
          {navContent}
        </nav>
      </div>
    ) : null
  );
}
