interface FeedbackBannerProps {
  tone: 'success' | 'error' | 'info';
  message: string;
  title?: string;
}

const toneStyles: Record<FeedbackBannerProps['tone'], string> = {
  success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  error: 'bg-rose-50 border-red-300 text-red-900',
  info: 'bg-slate-50 border-slate-300 text-slate-900'
};

const toneIcon: Record<FeedbackBannerProps['tone'], string> = {
  success: '✓',
  error: '!',
  info: 'ℹ︎'
};

export function FeedbackBanner({ tone, message, title }: FeedbackBannerProps) {
  return (
    <div
      role="alert"
      className={`rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 shadow-sm ${toneStyles[tone]}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-sm font-bold text-slate-700">
          {toneIcon[tone]}
        </div>
        <div className="flex-1 text-sm sm:text-base">
          {title && <p className="font-semibold">{title}</p>}
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
