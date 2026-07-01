import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  show: boolean;
}

export function ScrollIndicator({ show }: ScrollIndicatorProps) {
  // Always render a fixed-height wrapper so the page layout stays stable.
  return (
    <div className="flex justify-center mb-6 h-8" aria-hidden={!show}>
      <div className={`transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'}`}>
        <ChevronDown className="w-6 h-6 text-slate-400" />
      </div>
    </div>
  );
}
