interface FeedbackBannerProps {
  tone: 'success' | 'error' | 'info';
  message: string;
  title?: string;
}

const containerStyles: Record<FeedbackBannerProps['tone'], string> = {
  success: 'bg-gradient-to-r from-emerald-50 to-emerald-50/60 border-emerald-200 text-emerald-900 shadow-emerald-500/5',
  error: 'bg-gradient-to-r from-red-50 to-red-50/60 border-red-200 text-red-900 shadow-red-500/5',
  info: 'bg-gradient-to-r from-blue-50 to-blue-50/60 border-blue-200 text-blue-900 shadow-blue-500/5'
};

const iconStyles: Record<FeedbackBannerProps['tone'], string> = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white'
};

const toneIcons: Record<FeedbackBannerProps['tone'], string> = {
  success: '✓',
  error: '!',
  info: 'i'
};

export function FeedbackBanner({ tone, message, title }: FeedbackBannerProps) {
  return (
    <div
      role="alert"
      className={`backdrop-blur-sm rounded-2xl border px-5 py-4 shadow-soft ${containerStyles[tone]}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${iconStyles[tone]}`}
          aria-hidden="true"
        >
          {toneIcons[tone]}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-bold text-sm tracking-wide opacity-80 mb-1">{title}</p>
          )}
          <p className="text-sm sm:text-base font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
