import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  show: boolean;
}

export function ScrollIndicator({ show }: ScrollIndicatorProps) {
  return (
    <div className="flex justify-center mb-6 h-8" aria-hidden={!show}>
      <div
        className={`transition-all duration-500 ease-out flex items-center justify-center ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <ChevronDown
          className="w-6 h-6 text-slate-400 animate-bounce"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}
