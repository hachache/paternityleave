import { useEffect, useState, useCallback } from 'react';

interface NavigationAnchorProps {
  show: boolean;
}

export function NavigationAnchor({ show }: NavigationAnchorProps) {
  const [activeSection, setActiveSection] = useState<string>('calendar');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!show) return;

    setTimeout(() => detectActiveSection(), 100);

    const handleScroll = () => {
      detectActiveSection();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
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
              font-semibold transition-all duration-300 ease-out
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
    </>
  );

  // Bottom nav pour mobile
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <nav className="pointer-events-auto flex justify-around gap-1 px-2 py-2 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-lg">
          {navContent}
        </nav>
      </div>
    );
  }

  // Top nav pour desktop
  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-center px-2 sm:px-4 py-3 sm:py-4 pointer-events-none">
      <nav className="pointer-events-auto flex gap-1.5 px-3 py-2.5 rounded-2xl bg-white/95 backdrop-blur-lg border border-slate-200/80 shadow-md transition-all duration-300">
        {navContent}
      </nav>
    </div>
  );
}
