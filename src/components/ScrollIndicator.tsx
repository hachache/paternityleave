import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScrollIndicatorProps {
  show: boolean;
}

export function ScrollIndicator({ show }: ScrollIndicatorProps) {
  // Track whether indicator should be visually shown,
  // but keep a fixed-height wrapper to avoid layout shifts.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (!visible) return;

    const handleScroll = (): void => {
      if (window.scrollY > 100) {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);

  // Always render a fixed-height wrapper so the page layout stays stable.
  return (
    <div className="flex justify-center mb-6 h-8" aria-hidden={!visible}>
      <div className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="animate-bounce-subtle">
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
