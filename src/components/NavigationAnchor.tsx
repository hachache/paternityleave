import { useEffect, useState, useCallback } from 'react';

interface NavigationAnchorProps {
  show: boolean;
}

export function NavigationAnchor({ show }: NavigationAnchorProps) {
  const [activeSection, setActiveSection] = useState<string>('calendar');

  const sections = [
    { id: 'calendar', label: '📅 Calendrier', shortLabel: '📅' },
    { id: 'summary', label: '📊 Résumé', shortLabel: '📊' },
    { id: 'letter', label: '📬 Lettre', shortLabel: '📬' },
    { id: 'legal', label: '⚖️ Légal', shortLabel: '⚖️' }
  ] as const;

  const detectActiveSection = useCallback(() => {
    const sectionElements = sections.map(section => ({
      id: section.id,
      element: document.getElementById(section.id)
    })).filter(item => item.element);

    if (sectionElements.length === 0) return;

    // Trouver quelle section est la plus proche du top de la fenêtre
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
  }, []);

  useEffect(() => {
    if (!show) return;

    // Détecter au chargement
    setTimeout(() => detectActiveSection(), 100);

    // Détecter au scroll
    const handleScroll = () => detectActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [show, detectActiveSection]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 pointer-events-none">
      <nav className="pointer-events-auto flex gap-1.5 px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-lg border border-slate-200/80 shadow-md transition-all duration-300">
        {sections.map(section => {
          const isActive = activeSection === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`
                relative px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold
                transition-all duration-300 ease-out
                ${
                  isActive
                    ? 'text-white bg-gradient-to-b from-teal-500 to-teal-600 shadow-lg'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                }
                active:scale-95 hover:scale-105 whitespace-nowrap
              `}
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
      </nav>
    </div>
  );
}
