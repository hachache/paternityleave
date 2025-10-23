import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface NavigationAnchorProps {
  show: boolean;
}

export function NavigationAnchor({ show }: NavigationAnchorProps) {
  const [activeSection, setActiveSection] = useState<string>('calendar');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sections = useMemo(() => [
    { id: 'calendar', label: '📅 Calendrier', shortLabel: '📅' },
    { id: 'summary', label: '📊 Résumé', shortLabel: '📊' },
    { id: 'letter', label: '📬 Lettre', shortLabel: '📬' },
    { id: 'legal', label: '⚖️ Légal', shortLabel: '⚖️' }
  ] as const, []);

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
    if (!show || isMobile) return; // Skip observer on mobile for performance
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
          rootMargin: '-80px 0px -80px 0px', // Fixed values: consistent detection // Aligné avec scroll-mt-20 (80px) pour cohérence
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
  }, [show, isMobile, sections, detectActiveSection]); // Retiré activeSection pour éviter boucle

  useEffect(() => {
    if (!show) return;
    // Initial detection seulement si IntersectionObserver n'est pas supporté
    if (!('IntersectionObserver' in window)) {
      const id = window.setTimeout(() => detectActiveSection(), 100);
      return () => window.clearTimeout(id);
    }
  }, [show, detectActiveSection]);

  if (!show) return null;

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
              relative px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-sm
              font-semibold whitespace-nowrap
              ${
                isActive
                  ? 'text-white bg-gradient-to-b from-teal-500 to-teal-600 shadow-lg'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
              }
            `}
            style={{
              transition: 'background 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), color 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: isActive ? 'scale(1)' : 'scale(0.98)'
            }}
            title={section.label}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(section.id);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <span className="hidden sm:inline">{section.label}</span>
            <span className="sm:hidden">{section.shortLabel}</span>
          </a>
        );
      })}
    </>
  );

  // Masquer la barre de navigation sur mobile
  if (isMobile) {
    return null;
  }

  // Top nav pour desktop
  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-center px-2 sm:px-4 py-3 sm:py-4 pointer-events-none">
      <nav
        className="pointer-events-auto flex gap-1.5 px-3 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-200/80 dark:border-slate-600 shadow-md"
        style={{
          transition: 'box-shadow 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {navContent}
      </nav>
    </div>
  );
}
