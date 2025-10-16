import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScrollIndicatorProps {
  show: boolean;
}

export function ScrollIndicator({ show }: ScrollIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show]);

  useEffect(() => {
    if (!visible) return;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="flex justify-center mb-6 animate-fade-in">
      <div className="animate-bounce-subtle">
        <ChevronDown className="w-6 h-6 text-slate-400" />
      </div>
    </div>
  );
}
