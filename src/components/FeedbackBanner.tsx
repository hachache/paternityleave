interface FeedbackBannerProps {
  tone: 'success' | 'error' | 'info';
  message: string;
  title?: string;
}

const toneStyles: Record<FeedbackBannerProps['tone'], string> = {
  success: 'bg-success-50/60 border-success-500/35 text-emerald-100 shadow-emerald-500/10',
  error: 'bg-red-950/40 border-red-500/40 text-red-100 shadow-red-500/10',
  info: 'bg-brand-50/70 border-brand-500/35 text-brand-100 shadow-brand-500/10'
};

const toneIcon: Record<FeedbackBannerProps['tone'], string> = {
  success: '✓',
  error: '!',
  info: 'ℹ︎'
};

const iconStyles: Record<FeedbackBannerProps['tone'], string> = {
  success: 'bg-success-500/20 text-success-500',
  error: 'bg-red-500/20 text-red-300',
  info: 'bg-brand-500/20 text-brand-700'
};

export function FeedbackBanner({ tone, message, title }: FeedbackBannerProps) {
  return (
    <div
      role="alert"
      className={`backdrop-blur-sm rounded-2xl border px-5 py-4 shadow-soft animate-fade-in-up ${toneStyles[tone]}`}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${iconStyles[tone]}`}>
          {toneIcon[tone]}
        </div>
        <div className="flex-1">
          {title && <p className="font-bold text-sm uppercase tracking-wide opacity-80 mb-1">{title}</p>}
          <p className="text-base font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
